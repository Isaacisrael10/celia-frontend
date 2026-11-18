import { useEffect, useState } from 'react'

/*
  Custom hook de cronômetro: conta os segundos enquanto "ativo" for true.
  Usado nos cards de espera da IA, para a pessoa ver o tempo passando e saber que
  o app não travou (a IA de visão e o Gemini podem levar de 5 a 60 s).

  - ativo: true enquanto a espera dura
  - fase: quando muda (ex.: de "yolo" para "gemini"), o cronômetro recomeça do zero
  Devolve os segundos inteiros. Ex.: const segundos = useCronometro(carregando, 'gemini')
*/
export function useCronometro(ativo, fase = '') {
  const [segundos, setSegundos] = useState(0)

  useEffect(() => {
    if (!ativo) return
    const inicio = Date.now()
    // Conta pela diferença de horário (e não somando 1): assim não atrasa se o navegador demorar
    const relogio = setInterval(() => {
      setSegundos(Math.floor((Date.now() - inicio) / 1000))
    }, 500)
    // Ao terminar a espera (ou mudar de fase): para o relógio e zera para a próxima vez
    return () => {
      clearInterval(relogio)
      setSegundos(0)
    }
  }, [ativo, fase])

  return segundos
}
