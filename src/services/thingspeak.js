/*
  Leitura do poste no ThingSpeak (canal público, sem chave).
  Só busca e traduz os campos: não sabe nada de React nem de tela.

  field1 temperatura · field2 umidade · field3 índice de calor
  field4 distância livre (cm) · field5 status · field6 motivo
*/
import { THINGSPEAK_CHANNEL_ID } from './config'

// Converte o texto do ThingSpeak em número (ou null se vier vazio). Ex.: "26.0" → 26
function numero(valor) {
  if (valor === null || valor === undefined || valor === '') return null
  const n = Number(valor)
  return isNaN(n) ? null : n
}

/*
  Número dentro de uma faixa possível; fora dela vira null.
  O canal tem registros antigos de teste com valores absurdos (80 °C, índice de calor 708):
  assim eles não quebram a tela nem disparam alerta falso.
*/
function medida(valor, minimo, maximo) {
  const n = numero(valor)
  if (n === null || n < minimo || n > maximo) return null
  return n
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
    temperatura: medida(f.field1, -10, 60),
    umidade: medida(f.field2, 0, 100),
    indiceCalor: medida(f.field3, -10, 70),
    distancia: medida(f.field4, 0, 1000),
    status: numero(f.field5),
    motivo: numero(f.field6),
  }))
}
