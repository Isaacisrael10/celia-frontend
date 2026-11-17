import { useEffect, useRef, useState } from 'react'
import { analisarFoto, modeloPronto } from '../services/visaoApi'
import { sugerirDescricao } from '../services/assistenteApi'
import { arquivoDoQuadro } from '../services/posteSimulado'
import { caixasDaResposta } from '../domain/visao'
import { montarReportePoste } from '../domain/prefeitura'
import { useChamadaApi } from './useChamadaApi'

/*
  Custom hook da câmera SIMULADA do poste (módulo Prefeitura).
  Faz uma "ronda": passa pelas fotos uma por uma, como se fossem capturas da câmera ao vivo.
  Em cada foto:
  1. capturando  → mostra a foto
  2. analisando  → manda para a IA de visão (POST /analisar, o mesmo YOLO da equipe).
                   A API também avisa o poste no Wokwi por MQTT [HU-07, RF10]
  3. livre       → nada a reportar, segue para a próxima
     escrevendo  → buraco! O Gemini escreve o reporte (POST /assistente/descricao)
  4. enviado     → o reporte vai SOZINHO para a lista da Prefeitura (reporte do poste não tem revisão)
     falhou      → o Gemini não respondeu; o buraco foi visto, mas o texto não saiu

  Outras fases: 'parada' (antes de ligar ou pausada), 'preparando' (a IA está ligando),
  'indisponivel' (a API não está rodando: plano B) e 'fim' (a ronda acabou).

  - poste: dados do poste · quadros: lista de { id, src, credito }
  - aoReportar(reporte): chamada quando o poste envia um reporte
*/

// Quanto tempo cada momento fica na tela (para dar tempo de ler)
const TEMPO_CAPTURA_MS = 1500
const TEMPO_MINIMO_ANALISE_MS = 1500
const TEMPO_LIVRE_MS = 3500
const TEMPO_DEPOIS_DO_ENVIO_MS = 6000
const ESPERA_MODELO_MS = 2000
const MAX_PERGUNTAS_MODELO = 60

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useCameraPoste({ poste, quadros, aoReportar }) {
  const [fase, setFase] = useState('parada')
  const [indice, setIndice] = useState(0)
  const [caixas, setCaixas] = useState([])
  // Tamanho da imagem que a IA analisou: as caixas vêm em pixels dessa imagem
  const [tamanho, setTamanho] = useState({ largura: 800, altura: 600 })
  const [texto, setTexto] = useState('') // último texto que o Gemini escreveu
  const [mqttEnviado, setMqttEnviado] = useState(null)
  const [buracos, setBuracos] = useState(0) // quantos reportes o poste enviou nesta ronda
  const chamadaGemini = useChamadaApi()

  /*
    Cada ronda recebe um número. Pausar ou sair da tela troca o número,
    e a ronda antiga para no próximo passo (ela confere se ainda é a "da vez").
  */
  const rodada = useRef(0)
  useEffect(() => {
    const contador = rodada
    return () => {
      contador.current++
    }
  }, [])

  async function rodar(numero, inicio) {
    const valendo = () => rodada.current === numero

    try {
      // A IA ainda está ligando? Espera até ficar pronta
      setFase('preparando')
      let pronto = await modeloPronto()
      for (let i = 0; !pronto && i < MAX_PERGUNTAS_MODELO; i++) {
        if (!valendo()) return
        await esperar(ESPERA_MODELO_MS)
        pronto = await modeloPronto()
      }

      for (let i = inicio; i < quadros.length; i++) {
        if (!valendo()) return
        const quadro = quadros[i]
        setIndice(i)
        setCaixas([])
        setTexto('')
        setMqttEnviado(null)
        setFase('capturando')
        await esperar(TEMPO_CAPTURA_MS)
        if (!valendo()) return

        setFase('analisando')
        // Promise.all: espera a resposta da IA e um tempo mínimo, para a animação aparecer
        const [resposta] = await Promise.all([
          arquivoDoQuadro(quadro).then(analisarFoto),
          esperar(TEMPO_MINIMO_ANALISE_MS),
        ])
        if (!valendo()) return
        const caixasDoQuadro = caixasDaResposta(resposta)
        setCaixas(caixasDoQuadro)
        setTamanho({ largura: resposta.largura || 800, altura: resposta.altura || 600 })
        setMqttEnviado(Boolean(resposta.mqtt_enviado))

        if (resposta.resultado !== 'buraco') {
          setFase('livre')
          await esperar(TEMPO_LIVRE_MS)
          continue
        }

        // Buraco: o Gemini escreve o reporte. Sem cidadão, então sem texto do cidadão.
        setFase('escrevendo')
        const r = await chamadaGemini.executar(() => sugerirDescricao('buraco', poste.local, ''))
        if (!valendo()) return
        if (r) {
          setTexto(r.descricao_sugerida)
          aoReportar(montarReportePoste(poste, quadro, caixasDoQuadro, r.descricao_sugerida))
          setBuracos((n) => n + 1)
          setFase('enviado')
        } else {
          setFase('falhou')
        }
        await esperar(TEMPO_DEPOIS_DO_ENVIO_MS)
      }

      if (valendo()) {
        setFase('fim')
        setIndice(0)
      }
    } catch {
      // A API não respondeu (ou não está rodando): plano B, nunca erro cru
      if (valendo()) setFase('indisponivel')
    }
  }

  // Liga a câmera. Continua do quadro onde parou (ou do começo, se a ronda acabou).
  function ligar() {
    const numero = ++rodada.current
    const inicio = fase === 'fim' || fase === 'indisponivel' ? 0 : indice
    if (inicio === 0) setBuracos(0)
    rodar(numero, inicio)
  }

  function pausar() {
    rodada.current++
    setFase('parada')
  }

  const ligada = !['parada', 'fim', 'indisponivel'].includes(fase)

  return {
    fase,
    ligada,
    quadro: quadros[indice],
    indice,
    total: quadros.length,
    caixas,
    tamanho,
    texto,
    mqttEnviado,
    buracos,
    tentativa: chamadaGemini.tentativa,
    ligar,
    pausar,
  }
}
