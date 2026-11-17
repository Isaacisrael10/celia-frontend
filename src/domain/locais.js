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

// Tipos de lazer (campo "categoria" em locais.json). O filtro de lazer usa estes nomes.
export const CATEGORIAS_LAZER = { todas: 'Todo tipo', esporte: 'Esporte', cultura: 'Cultura', 'ar-livre': 'Ao ar livre' }

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
  vestiario: 'Vestiário adaptado',
  audiodescricao: 'Audiodescrição',
  libras: 'Intérprete de Libras',
  'area-reservada': 'Espaço para cadeira de rodas',
  'caminho-plano': 'Caminho plano',
}

/*
  Devolve os locais do tipo escolhido ("todos" devolve todos), do mais perto para o mais longe.
  No lazer dá para escolher também a categoria ("todas" não filtra).
  Ex.: filtrarLocais(locais, 'lazer', 'cultura') → só lazer de cultura
*/
export function filtrarLocais(locais, filtro, categoria = 'todas') {
  return locais
    .filter((local) => filtro === 'todos' || local.tipo === filtro)
    .filter((local) => filtro !== 'lazer' || categoria === 'todas' || local.categoria === categoria)
    .sort((a, b) => a.metros - b.metros)
}

// Texto do tipo no card. Ex.: "Banheiro acessível" · "Lazer acessível · Cultura"
export function nomeDoTipo(local) {
  const tipo = TIPOS_LOCAL[local.tipo]
  return local.categoria ? tipo + ' · ' + CATEGORIAS_LAZER[local.categoria] : tipo
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
