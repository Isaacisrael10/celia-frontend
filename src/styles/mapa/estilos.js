/*
  Os estilos do mapa num lugar só: claro, escuro e satélite.
  Quem desenha um mapa (tela Mapa, mini mapa dos Locais, mapa do reporte) pede o estilo aqui.
*/
import estiloClaro from './celia-mapa-claro.json'
import estiloEscuro from './celia-mapa-escuro.json'

// Crédito obrigatório de cada fonte de mapa (aparece escrito na tela)
export const CREDITO_MAPA = 'OpenFreeMap © OpenMapTiles Data from OpenStreetMap'
export const CREDITO_SATELITE =
  'Imagens: Esri, Maxar, Earthstar Geographics · Nomes das ruas: OpenFreeMap © OpenMapTiles Data from OpenStreetMap'

// Fotos de satélite da Esri (World Imagery): gratuitas para ver, sem chave, com o crédito acima
const FOTOS_SATELITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

/*
  Estilo "satélite": a foto aérea por baixo e os nomes das ruas por cima.
  Reaproveita o estilo escuro (letras claras com contorno escuro, que aparecem bem em cima da foto)
  e fica só com as camadas de texto (as do tipo "symbol").
  Assim a camada "highway-name-minor" continua existindo, e os trechos coloridos
  são desenhados logo abaixo dela, do mesmo jeito que no modo mapa.
*/
const estiloSatelite = {
  ...estiloEscuro,
  name: 'celia-mapa-satelite',
  sources: {
    ...estiloEscuro.sources,
    satelite: { type: 'raster', tiles: [FOTOS_SATELITE], tileSize: 256, maxzoom: 18 },
  },
  layers: [
    { id: 'satelite', type: 'raster', source: 'satelite' },
    ...estiloEscuro.layers.filter((camada) => camada.type === 'symbol'),
  ],
}

/*
  Devolve o estilo certo para o mapa.
  - escuro: true no modo escuro do app
  - satelite: true quando a pessoa escolheu ver a foto de satélite (vale mais que o tema)
*/
export function estiloDoMapa(escuro, satelite = false) {
  if (satelite) return estiloSatelite
  return escuro ? estiloEscuro : estiloClaro
}

// O crédito que precisa aparecer junto do mapa
export function creditoDoMapa(satelite = false) {
  return satelite ? CREDITO_SATELITE : CREDITO_MAPA
}
