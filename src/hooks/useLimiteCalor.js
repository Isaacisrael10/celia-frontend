import { useEffect, useState } from 'react'

const CHAVE = 'celia-limite-calor'
// Padrão: avisar a partir de 32 °C
const PADRAO = 32

/*
  Custom hook do alerta de calor (escolhido no Perfil e usado no boletim do Mapa).
  Guarda no navegador a temperatura a partir da qual o boletim avisa. 0 = alerta desligado.
  Ex.: const [limite, setLimite] = useLimiteCalor()
*/
export function useLimiteCalor() {
  const [limite, setLimite] = useState(() => {
    try {
      const salvo = localStorage.getItem(CHAVE)
      return salvo === null ? PADRAO : Number(salvo)
    } catch {
      return PADRAO
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, String(limite))
    } catch {
      // sem localStorage: vale só até fechar a página
    }
  }, [limite])

  return [limite, setLimite]
}
