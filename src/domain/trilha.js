/*
  Regras da mini trilha de IA (sem React) [HU-19, RF18].
  As lições vêm da API da equipe; aqui ficam só as contas e a conferência do formato.
*/

/*
  A resposta tem o formato combinado com a API?
  Precisa ter pelo menos uma lição, e toda lição precisa de título e parágrafos.
  Se vier diferente, o app usa a cópia das lições que vem junto com ele (plano B).
*/
export function trilhaValida(dados) {
  if (!dados || !Array.isArray(dados.licoes) || dados.licoes.length === 0) return false
  return dados.licoes.every((licao) => Boolean(licao.titulo) && Array.isArray(licao.paragrafos))
}

// Soma os minutos de todas as lições. Ex.: 3 + 4 + 4 + 4 + 3 → 18
export function minutosDaTrilha(licoes) {
  let total = 0
  for (const licao of licoes) {
    total += licao.duracao_minutos || 0
  }
  return total
}

// Resumo que aparece no topo da tela. Ex.: "5 lições · 18 min de leitura no total"
export function resumoDaTrilha(licoes) {
  const quantas = licoes.length === 1 ? '1 lição' : licoes.length + ' lições'
  return quantas + ' · ' + minutosDaTrilha(licoes) + ' min de leitura no total'
}
