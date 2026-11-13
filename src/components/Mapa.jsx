import { useEffect, useMemo, useRef, useState } from 'react'
import MapaBase, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IconMessageReport } from '@tabler/icons-react'
import estiloClaro from '../styles/mapa/celia-mapa-claro.json'
import estiloEscuro from '../styles/mapa/celia-mapa-escuro.json'
import { CORES_MAPA, rotuloCompleto } from '../domain/faixas'
import { nomeDoTrecho, meioDoTrecho } from '../domain/trechos'
import { TIPOS } from '../domain/reportes'
import FiguraPessoa from './FiguraPessoa'
import './Mapa.css'

// Área que aparece ao abrir: o Grajaú, onde ficam o poste e os testes.
// O mapa não é preso aqui: dá para arrastar e buscar qualquer lugar.
const AREA_INICIAL = [
  [-43.2685, -22.9325],
  [-43.2538, -22.9155],
]

// As linhas ficam abaixo desta camada, para os nomes das ruas ficarem por cima
const ABAIXO_DE = 'highway-name-minor'

// Espaço livre nas bordas ao enquadrar: em cima fica a busca e embaixo fica a gaveta do boletim
const FOLGA = { top: 80, bottom: 190, left: 24, right: 60 }

// Textos do MapLibre em português (o leitor de tela lê estes nomes)
const TEXTOS_MAPA = {
  'Map.Title': 'Mapa dos trechos',
  'NavigationControl.ZoomIn': 'Aproximar',
  'NavigationControl.ZoomOut': 'Afastar',
}

// Distância mínima (em px na tela) entre dois selos ! e ✕ para eles não ficarem um em cima do outro
const DISTANCIA_SELOS = 40

// Ordem de importância dos selos: Perigo aparece antes de Atenção quando não cabem os dois
const PRIORIDADE = { perigo: 0, atencao: 1 }

