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

// Ordem da lista de trechos: o que pede mais cuidado primeiro
const ORDEM_DA_LISTA = { perigo: 0, atencao: 1, semDados: 2, normal: 3 }

// Devolve uma cópia da lista, do trecho mais grave para o menos grave
export function ordenarPorCuidado(trechos) {
  return [...trechos].sort((a, b) => ORDEM_DA_LISTA[a.faixa.id] - ORDEM_DA_LISTA[b.faixa.id])
}

/*
  Trechos que ganham selo no mapa: só Atenção (!) e Perigo (✕).
  Perigo vem primeiro: quando dois selos não cabem lado a lado, aparece o mais grave.
*/
export function trechosComSelo(trechos) {
  const prioridade = { perigo: 0, atencao: 1 }
  return trechos
    .filter((t) => t.faixa.id === 'atencao' || t.faixa.id === 'perigo')
    .sort((a, b) => prioridade[a.faixa.id] - prioridade[b.faixa.id])
}

/*
  Converte os trechos para GeoJSON, o formato que o mapa entende.
  Cada trecho vira uma linha, com o id e a faixa guardados em "properties".
*/
export function trechosEmGeoJson(trechos) {
  return {
    type: 'FeatureCollection',
    features: trechos.map((t) => ({
      type: 'Feature',
      properties: { id: t.id, faixa: t.faixa.id },
      geometry: { type: 'LineString', coordinates: t.coords },
    })),
  }
}

/*
  As duas pontas de cada trecho, em GeoJSON (viram bolinhas no mapa,
  como as mãos e os pés do símbolo de acessibilidade). Trecho sem dados não ganha bolinha.
*/
export function pontasEmGeoJson(trechos) {
  return {
    type: 'FeatureCollection',
    features: trechos
      .filter((t) => t.faixa.id !== 'semDados')
      .flatMap((t) =>
        [t.coords[0], t.coords[t.coords.length - 1]].map((ponto) => ({
          type: 'Feature',
          properties: { faixa: t.faixa.id },
          geometry: { type: 'Point', coordinates: ponto },
        })),
      ),
  }
}
