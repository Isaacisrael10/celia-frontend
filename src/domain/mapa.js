/*
  Regras e medidas do mapa (sem React).
*/

// Área que aparece ao abrir: o Grajaú, onde ficam o poste e os testes: [[oeste, sul], [leste, norte]]
// O mapa não é preso aqui: dá para arrastar e buscar qualquer lugar.
export const AREA_INICIAL = [
  [-43.2685, -22.9325],
  [-43.2538, -22.9155],
]

// Posição de reserva da pessoa quando não temos o GPS (Rua Barão do Bom Retiro, Grajaú)
export const VOCE_PADRAO = { lat: -22.9223585, lng: -43.2586232 }

// Camadas do mapa em que o clique abre o detalhe do trecho (os ids são os de CamadasTrechos.jsx)
export const CAMADAS_CLICAVEIS = ['linha-normal', 'linha-atencao', 'linha-perigo', 'linha-sem-dados']

// Os dois jeitos de ver o mapa (a pessoa troca pelo botão do canto de baixo)
export const VISOES_MAPA = {
  mapa: 'Mapa',
  satelite: 'Satélite',
}

/*
  Retângulo que cobre uma lista de pontos [lng, lat]: [[oeste, sul], [leste, norte]].
  É o formato que o mapa usa para enquadrar uma área.
*/
export function areaDosPontos(pontos) {
  const lngs = pontos.map((p) => p[0])
  const lats = pontos.map((p) => p[1])
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
}
