import { useEffect, useRef } from 'react'
import MapaBase, { NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IconMapPinFilled } from '@tabler/icons-react'
import estiloClaro from '../styles/mapa/celia-mapa-claro.json'
import estiloEscuro from '../styles/mapa/celia-mapa-escuro.json'
import './SeletorLocal.css'

// Avisos que aparecem quando a pessoa tenta mexer no mapa com um dedo só
const TEXTOS_GESTOS = {
  'CooperativeGesturesHandler.WindowsHelpText': 'Use Ctrl + rolagem para dar zoom no mapa',
  'CooperativeGesturesHandler.MacHelpText': 'Use ⌘ + rolagem para dar zoom no mapa',
  'CooperativeGesturesHandler.MobileHelpText': 'Use dois dedos para mover o mapa',
}

/*
  Mapa pequeno para escolher o local do reporte.
  O pino fica fixo no centro: a pessoa arrasta o MAPA até o pino ficar em cima do problema.
  - ponto: { lat, lng } onde o mapa começa
  - alvo: quando muda (GPS ou busca), o mapa voa até ele
  - escuro: estilo escuro
  - aoMover(lat, lng): a pessoa terminou de arrastar
*/
export default function SeletorLocal({ ponto, alvo, escuro, aoMover }) {
  const mapaRef = useRef(null)

  // Voa até o alvo quando ele muda.
  // Se o alvo chegar ANTES do mapa terminar de carregar (GPS rápido), o voo acontece no onLoad.
  useEffect(() => {
    if (mapaRef.current && alvo) {
      mapaRef.current.flyTo({ center: [alvo.lng, alvo.lat], zoom: 17, duration: 1000 })
    }
  }, [alvo])

  function aoCarregar() {
    if (alvo) mapaRef.current.jumpTo({ center: [alvo.lng, alvo.lat], zoom: 17 })
  }

  // Foi a PESSOA que começou a mexer? (o voo automático não tem originalEvent)
  const movidoPelaPessoa = useRef(false)

  function aoComecarAMover(evento) {
    if (evento.originalEvent) movidoPelaPessoa.current = true
  }

  // Quando o mapa para (inclusive depois de deslizar), avisa o novo centro
  function aoTerminarDeMover(evento) {
    if (!movidoPelaPessoa.current) return
    movidoPelaPessoa.current = false
    const centro = evento.target.getCenter()
    aoMover(centro.lat, centro.lng)
  }

  return (
    <div className="seletor-local">
      <MapaBase
        ref={mapaRef}
        initialViewState={{ latitude: ponto.lat, longitude: ponto.lng, zoom: 16 }}
        mapStyle={escuro ? estiloEscuro : estiloClaro}
        attributionControl={false}
        // No celular, um dedo rola a página e dois dedos mexem no mapa (não prende a rolagem)
        cooperativeGestures={true}
        locale={TEXTOS_GESTOS}
        onLoad={aoCarregar}
        onMoveStart={aoComecarAMover}
        onMoveEnd={aoTerminarDeMover}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />
      </MapaBase>
      {/* O pino é só desenho por cima do mapa, sempre no centro */}
      <span className="seletor-local__pino" aria-hidden="true">
        <IconMapPinFilled size={44} />
      </span>
      {/* Crédito obrigatório do mapa, embaixo para não cobrir o mapa pequeno */}
      <p className="seletor-local__credito">OpenFreeMap © OpenMapTiles Data from OpenStreetMap</p>
    </div>
  )
}
