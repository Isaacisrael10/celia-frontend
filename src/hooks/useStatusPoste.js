import { useEffect, useState } from 'react'
import { buscarLeituras } from '../services/thingspeak'
import { leituraRecente } from '../domain/poste'
import { faixaDoStatus, FAIXAS } from '../domain/faixas'

// O ESP32 envia a cada 20 s, então buscamos no mesmo ritmo
const INTERVALO_MS = 20000

/*
  Custom hook do poste ao vivo.
  Lê o ThingSpeak a cada 20 s e já devolve tudo traduzido para a tela:
  - leitura: a mais recente (temperatura, umidade, índice de calor, distância, status, motivo, data)
  - historico: as últimas 20 leituras
  - recente: false se passou dos 10 minutos (aí a faixa vira "Sem dados")
  - faixa / motivo: prontos para o BadgeFaixa
*/
export function useStatusPoste() {
  const [historico, setHistorico] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  // Hora da última busca: usada para conferir a regra dos 10 minutos
  const [agora, setAgora] = useState(() => Date.now())

  useEffect(() => {
    let ativo = true

    function buscar() {
      buscarLeituras()
        .then((lista) => {
          if (!ativo) return
          setHistorico(lista)
          setErro('')
        })
        .catch((e) => {
          if (ativo) setErro(e.message)
        })
        .finally(() => {
          if (!ativo) return
          setCarregando(false)
          setAgora(Date.now())
        })
    }

    buscar() // primeira busca ao abrir
    const timer = setInterval(buscar, INTERVALO_MS)

    // Ao sair da tela, para de buscar
    return () => {
      ativo = false
      clearInterval(timer)
    }
  }, [])

  const leitura = historico.length > 0 ? historico[historico.length - 1] : null
  const recente = leituraRecente(leitura, agora)

  return {
    leitura,
    historico,
    recente,
    agora,
    faixa: recente ? faixaDoStatus(leitura.status) : FAIXAS.semDados,
    motivo: recente ? leitura.motivo : 0,
    carregando,
    erro,
  }
}
