import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/*
  Custom hook de acessibilidade para a troca de tela.
  Ao trocar de tela: volta para o topo e leva o foco ao título (h1).
  Assim o leitor de tela anuncia a tela nova e o teclado continua a partir dela.
  Na primeira tela não fazemos nada: o foco começa no início da página.
  Usado uma vez só, na moldura do app (Layout, em App.jsx).
*/
export function useFocoNoTitulo() {
  const { pathname } = useLocation()
  // Guarda o endereço da tela anterior, para saber quando a tela realmente mudou
  const telaAnterior = useRef(pathname)

  useEffect(() => {
    if (telaAnterior.current === pathname) return
    telaAnterior.current = pathname

    window.scrollTo(0, 0)
    // Manipulação do DOM: procura o título da tela nova e coloca o foco nele
    const titulo = document.querySelector('h1')
    if (titulo) titulo.focus({ preventScroll: true })
  }, [pathname])
}
