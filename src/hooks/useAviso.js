import { useEffect, useState } from 'react'

/*
  Custom hook do aviso rápido (toast) no rodapé.
  mostrarAviso("Reporte enviado.") mostra a mensagem, que some sozinha em 2,8 s.
*/
export function useAviso() {
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(''), 2800)
    // Se outro aviso chegar antes, cancela o timer antigo
    return () => clearTimeout(timer)
  }, [aviso])

  return { aviso, mostrarAviso: setAviso }
}
