import { useEffect, useState } from 'react'

const CHAVE = 'celia-tema'

// Descobre o tema inicial: o que a pessoa escolheu antes ou, se não escolheu, o do sistema
function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    // navegador sem localStorage (aba anônima, por exemplo): segue sem salvar
  }
  const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
  return sistemaEscuro ? 'escuro' : 'claro'
}

/*
  Custom hook do modo claro/escuro.
  - guarda o tema no estado do React
  - coloca data-tema="claro|escuro" no <html> (o CSS troca as cores por ele)
  - salva a escolha no navegador
*/
export function useTema() {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      localStorage.setItem(CHAVE, tema)
    } catch {
      // sem localStorage: o tema vale só até fechar a página
    }
  }, [tema])

  function alternarTema() {
    setTema(tema === 'escuro' ? 'claro' : 'escuro')
  }

  return { tema, escuro: tema === 'escuro', alternarTema }
}
