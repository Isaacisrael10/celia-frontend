/*
  Leitura do poste no ThingSpeak (canal público, sem chave).
  Só busca e traduz os campos: não sabe nada de React nem de tela.

  field1 temperatura · field2 umidade · field3 índice de calor
  field4 distância livre (cm) · field5 status · field6 motivo
*/
import { THINGSPEAK_CHANNEL_ID } from './config'

// Converte o texto do ThingSpeak em número (ou null se vier vazio)
function numero(valor) {
  if (valor === null || valor === undefined || valor === '') return null
  const n = Number(valor)
  return isNaN(n) ? null : n
}

// Busca as últimas leituras do poste. Devolve a lista da mais antiga para a mais nova.
export async function buscarLeituras(quantidade = 20) {
  if (!THINGSPEAK_CHANNEL_ID) {
    throw new Error('O poste ainda não está conectado.')
  }

  const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?results=${quantidade}`
  let resposta
  try {
    resposta = await fetch(url)
  } catch {
    throw new Error('Sem conexão com a internet.')
  }
  if (!resposta.ok) {
    throw new Error('Não deu para ler o poste agora.')
  }

  const json = await resposta.json()
  return (json.feeds || []).map((f) => ({
    data: f.created_at,
    temperatura: numero(f.field1),
    umidade: numero(f.field2),
    indiceCalor: numero(f.field3),
    distancia: numero(f.field4),
    status: numero(f.field5),
    motivo: numero(f.field6),
  }))
}
