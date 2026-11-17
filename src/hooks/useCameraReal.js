import { useEffect, useRef, useState } from 'react'
import { buscarCapturasPoste, buscarReportesPoste, enderecoDaFoto } from '../services/posteApi'
import { ApiIndisponivel } from '../services/apiEquipe'
import { capturaRecente, reportePosteDaApi, etapaDaCapturaReal } from '../domain/prefeitura'
import { caixasDaResposta } from '../domain/visao'

/*
  Custom hook da câmera REAL do poste (ESP32-CAM) [HU-25, RF24].
  A cada 5 s pergunta à API qual é a última foto do poste e quais reports automáticos existem.
  - aoVivo: true se a câmera mandou foto nos últimos minutos (domain/prefeitura.js)
  - captura: a última foto (com resultado e caixas), ou null
  - reportes: os reports da API já no formato da caixa de entrada
  - apiNoAr: false quando a API não responde (aí a tela fica só com a simulação, RNF10)
  - camera e etapa: a última foto no MESMO formato da câmera simulada (useCameraPoste),
    para os componentes CameraPoste e EtapasPoste desenharem as duas do mesmo jeito
  - aoNovoReporte(reporte): (opcional) chamada quando chega um report que ainda não estava na lista
*/
const INTERVALO_MS = 5000

export function useCameraReal(poste, aoNovoReporte) {
  const [captura, setCaptura] = useState(null)
  const [reportesApi, setReportesApi] = useState([])
  const [apiNoAr, setApiNoAr] = useState(false)
  const [agora, setAgora] = useState(() => Date.now())

  // Ids dos reports já vistos: na primeira busca só guarda, não avisa (não eram "novos")
  const vistos = useRef(null)
  // Sempre a versão mais recente da função de aviso, sem reiniciar o intervalo
  const avisar = useRef(aoNovoReporte)
  useEffect(() => {
    avisar.current = aoNovoReporte
  })

  useEffect(() => {
    let ativo = true

    async function buscar() {
      try {
        const [capturas, reportes] = await Promise.all([
          buscarCapturasPoste(poste.id, 1),
          buscarReportesPoste(20),
        ])
        if (!ativo) return
        // Cada report vira um card da caixa de entrada, com a foto vinda da API
        const convertidos = reportes.map((r) => ({
          ...reportePosteDaApi(r, poste),
          fotoUrl: enderecoDaFoto(r.captura.foto),
        }))
        if (vistos.current !== null && avisar.current) {
          convertidos.filter((r) => !vistos.current.has(r.id)).forEach((r) => avisar.current(r))
        }
        vistos.current = new Set(convertidos.map((r) => r.id))
        setCaptura(capturas[0] || null)
        setReportesApi(convertidos)
        setApiNoAr(true)
      } catch (erro) {
        if (!ativo) return
        // API fora do ar (ou app publicado sem a API): fica com a simulação
        if (erro instanceof ApiIndisponivel || erro.codigo >= 500) setApiNoAr(false)
      }
      if (ativo) setAgora(Date.now())
    }

    buscar()
    const timer = setInterval(buscar, INTERVALO_MS)
    return () => {
      ativo = false
      clearInterval(timer)
    }
  }, [poste])

  const etapa = etapaDaCapturaReal(captura, reportesApi, agora)
  const camera = captura && {
    fase: etapa.fase,
    ligada: true,
    quadro: {
      id: 'real-' + captura.id,
      src: enderecoDaFoto(captura.foto),
      credito: 'foto real da ESP32-CAM, recebida às ' + new Date(captura.recebida_em).toLocaleTimeString('pt-BR'),
    },
    indice: 0,
    total: 1,
    // Mesma conversão da simulação: cada caixa ganha a classe "buraco" (o rótulo vira "Buraco 90%")
    caixas: caixasDaResposta({ caixas_buracos: captura.caixas }),
    // As caixas vêm em pixels da foto; capturas antigas não guardavam o tamanho (800 × 600 é o padrão)
    tamanho: { largura: captura.largura || 800, altura: captura.altura || 600 },
    tentativa: 0,
  }

  return {
    captura,
    camera,
    etapa,
    reportes: reportesApi,
    apiNoAr,
    aoVivo: apiNoAr && capturaRecente(captura, agora),
  }
}
