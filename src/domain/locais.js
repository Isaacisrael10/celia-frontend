/*
  Regras dos locais (sem React): nomes dos tipos e dos recursos de acessibilidade,
  e o link de "Como chegar".
*/

export const TIPOS_LOCAL = {
  banheiro: 'Banheiro acessível',
  descanso: 'Ponto de descanso',
}

// Recursos de acessibilidade de cada local (aparecem como selos no card)
export const RECURSOS = {
  'porta-larga': 'Porta larga',
  barras: 'Barras de apoio',
  sombra: 'Sombra',
  banco: 'Banco',
  bebedouro: 'Bebedouro',
  cobertura: 'Cobertura',
}

/*
  Link do Google Maps com o caminho a pé até o local.
  Ex.: https://www.google.com/maps/dir/?api=1&destination=-22.92,-43.26&travelmode=walking
*/
export function linkComoChegar(local) {
  return (
    'https://www.google.com/maps/dir/?api=1&destination=' + local.lat + ',' + local.lng + '&travelmode=walking'
  )
}
