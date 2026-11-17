import { useEffect, useState } from 'react'

/*
  Custom hook que responde "a tela atende a esta condição?" e avisa quando a resposta muda
  (a pessoa girou o celular ou redimensionou a janela).
  Ex.: const telaLarga = useConsultaDeTela('(min-width: 960px)')
  Usa a mesma sintaxe das media queries do CSS.
*/
export function useConsultaDeTela(consulta) {
  const [vale, setVale] = useState(() => window.matchMedia(consulta).matches)

  useEffect(() => {
    const midia = window.matchMedia(consulta)
    function atualizar() {
      setVale(midia.matches)
    }
    midia.addEventListener('change', atualizar)
    // Ao sair da tela, para de escutar
    return () => midia.removeEventListener('change', atualizar)
  }, [consulta])

  return vale
}
