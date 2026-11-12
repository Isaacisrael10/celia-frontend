import { useEffect, useState } from 'react'

/*
  Custom hook de uma preferência liga/desliga salva no navegador.
  Ex.: const [chuva, alternarChuva] = usePreferencia('celia-chuva')
*/
export function usePreferencia(chave, inicial = false) {
  const [ligado, setLigado] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo === null ? inicial : salvo === 'sim'
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(chave, ligado ? 'sim' : 'nao')
    } catch {
      // sem localStorage: vale só até fechar a página
    }
  }, [chave, ligado])

  function alternar() {
    setLigado(!ligado)
  }

  return [ligado, alternar]
}
