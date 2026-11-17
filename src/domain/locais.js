/*
  Regras dos locais (sem React): nomes dos tipos e dos recursos de acessibilidade,
  o filtro da lista e o link de "Como chegar".
*/

export const TIPOS_LOCAL = {
  banheiro: 'Banheiro acessível',
  descanso: 'Ponto de descanso',
  lazer: 'Lazer acessível',
}

// Opções do filtro da tela Locais
export const FILTROS_LOCAL = { todos: 'Todos', banheiro: 'Banheiros', descanso: 'Descanso', lazer: 'Lazer' }

// Recursos de acessibilidade de cada local (aparecem como selos no card)
export const RECURSOS = {
  'porta-larga': 'Porta larga',
  barras: 'Barras de apoio',
  sombra: 'Sombra',
  banco: 'Banco',
  bebedouro: 'Bebedouro',
  cobertura: 'Cobertura',
  rampa: 'Rampa de acesso',
  'piso-tatil': 'Piso tátil',
  'banheiro-acessivel': 'Banheiro acessível',
}

// Devolve os locais do tipo escolhido ("todos" devolve todos), do mais perto para o mais longe
export function filtrarLocais(locais, filtro) {
  return locais
    .filter((local) => filtro === 'todos' || local.tipo === filtro)
    .sort((a, b) => a.metros - b.metros)
}

// Ex.: 1 → "1 local" · 4 → "4 locais"
export function textoQuantidade(quantidade) {
  return quantidade === 1 ? '1 local' : quantidade + ' locais'
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
