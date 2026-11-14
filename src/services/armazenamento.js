/*
  Preferências guardadas no navegador (localStorage).
  O app não tem login: tema, caminho de sempre e ajustes ficam só no aparelho da pessoa.
  Só lê e grava: não sabe nada de React nem de tela.

  O navegador pode bloquear o localStorage (aba anônima, por exemplo).
  Nesse caso o app continua funcionando, só não lembra a escolha depois de fechar a página.
*/

// Lê o texto salvo numa chave. Devolve null se não houver nada salvo.
export function lerSalvo(chave) {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

// Grava um texto numa chave. Ex.: salvar('celia-tema', 'escuro')
export function salvar(chave, texto) {
  try {
    localStorage.setItem(chave, texto)
  } catch {
    // sem localStorage: a escolha vale só até fechar a página
  }
}
