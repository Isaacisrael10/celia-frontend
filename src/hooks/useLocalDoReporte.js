import { useEffect, useRef, useState } from 'react'
import { buscarLugar, enderecoDoPonto } from '../services/geocodificacao'

// Ponto de reserva quando não temos o GPS: centro do Grajaú
const PONTO_PADRAO = { lat: -22.9225, lng: -43.2645 }

/*
  Custom hook do local do reporte (o mapa com o pino no formulário).

  Três jeitos de escolher o local:
  1. Ao abrir: vai para onde a pessoa está (GPS). Sem GPS, abre no Grajaú.
  2. Arrastando o mapa: o pino do centro marca o local e o endereço é preenchido sozinho.
  3. Digitando o endereço e apertando "Buscar": o mapa vai até lá.

  - inicial: { lat, lng } se o reporte já tem local (edição ou vindo de um trecho)
  - aoAcharEndereco(texto): chamado quando o mapa descobre o endereço do pino
*/
export function useLocalDoReporte(inicial, aoAcharEndereco) {
  const temInicial = inicial && typeof inicial.lat === 'number'

  // Ponto marcado pelo pino
  const [ponto, setPonto] = useState(temInicial ? { lat: inicial.lat, lng: inicial.lng } : PONTO_PADRAO)
  // Para onde a câmera deve ir (muda com o GPS e com a busca)
  const [alvo, setAlvo] = useState(null)
  // O pino foi confirmado (pelo GPS, arrastando ou buscando)? Se não, usamos o endereço digitado.
  const [confirmado, setConfirmado] = useState(Boolean(temInicial))
  const [aviso, setAviso] = useState('')
  const [buscando, setBuscando] = useState(false)

  // Guarda a última função recebida, para o efeito do GPS não depender dela
  const avisarEndereco = useRef(aoAcharEndereco)
  useEffect(() => {
    avisarEndereco.current = aoAcharEndereco
  })

  // 1. Ao abrir (sem local inicial): pede o GPS uma vez
  useEffect(() => {
    if (temInicial || !navigator.geolocation) return
    let ativo = true
    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (!ativo) return
        const local = { lat: p.coords.latitude, lng: p.coords.longitude }
        setPonto(local)
        setAlvo(local)
        setConfirmado(true)
        enderecoDoPonto(local.lat, local.lng).then((texto) => {
          if (ativo && texto) avisarEndereco.current(texto)
        })
      },
      () => {
        if (ativo) setAviso('Sem acesso à sua localização. Arraste o mapa ou digite o endereço.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
    return () => {
      ativo = false
    }
  }, [temInicial])

  // Para não buscar o endereço a cada pixel arrastado (regra do Nominatim: 1 busca por segundo)
  const timerEndereco = useRef(null)

  // 2. A pessoa terminou de arrastar o mapa
  function aoMoverMapa(lat, lng) {
    setPonto({ lat, lng })
    setConfirmado(true)
    setAviso('')
    clearTimeout(timerEndereco.current)
    timerEndereco.current = setTimeout(async () => {
      const texto = await enderecoDoPonto(lat, lng)
      if (texto) avisarEndereco.current(texto)
    }, 1000)
  }

  // 3. A pessoa digitou o endereço e apertou "Buscar"
  async function buscarEndereco(texto) {
    if (texto.trim().length < 5) {
      setAviso('Escreva a rua e o número para buscar.')
      return
    }
    setBuscando(true)
    setAviso('')
    try {
      const resultados = await buscarLugar(texto + ', Rio de Janeiro')
      if (resultados.length === 0) {
        setAviso('Não achamos esse endereço. Arraste o mapa até o local.')
        return
      }
      const local = { lat: resultados[0].lat, lng: resultados[0].lng }
      setPonto(local)
      setAlvo(local)
      setConfirmado(true)
    } catch (e) {
      setAviso(e.message)
    } finally {
      setBuscando(false)
    }
  }

  /*
    Coordenadas que vão para o reporte.
    Depois de confirmado (GPS, arrastar ou buscar), o pino é o local exato,
    mesmo que a pessoa ajuste o número no texto.
    Se nunca foi confirmado, vai null e o app procura pelo endereço ao salvar.
  */
  const coordenadas = confirmado ? ponto : { lat: null, lng: null }

  return { ponto, alvo, confirmado, aviso, buscando, coordenadas, aoMoverMapa, buscarEndereco }
}
