import { useEffect } from 'react'

/*
  Custom hook que troca o título da aba do navegador conforme a tela.
  Ex.: useTituloDaPagina('Rotas') → "Rotas · C.E.L.I.A."
  Ajuda quem usa leitor de tela (o título é a primeira coisa lida) e quem tem várias abas abertas.
*/
export function useTituloDaPagina(titulo) {
  useEffect(() => {
    document.title = titulo + ' · C.E.L.I.A.'
  }, [titulo])
}
