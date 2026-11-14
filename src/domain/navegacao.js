/*
  O grafo de navegação da C.E.L.I.A. (sem React, só dados e uma função pura).

  Ideia: o símbolo internacional de acessibilidade é um grafo.
  Ele tem bolinhas (cabeça, duas mãos e dois pés) ligadas por linhas,
  e essas linhas se encontram no meio do corpo.
  Cada parte do app É um ponto desse desenho:

    cabeça ......... Mapa      (o centro de tudo: como estão as calçadas)
    mão esquerda ... Rotas     (escolher o caminho)
    mão direita .... Reportar  (avisar um problema)
    pé esquerdo .... Locais    (onde parar e descansar)
    meio do corpo .. Trilha IA (onde braços e pernas se encontram: aprender para seguir no trabalho)
    pé direito ..... Perfil    (os ajustes de quem usa)

  - x, y: posição do ponto no desenho do símbolo, em % (as mesmas medidas do FiguraPessoa).
    O meio do corpo fica um pouco abaixo do encontro das linhas (54% em vez de 50,7%),
    para a bolinha dele não encostar na cabeça em telas pequenas.
  - A ordem desta lista é a ordem da navegação e da leitura no teclado.
*/
export const NOS = [
  { id: 'mapa', caminho: '/', rotulo: 'Mapa', apoio: 'Como estão as calçadas agora', x: 50, y: 25.7 },
  { id: 'rotas', caminho: '/rotas', rotulo: 'Rotas', apoio: 'Compare os caminhos', x: 3.6, y: 35.2 },
  { id: 'reportar', caminho: '/reportar', rotulo: 'Reportar', apoio: 'Avise um problema', x: 96.4, y: 35.2 },
  { id: 'locais', caminho: '/locais', rotulo: 'Locais', apoio: 'Banheiros e descanso', x: 23.8, y: 89.5 },
  { id: 'trilha', caminho: '/trilha', rotulo: 'Trilha IA', apoio: 'Aprenda IA para o trabalho', x: 50, y: 54 },
  { id: 'perfil', caminho: '/perfil', rotulo: 'Perfil', apoio: 'Ajustes e acessibilidade', x: 76.2, y: 89.5 },
]

/*
  "Sobre o projeto" não é um ponto do símbolo: é a página que explica o problema e a solução.
  Fica embaixo do trilho lateral, no fim do menu e no Perfil.
*/
export const SOBRE = { id: 'sobre', caminho: '/sobre', rotulo: 'Sobre', apoio: 'Problema, solução e ODS' }

/*
  Assistente de IA [HU-21, RF20]: também fica fora do símbolo (os 6 pontos já são as partes do corpo).
  Aparece embaixo do trilho lateral e no menu, junto do Sobre.
*/
export const ASSISTENTE = {
  id: 'assistente',
  caminho: '/assistente',
  rotulo: 'Assistente',
  apoio: 'Pergunte sobre o caminho',
}

// Telas fora do símbolo, na ordem em que aparecem embaixo do trilho e no menu
export const EXTRAS = [ASSISTENTE, SOBRE]

/*
  Descobre em qual ponto a pessoa está, a partir do endereço da tela.
  Ex.: "/rotas" → "rotas" · "/trecho/itabaiana-2" → "mapa" (o trecho faz parte do Mapa)
       "/sobre" → "" (nenhum ponto do símbolo)
*/
export function noAtivo(caminhoAtual) {
  if (caminhoAtual === '/' || caminhoAtual.startsWith('/trecho')) return 'mapa'
  const no = NOS.find((n) => n.caminho !== '/' && caminhoAtual.startsWith(n.caminho))
  return no ? no.id : ''
}
