/*
  Busca de endereços e lugares no Nominatim (OpenStreetMap). Gratuito, sem chave.
  Regra de uso do serviço: no máximo 1 busca por segundo e nada de buscar a cada letra
  digitada. Por isso só buscamos quando a pessoa aperta "Buscar" ou salva um reporte.
*/

import { lerJson } from './lerJson'

const URL_BUSCA = 'https://nominatim.openstreetmap.org/search'

/*
  Procura um lugar pelo texto. Devolve até 5 resultados:
  [{ nome, lat, lng, area: [[oeste, sul], [leste, norte]] }]
*/
export async function buscarLugar(texto) {
  const parametros = new URLSearchParams({
    q: texto,
    format: 'json',
    limit: '5',
    countrycodes: 'br',
    'accept-language': 'pt-BR',
    // Dá preferência a resultados no Rio de Janeiro, sem bloquear o resto do Brasil
    viewbox: '-43.80,-22.75,-43.10,-23.08',
  })

  let resposta
  try {
    resposta = await fetch(URL_BUSCA + '?' + parametros)
  } catch {
    throw new Error('Sem conexão com a internet.')
  }
  if (!resposta.ok) {
    throw new Error('A busca não respondeu agora. Tente de novo.')
  }

  const lista = await lerJson(resposta, 'A busca não respondeu agora. Tente de novo.')
  if (!Array.isArray(lista)) return [] // resposta fora do formato: trata como "nada encontrado"
  return lista.map((r) => ({
    nome: r.display_name,
    lat: Number(r.lat),
    lng: Number(r.lon),
    // boundingbox vem como [sul, norte, oeste, leste]
    area: [
      [Number(r.boundingbox[2]), Number(r.boundingbox[0])],
      [Number(r.boundingbox[3]), Number(r.boundingbox[1])],
    ],
  }))
}

/*
  Busca reversa: dado um ponto do mapa, devolve o endereço em texto.
  Ex.: (-22.9253, -43.2663) → "Rua Grajaú, 300". Devolve '' se não achar.
*/
export async function enderecoDoPonto(lat, lng) {
  const parametros = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    zoom: '18',
    'accept-language': 'pt-BR',
  })
  try {
    const resposta = await fetch('https://nominatim.openstreetmap.org/reverse?' + parametros)
    if (!resposta.ok) return ''
    const dados = await resposta.json()
    const a = dados.address || {}
    const rua = a.road || a.pedestrian || a.footway || ''
    if (!rua) return ''
    return a.house_number ? rua + ', ' + a.house_number : rua + ', '
  } catch {
    return ''
  }
}

// Acha as coordenadas de um endereço (usado ao salvar um reporte). Devolve null se não achar.
export async function coordenadasDoEndereco(endereco) {
  try {
    const resultados = await buscarLugar(endereco + ', Rio de Janeiro')
    return resultados.length > 0 ? { lat: resultados[0].lat, lng: resultados[0].lng } : null
  } catch {
    return null
  }
}
