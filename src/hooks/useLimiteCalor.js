import { useEffect, useState } from 'react'
import { lerSalvo, salvar } from '../services/armazenamento'
import { LIMITE_CALOR_PADRAO } from '../domain/boletim'

const CHAVE = 'celia-limite-calor'

/*
  Custom hook do alerta de calor (escolhido no Perfil e usado no boletim do Mapa).
  Guarda no navegador a temperatura a partir da qual o boletim avisa. 0 = alerta desligado.
  Ex.: const [limite, setLimite] = useLimiteCalor()
*/
export function useLimiteCalor() {
  const [limite, setLimite] = useState(() => {
    const salvo = lerSalvo(CHAVE)
    return salvo === null ? LIMITE_CALOR_PADRAO : Number(salvo)
  })

  useEffect(() => {
    salvar(CHAVE, String(limite))
  }, [limite])

  return [limite, setLimite]
}
