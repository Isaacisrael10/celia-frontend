/*
  Regras do poste (sem React).
*/

// Se a última leitura tem mais de 10 minutos, o poste conta como "Sem dados"
export const LIMITE_MINUTOS = 10

// Quantos minutos se passaram desde a leitura
export function minutosDesde(dataIso, agora) {
  const data = new Date(dataIso).getTime()
  if (isNaN(data)) return Infinity
  return Math.floor((agora - data) / 60000)
}

// A leitura ainda vale? (regra dos 10 minutos)
export function leituraRecente(leitura, agora) {
  if (!leitura) return false
  return minutosDesde(leitura.data, agora) <= LIMITE_MINUTOS
}

// Medida arredondada com a unidade, ou "—" se o sensor não mandou. Ex.: (31.6, '°C') → "32 °C"
export function textoDaMedida(numero, unidade) {
  return numero === null ? '—' : Math.round(numero) + ' ' + unidade
}

// Ex.: "2026-11-12T14:32:00Z" → "14:32" (no horário do aparelho da pessoa)
export function horaDaLeitura(dataIso) {
  return new Date(dataIso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Ex.: 0 → "agora há pouco" · 1 → "há 1 min" · 25 → "há 25 min"
export function textoAtualizado(dataIso, agora) {
  const min = minutosDesde(dataIso, agora)
  if (min < 1) return 'Atualizado agora há pouco'
  if (min < 60) return 'Atualizado há ' + min + ' min'
  return 'Sem dados recentes'
}
