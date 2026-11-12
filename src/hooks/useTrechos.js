import { useMemo } from 'react'
import dadosTrechos from '../data/trechos.json'
import { useStatusPoste } from './useStatusPoste'
import { situacaoDoTrecho } from '../domain/trechos'

/*
  Custom hook dos trechos do mapa.
  Junta os trechos fixos (trechos.json) com o poste ao vivo
  e devolve cada trecho já com { faixa, motivo, aoVivo }.
*/
export function useTrechos() {
  const poste = useStatusPoste()
  const { faixa, motivo } = poste

  // Só recalcula quando a faixa ou o motivo do poste mudam
  const trechos = useMemo(
    () => dadosTrechos.map((t) => ({ ...t, ...situacaoDoTrecho(t, { faixa, motivo }) })),
    [faixa, motivo],
  )

  return { trechos, poste }
}
