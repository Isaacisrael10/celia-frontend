import { useEffect, useMemo, useRef } from 'react'
import MapaBase, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IconCurrentLocation, IconMessageReport } from '@tabler/icons-react'
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

// O crédito "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" já vem do próprio estilo

/*
  Mapa real (MapLibre + OpenFreeMap) com os trechos coloridos por faixa.
  - trechos: lista de trechos já com { faixa, motivo } calculados
  - reportes: reportes com lat/lng (viram marcadores)
  - escuro: true usa o estilo escuro
  - voce: { lat, lng } da pessoa
  - alvo: lugar para onde a câmera vai ({ area } ou { lat, lng }); muda quando a pessoa busca
  - aoSelecionar(id): abre o detalhe do trecho
  - aoAbrirReporte(): abre a tela de reportes
  - aoPedirLocal(): botão "Meu local"
*/
export default function Mapa({ trechos, reportes = [], escuro, voce, alvo, aoSelecionar, aoAbrirReporte, aoPedirLocal }) {
  const mapaRef = useRef(null)
  const cores = escuro ? CORES_MAPA.escuro : CORES_MAPA.claro

  // Quando o alvo muda (busca ou GPS), a câmera voa até ele
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || !alvo) return
    if (alvo.area) {
      mapa.fitBounds(alvo.area, { padding: 24, maxZoom: 17, duration: 1200 })
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
        initialViewState={{ bounds: AREA_INICIAL, fitBoundsOptions: { padding: 24 } }}
        mapStyle={escuro ? estiloEscuro : estiloClaro}
        attributionControl={{ compact: false }}
        interactiveLayerIds={['linha-normal', 'linha-atencao', 'linha-perigo', 'linha-sem-dados']}
        onClick={clicarNoMapa}
        cursor="pointer"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Source id="trechos" type="geojson" data={geojson}>
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

        {/* Selos ! e ✕ no meio dos trechos em Atenção e Perigo (são botões: funcionam no teclado) */}
        {trechos
          .filter((t) => t.faixa.id === 'atencao' || t.faixa.id === 'perigo')
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
              <FiguraPessoa tamanho={40} rotulo="Você está aqui" />
            </span>
          </Marker>
        )}
      </MapaBase>

      {aoPedirLocal && (
        <button className="mapa__meu-local" onClick={aoPedirLocal} aria-label="Centralizar no meu local">
          <IconCurrentLocation size={26} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
