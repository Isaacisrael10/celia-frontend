import { useRef, useState } from 'react'
import { useChamadaApi } from './useChamadaApi'
import { useCronometro } from './useCronometro'
import { analisarFoto } from '../services/visaoApi'
import { sugerirDescricao } from '../services/assistenteApi'
import { caixasDaResposta } from '../domain/visao'
import { textoSuficiente } from '../domain/descricaoIa'

/*
  Custom hook da descrição por IA no reporte do cidadão [HU-05, HU-22, RF08, RF09, RF21, RN05, RN07].

  Ordem das IAs (decisão do João, 18/11/2026). O Gemini nunca recebe a foto, só o tipo, o
  local e o texto: por isso, sem esta conferência, uma foto de caderno virava report de buraco.
  - Buraco: primeiro o YOLO (/analisar) confere a foto. Só se ele achar buraco o Gemini escreve.
    Se não achar, o Gemini NÃO escreve, mas o cidadão ainda pode escrever e enviar: o modelo
    acha cerca de 7 em cada 10 buracos (recall 69,8% no teste).
  - Obstáculo: o YOLO não reconhece obstáculos. O Gemini só escreve depois que o cidadão conta
    o que viu (botão), e organiza esse texto para a Prefeitura.
  - Se os 3 modelos do Gemini falharem: pop-up com o motivo e o texto padrão (plano B).

  etapa: 'semFoto' | 'conferindo' (YOLO rodando) | 'comBuraco' | 'semBuraco'
         | 'visaoFora' (API de visão não respondeu) | 'obstaculo'
*/
export function useDescricaoIa() {
  const [etapa, setEtapa] = useState('semFoto')
  const [caixas, setCaixas] = useState([]) // buracos que o YOLO marcou, para desenhar na foto
  const [sugestao, setSugestao] = useState('')
  const [popupAberto, setPopupAberto] = useState(false)

  // Sem novas tentativas automáticas: a API já tentou os 3 modelos do Gemini antes de dar erro.
  // Tentar mais 3 rodadas deixava a pessoa minutos esperando; o pop-up oferece "Tentar de novo".
  const chamada = useChamadaApi([])

  const arquivo = useRef(null) // foto escolhida (o YOLO precisa do arquivo inteiro)
  const fotoAtual = useRef(0) // conta as conferências: ignora a resposta de uma foto já trocada

  // Cronômetro dos cards de espera; recomeça do zero ao passar do YOLO para o Gemini
  const conferindo = etapa === 'conferindo'
  const segundos = useCronometro(conferindo || chamada.carregando, conferindo ? 'yolo' : 'gemini')

  async function pedirAoGemini(tipo, local, texto) {
    setSugestao('')
    setPopupAberto(false)
    const r = await chamada.executar(() => sugerirDescricao(tipo, local, texto))
    if (r) setSugestao(r.descricao_sugerida)
    else setPopupAberto(true) // os 3 modelos falharam ou a API está fora: motivo + plano B
  }

  async function conferirFoto(foto, dados) {
    const numero = ++fotoAtual.current
    setEtapa('conferindo')
    setCaixas([])
    setSugestao('')

    let resposta
    try {
      resposta = await analisarFoto(foto)
    } catch {
      if (numero === fotoAtual.current) setEtapa('visaoFora')
      return
    }
    if (numero !== fotoAtual.current) return // a pessoa trocou a foto ou o tipo no meio

    if (resposta.resultado !== 'buraco') {
      setEtapa('semBuraco')
      return
    }
    setCaixas(caixasDaResposta(resposta))
    setEtapa('comBuraco')
    await pedirAoGemini('buraco', dados.rua, dados.descricao)
  }

  // A foto ficou pronta. Ex.: aoEscolherFoto(arquivo, 'buraco', dados)
  function aoEscolherFoto(foto, tipo, dados) {
    arquivo.current = foto
    if (tipo === 'buraco') {
      conferirFoto(foto, dados)
    } else {
      fotoAtual.current++
      setCaixas([])
      setSugestao('')
      setEtapa('obstaculo')
    }
  }

  // O tipo mudou: buraco confere a foto de novo; obstáculo espera o texto do cidadão
  function aoMudarTipo(tipo, dados) {
    setSugestao('')
    setPopupAberto(false)
    if (!arquivo.current) return
    aoEscolherFoto(arquivo.current, tipo, dados)
  }

  // Botões "Gerar descrição", "Gerar outra" e "Tentar de novo"
  function gerar(tipo, dados) {
    if (tipo === 'buraco' && etapa !== 'comBuraco') return
    if (tipo === 'obstaculo' && !textoSuficiente(dados.descricao)) return
    pedirAoGemini(tipo, dados.rua, dados.descricao)
  }

  return {
    etapa,
    caixas,
    sugestao,
    popupAberto,
    segundos,
    carregando: chamada.carregando,
    erro: chamada.erro,
    indisponivel: chamada.indisponivel,
    aoEscolherFoto,
    aoMudarTipo,
    gerar,
    fecharPopup: () => setPopupAberto(false),
  }
}
