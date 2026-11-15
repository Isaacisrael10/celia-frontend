import { useEffect, useRef, useState } from 'react'

/*
  Custom hook: avisa quando um elemento entra na tela ao rolar a página.
  Usa o IntersectionObserver do navegador (não fica medindo a rolagem a cada pixel).
  Depois que aparece uma vez, continua "visível": o card não fecha de novo ao subir a página.

  Ex.: const [ref, visivel] = useAparecerAoRolar()
       <li ref={ref} className={visivel ? 'aberto' : ''}>
*/
export function useAparecerAoRolar() {
  const ref = useRef(null)
  // Navegador sem IntersectionObserver: mostra tudo de uma vez
  const [visivel, setVisivel] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const elemento = ref.current
    if (!elemento || visivel) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.disconnect()
        }
      },
      // Abre quando 30% do card já entrou, um pouco antes do fim da tela
      { threshold: 0.3, rootMargin: '0px 0px -8% 0px' },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [visivel])

  return [ref, visivel]
}
