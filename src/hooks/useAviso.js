import { useEffect, useState } from 'react'

/*
  Custom hook do aviso rápido (toast) no rodapé.
  mostrarAviso("Reporte enviado.") mostra a mensagem, que some sozinha em 2,8 s.
  - inicial: (opcional) aviso para mostrar assim que a tela abre
*/
export function useAviso(inicial = '') {
  const [aviso, setAviso] = useState(inicial)

  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(''), 2800)
    // Se outro aviso chegar antes, cancela o timer antigo
    return () => clearTimeout(timer)
  }, [aviso])

  return { aviso, mostrarAviso: setAviso }
}