/*
  Mapa real (MapLibre + OpenFreeMap) com os trechos coloridos por faixa.
  - trechos: lista de trechos já com { faixa, motivo } calculados
  - reportes: reportes com lat/lng (viram marcadores)
  - escuro: true usa o estilo escuro
  - voce: { lat, lng } da pessoa
  - alvo: lugar para onde a câmera vai ({ area } ou { lat, lng }); muda quando a pessoa busca
  - aoSelecionar(id): abre o detalhe do trecho
  - aoAbrirReporte(): abre a tela de reportes
  - destaque: ids dos trechos do caminho de sempre (ganham um contorno azul)
  O crédito do mapa fica na tela do Mapa, acima da gaveta (aqui embaixo ele ficaria escondido).
*/
export default function Mapa({ trechos, reportes = [], escuro, voce, alvo, destaque = [], aoSelecionar, aoAbrirReporte }) {
  const mapaRef = useRef(null)
  const cores = escuro ? CORES_MAPA.escuro : CORES_MAPA.claro
  // Último enquadramento do mapa: muda quando o mapa carrega e quando para de mexer
  const [camera, setCamera] = useState(null)

  function guardarCamera(evento) {
    setCamera({ mapa: evento.target, quando: Date.now() })
  }

  // Trechos em Atenção e Perigo: os que ganham selo, do mais grave para o menos grave
  const comSelo = useMemo(
    () =>
      trechos
        .filter((t) => t.faixa.id === 'atencao' || t.faixa.id === 'perigo')
        .sort((a, b) => PRIORIDADE[a.faixa.id] - PRIORIDADE[b.faixa.id]),
    [trechos],
  )

  /*
    Selos que cabem na tela sem sobrepor: passa pelos selos em ordem de gravidade
    e só mostra um selo se ele estiver longe dos que já foram escolhidos.
  */
  const selosVisiveis = useMemo(() => {
    if (!camera) return []
    const escolhidos = []
    for (const t of comSelo) {
      const ponto = camera.mapa.project(meioDoTrecho(t))
      const longeDeTodos = escolhidos.every((e) => Math.hypot(e.x - ponto.x, e.y - ponto.y) >= DISTANCIA_SELOS)
      if (longeDeTodos) escolhidos.push({ id: t.id, x: ponto.x, y: ponto.y })
    }
    return escolhidos.map((e) => e.id)
  }, [camera, comSelo])

  /*
    O MapLibre coloca "Map marker" como nome de todo marcador.
    Os nossos marcadores já têm um botão com nome em português dentro,
    então tiramos esse nome em inglês para o leitor de tela não ler duas vezes.
  */
  useEffect(() => {
    document.querySelectorAll('.mapa .maplibregl-marker').forEach((marcador) => {
      marcador.removeAttribute('aria-label')
      marcador.setAttribute('role', 'presentation')
    })
  })

  // Quando o alvo muda (busca ou GPS), a câmera voa até ele
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || !alvo) return
    if (alvo.area) {
      mapa.fitBounds(alvo.area, { padding: FOLGA, maxZoom: 17, duration: 1200 })
    } else {
      mapa.flyTo({ center: [alvo.lng, alvo.lat], zoom: 17, duration: 1200 })
    }
  }, [alvo])

  // Converte os trechos para GeoJSON, o formato que o MapLibre entende
  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: trechos.map((t) => ({
        type: 'Feature',
        properties: { id: t.id, faixa: t.faixa.id },
        geometry: { type: 'LineString', coordinates: t.coords },
      })),
    }),
    [trechos],
  )

  // Bolinhas nas pontas de cada trecho (como as mãos e os pés do símbolo de acessibilidade)
  const pontas = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: trechos
        .filter((t) => t.faixa.id !== 'semDados')
        .flatMap((t) =>
          [t.coords[0], t.coords[t.coords.length - 1]].map((ponto) => ({
            type: 'Feature',
            properties: { faixa: t.faixa.id },
            geometry: { type: 'Point', coordinates: ponto },
          })),
        ),
    }),
    [trechos],
  )

  // Cor de cada linha conforme a faixa
  const corPorFaixa = ['match', ['get', 'faixa'], 'normal', cores.normal, 'atencao', cores.atencao, 'perigo', cores.perigo, cores.semDados]

  // Clique numa linha abre o detalhe do trecho
  function clicarNoMapa(evento) {
    const linha = evento.features && evento.features[0]
    if (linha) aoSelecionar(linha.properties.id)
  }

  // Só os reportes que têm localização viram marcador
  const reportesComLocal = reportes.filter((r) => typeof r.lat === 'number' && typeof r.lng === 'number')

  return (
    <div className="mapa">
      <MapaBase
        ref={mapaRef}
        initialViewState={{ bounds: AREA_INICIAL, fitBoundsOptions: { padding: FOLGA } }}
        mapStyle={escuro ? estiloEscuro : estiloClaro}
        attributionControl={false}
        locale={TEXTOS_MAPA}
        onLoad={guardarCamera}
        onMoveEnd={guardarCamera}
        interactiveLayerIds={['linha-normal', 'linha-atencao', 'linha-perigo', 'linha-sem-dados']}
        onClick={clicarNoMapa}
        cursor="pointer"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Source id="trechos" type="geojson" data={geojson}>
          {/* Caminho de sempre: contorno azul largo por baixo das linhas */}
          <Layer
            id="caminho-de-sempre"
            type="line"
            beforeId={ABAIXO_DE}
            filter={['in', ['get', 'id'], ['literal', destaque]]}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': escuro ? '#49C8F5' : '#0A72A8', 'line-width': 14, 'line-opacity': 0.35 }}
          />
          {/* Brilho da própria cor por trás da linha */}
          <Layer
            id="brilho"
            type="line"
            beforeId={ABAIXO_DE}
            filter={['!=', ['get', 'faixa'], 'semDados']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': corPorFaixa, 'line-width': 16, 'line-opacity': escuro ? 0.22 : 0.16, 'line-blur': 1 }}
          />
          {/* Normal: linha contínua */}
          <Layer
            id="linha-normal"
            type="line"
            beforeId={ABAIXO_DE}
            filter={['==', ['get', 'faixa'], 'normal']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': cores.normal, 'line-width': 5.5 }}
          />
          {/* Atenção: tracejado longo */}
          <Layer
            id="linha-atencao"
            type="line"
            beforeId={ABAIXO_DE}
            filter={['==', ['get', 'faixa'], 'atencao']}
            layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
            paint={{ 'line-color': cores.atencao, 'line-width': 5.5, 'line-dasharray': [2.6, 1.1] }}
          />
          {/* Perigo: tracejado curto */}
          <Layer
            id="linha-perigo"
            type="line"
            beforeId={ABAIXO_DE}
            filter={['==', ['get', 'faixa'], 'perigo']}
            layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
            paint={{ 'line-color': cores.perigo, 'line-width': 5.5, 'line-dasharray': [1.1, 1.1] }}
          />
          {/* Sem dados: pontilhado */}
          <Layer
            id="linha-sem-dados"
            type="line"
            beforeId={ABAIXO_DE}
            filter={['==', ['get', 'faixa'], 'semDados']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': cores.semDados, 'line-width': 4, 'line-dasharray': [0.01, 2.2] }}
          />
        </Source>

        {/* Bolinhas brancas com contorno da cor da faixa nas pontas dos trechos */}
        <Source id="pontas" type="geojson" data={pontas}>
          <Layer
            id="pontas"
            type="circle"
            beforeId={ABAIXO_DE}
            paint={{
              'circle-radius': 4.5,
              'circle-color': escuro ? '#13204a' : '#ffffff',
              'circle-stroke-width': 2.5,
              'circle-stroke-color': corPorFaixa,
            }}
          />
        </Source>

        {/* Selos ! e ✕ no meio dos trechos em Atenção e Perigo (são botões: funcionam no teclado) */}
        {/* Quando dois selos ficariam um em cima do outro, só o mais grave aparece (o trecho continua colorido) */}
        {comSelo
          .filter((t) => selosVisiveis.includes(t.id))
          .map((t) => {
            const [lng, lat] = meioDoTrecho(t)
            return (
              <Marker key={t.id} longitude={lng} latitude={lat}>
                <button
                  className="mapa__selo"
                  style={{ background: cores[t.faixa.id] }}
                  onClick={() => aoSelecionar(t.id)}
                  aria-label={nomeDoTrecho(t) + ': ' + rotuloCompleto(t.faixa, t.motivo) + '. Ver detalhes'}
                >
                  {t.faixa.icone}
                </button>
              </Marker>
            )
          })}

        {/* Reportes feitos pelas pessoas */}
        {reportesComLocal.map((r) => (
          <Marker key={'r' + r.id} longitude={r.lng} latitude={r.lat}>
            <button
              className="mapa__reporte"
              onClick={aoAbrirReporte}
              aria-label={'Reporte: ' + (TIPOS[r.tipo] || 'problema') + ', ' + r.rua + '. Abrir reportes'}
            >
              <IconMessageReport size={20} aria-hidden="true" />
            </button>
          </Marker>
        ))}

        {/* Você */}
        {voce && (
          <Marker longitude={voce.lng} latitude={voce.lat}>
            <span className="mapa__voce">
              <FiguraPessoa tamanho={30} rotulo="Você está aqui" />
            </span>
          </Marker>
        )}
      </MapaBase>
    </div>
  )
}
