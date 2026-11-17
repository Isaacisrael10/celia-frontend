import { useMemo, useState } from 'react'
import { trechosComSelo, meioDoTrecho } from '../domain/trechos'

// Distância mínima (em px na tela) entre dois selos ! e ✕ para eles não ficarem um em cima do outro
const DISTANCIA_SELOS = 40

/*
  Custom hook dos selos ! e ✕ do mapa.
  Trechos em Atenção e Perigo ganham um selo no meio. Quando o mapa está afastado,
  dois selos podem cair um em cima do outro: aí só o mais grave aparece
  (o trecho continua colorido, e a Lista mostra todos).

  - trechos: lista de trechos já com a faixa calculada
  Devolve:
  - selos: os trechos cujo selo cabe na tela agora
  - guardarCamera(evento): ligar no onLoad e no onMoveEnd do mapa, para refazer a conta
*/
export function useSelosDoMapa(trechos) {
  // O mapa no último enquadramento: muda quando o mapa carrega e quando para de mexer
  const [camera, setCamera] = useState(null)

  function guardarCamera(evento) {
    setCamera({ mapa: evento.target, quando: Date.now() })
  }

  // Candidatos a selo, do mais grave para o menos grave
  const candidatos = useMemo(() => trechosComSelo(trechos), [trechos])

  // Passa pelos candidatos em ordem e só fica com o selo que está longe dos já escolhidos
  const selos = useMemo(() => {
    if (!camera) return []
    const escolhidos = []
    for (const trecho of candidatos) {
      // project: converte [lng, lat] na posição em pixels dentro do mapa
      const ponto = camera.mapa.project(meioDoTrecho(trecho))
      const longeDeTodos = escolhidos.every(
        (e) => Math.hypot(e.x - ponto.x, e.y - ponto.y) >= DISTANCIA_SELOS,
      )
      if (longeDeTodos) escolhidos.push({ trecho, x: ponto.x, y: ponto.y })
    }
    return escolhidos.map((e) => e.trecho)
  }, [camera, candidatos])

  return { selos, guardarCamera }
}
