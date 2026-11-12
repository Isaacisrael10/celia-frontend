/*
  Regras dos trechos do mapa (sem React).

  De onde vem a faixa de cada trecho:
  1. Trecho com poste: a leitura ao vivo do ThingSpeak (ou "Sem dados" se passou de 10 min).
  2. Os outros: dado SIMULADO de exemplo (trechos.json), até termos mais postes.
     No README isso está explicado como "simulado".
*/
import { faixaDoStatus, FAIXAS } from './faixas'

/*
  Devolve a faixa e o motivo de um trecho.
  - trecho: um item de trechos.json
  - poste: o que o useStatusPoste devolve
*/
export function situacaoDoTrecho(trecho, poste) {
  if (trecho.poste) {
    return { faixa: poste.faixa, motivo: poste.motivo, aoVivo: true }
  }
  if (trecho.statusSimulado === null) {
    return { faixa: FAIXAS.semDados, motivo: 0, aoVivo: false }
  }
  return {
    faixa: faixaDoStatus(trecho.statusSimulado),
    motivo: trecho.motivoSimulado,
    aoVivo: false,
  }
}

// Nome do trecho para mostrar na tela. Ex.: "Rua General Roca · parte 2"
export function nomeDoTrecho(trecho) {
  return trecho.rua + ' · parte ' + trecho.parte
}

// Ponto do meio do trecho (onde vai o selo ! ou ✕)
export function meioDoTrecho(trecho) {
  return trecho.coords[Math.floor(trecho.coords.length / 2)]
}
