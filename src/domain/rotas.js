/*
  Regras das rotas (sem React).
  A recomendada é a mais SEGURA, não a mais curta.
*/
import { areaDosPontos } from './mapa'

// Gravidade de cada faixa: quanto maior, pior
const GRAVIDADE = { normal: 0, atencao: 1, semDados: 2, perigo: 3 }

/*
  Junta a rota com a situação de cada trecho e calcula o resumo.
  - rota: item de rotas.json
  - trechos: lista do useTrechos (cada um com faixa e motivo)
*/
export function analisarRota(rota, trechos) {
  const seus = rota.trechos.map((id) => trechos.find((t) => t.id === id)).filter(Boolean)

  // Pior trecho: o de maior gravidade
  let pior = seus[0]
  for (const t of seus) {
    if (GRAVIDADE[t.faixa.id] > GRAVIDADE[pior.faixa.id]) pior = t
  }

  // Quantos trechos em cada faixa. Ex.: { normal: 3, atencao: 1, perigo: 0, semDados: 0 }
  const contagem = { normal: 0, atencao: 0, perigo: 0, semDados: 0 }
  for (const t of seus) contagem[t.faixa.id]++

  return { ...rota, trechosDaRota: seus, pior, contagem }
}

/*
  Ordena da mais segura para a menos segura:
  1º menor gravidade do pior trecho · 2º menos trechos problemáticos · 3º menos minutos
*/
export function ordenarRotas(rotas) {
  return [...rotas].sort((a, b) => {
    const diferencaPior = GRAVIDADE[a.pior.faixa.id] - GRAVIDADE[b.pior.faixa.id]
    if (diferencaPior !== 0) return diferencaPior

    const problemasA = a.trechosDaRota.length - a.contagem.normal
    const problemasB = b.trechosDaRota.length - b.contagem.normal
    if (problemasA !== problemasB) return problemasA - problemasB

    return a.minutos - b.minutos
  })
}

// A rota passa por algum trecho em Perigo? Devolve o primeiro, ou null.
export function trechoEmPerigo(rota) {
  return rota.trechosDaRota.find((t) => t.faixa.id === 'perigo') || null
}

// Retângulo que cobre todos os trechos da rota (para o mapa enquadrar o caminho inteiro)
export function areaDaRota(rota) {
  return areaDosPontos(rota.trechosDaRota.flatMap((t) => t.coords))
}

// Ex.: 1.1 → "1,1 km"
export function textoDistancia(km) {
  return km.toLocaleString('pt-BR') + ' km'
}

/*
  Link do Google Maps com o caminho A PÉ passando pelas ruas desta rota.
  O Google traça o caminho sozinho; para ele não trocar de rua, mandamos pontos de passagem
  (waypoints): o meio de cada trecho da rota.
  - Saída e chegada: as duas pontas de trecho mais distantes entre si (as pontas da rota).
    A chegada é a que fica do lado do último trecho da lista (o ponto de ônibus do trabalho).
  - Pontos de passagem: o meio de cada trecho, do mais perto da saída ao mais longe,
    para o caminho nunca ir e voltar.
  - volta: true inverte saída e chegada (do trabalho para casa)
  Ex.: https://www.google.com/maps/dir/?api=1&origin=-22.91,-43.26&destination=...&waypoints=...|...&travelmode=walking
*/
export function linkRotaNoMaps(rota, volta = false) {
  const trechos = rota.trechosDaRota.filter((t) => t.coords && t.coords.length > 0)
  if (trechos.length === 0) return null

  // [lng, lat] (GeoJSON) → "lat,lng" (Google Maps)
  const texto = ([lng, lat]) => lat + ',' + lng
  const distancia = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
  const meio = (coords) => coords[Math.floor(coords.length / 2)]

  // As pontas de todos os trechos: as duas mais distantes entre si são o começo e o fim da rota
  const pontas = trechos.flatMap((t) => [t.coords[0], t.coords[t.coords.length - 1]])
  let saida = pontas[0]
  let chegada = pontas[1]
  for (const a of pontas) {
    for (const b of pontas) {
      if (distancia(a, b) > distancia(saida, chegada)) {
        saida = a
        chegada = b
      }
    }
  }

  // A chegada fica do lado do último trecho da lista (o ponto de ônibus do trabalho); se não, troca as duas
  const ultimo = meio(trechos[trechos.length - 1].coords)
  if (distancia(saida, ultimo) < distancia(chegada, ultimo)) {
    const troca = saida
    saida = chegada
    chegada = troca
  }
  if (volta) {
    const troca = saida
    saida = chegada
    chegada = troca
  }

  // Pontos de passagem em ordem, do mais perto da saída ao mais longe (o Google aceita até 9)
  const passagens = trechos
    .map((t) => meio(t.coords))
    .sort((a, b) => distancia(a, saida) - distancia(b, saida))
    .slice(0, 9)

  return (
    'https://www.google.com/maps/dir/?api=1' +
    '&origin=' + texto(saida) +
    '&destination=' + texto(chegada) +
    '&waypoints=' + encodeURIComponent(passagens.map(texto).join('|')) +
    '&travelmode=walking'
  )
}
