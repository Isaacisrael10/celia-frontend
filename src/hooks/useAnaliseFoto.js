import { useEffect, useRef, useState } from 'react'
import { analisarFoto, modeloPronto } from '../services/visaoApi'
import { gerarMiniatura } from '../services/miniatura'
import { tipoDoResultado, caixasDaResposta } from '../domain/visao'

/*
  Custom hook da foto do reporte.
  Quando a pessoa escolhe a foto:
  1. mostra a foto na tela
  2. gera a miniatura (para salvar na MockAPI)
  3. manda para a IA de visão
     - deu certo → guarda o resultado e as caixas
     - API fora do ar → PLANO B: o reporte segue como "Não analisada"

  estado: 'vazio' | 'preparando' | 'analisando' | 'analisada' | 'planoB' | 'erro'
  'preparando': a API está ligando a IA (aquecendo o modelo); o app pergunta de 2 em 2 s

  - aoAnalisar(tipo): (opcional) chamada quando a IA termina; o formulário usa para
    pedir a descrição sugerida para a Prefeitura [HU-22, RF21]
*/

// Pergunta a cada 2 s se a IA ficou pronta, por até 2 minutos (60 vezes)
const ESPERA_MODELO_MS = 2000
const MAX_PERGUNTAS_MODELO = 60

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useAnaliseFoto(aoAnalisar) {
  const [estado, setEstado] = useState('vazio')
  const [previa, setPrevia] = useState('') // endereço da foto para mostrar na tela
  const [miniatura, setMiniatura] = useState('')
  const [tipo, setTipo] = useState('nao_analisada')
  const [caixas, setCaixas] = useState([])
  const [erro, setErro] = useState('')

  // Conta as fotos escolhidas: se a pessoa trocar de foto no meio, ignoramos a resposta antiga
  const ultimaFoto = useRef(0)

  // Libera da memória a prévia antiga quando ela muda ou a tela fecha
  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa)
    }
  }, [previa])

  async function escolherFoto(arquivo) {
    if (!arquivo) return
    if (!arquivo.type.startsWith('image/')) {
      setEstado('erro')
      setErro('Escolha uma foto (arquivo de imagem).')
      return
    }

    const numero = ++ultimaFoto.current
    setPrevia(URL.createObjectURL(arquivo))
    setEstado('analisando')
    setErro('')
    setCaixas([])

    try {
      setMiniatura(await gerarMiniatura(arquivo))
    } catch (e) {
      if (numero !== ultimaFoto.current) return
      setEstado('erro')
      setErro(e.message)
      return
    }

    try {
      // A IA ainda está ligando? Mostra "Preparando a IA" até ela ficar pronta
      let pronto = await modeloPronto()
      for (let i = 0; !pronto && i < MAX_PERGUNTAS_MODELO; i++) {
        if (numero !== ultimaFoto.current) return
        setEstado('preparando')
        await esperar(ESPERA_MODELO_MS)
        pronto = await modeloPronto()
      }
      if (numero !== ultimaFoto.current) return
      setEstado('analisando')

      const resposta = await analisarFoto(arquivo)
      if (numero !== ultimaFoto.current) return
      const tipoDaIa = tipoDoResultado(resposta.resultado)
      setTipo(tipoDaIa)
      setCaixas(caixasDaResposta(resposta))
      setEstado('analisada')
      if (aoAnalisar) aoAnalisar(tipoDaIa)
    } catch {
      if (numero !== ultimaFoto.current) return
      // Plano B: nunca mostramos erro cru, o reporte segue sem análise
      setTipo('nao_analisada')
      setEstado('planoB')
    }
  }

  return { estado, previa, miniatura, tipo, caixas, erro, escolherFoto }
}
