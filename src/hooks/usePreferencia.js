import { useEffect, useState } from 'react'
import { lerSalvo, salvar } from '../services/armazenamento'

/*
  Custom hook de uma preferência liga/desliga salva no navegador.
  Ex.: const [satelite, alternarSatelite] = usePreferencia('celia-satelite')
  - chave: nome usado para guardar no navegador
  - inicial: valor de quem nunca escolheu (desligado, se não disser nada)
*/
export function usePreferencia(chave, inicial = false) {
  const [ligado, setLigado] = useState(() => {
    const salvo = lerSalvo(chave)
    return salvo === null ? inicial : salvo === 'sim'
  })

  useEffect(() => {
    salvar(chave, ligado ? 'sim' : 'nao')
  }, [chave, ligado])

  function alternar() {
    setLigado(!ligado)
  }

  return [ligado, alternar]
}
