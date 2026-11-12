import { useMemo } from 'react'
import MapaBase, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import estiloClaro from '../styles/mapa/celia-mapa-claro.json'
import estiloEscuro from '../styles/mapa/celia-mapa-escuro.json'
import { CORES_MAPA, rotuloCompleto } from '../domain/faixas'
import { nomeDoTrecho, meioDoTrecho } from '../domain/trechos'
import './Mapa.css'

// Área do bairro que aparece ao abrir (Tijuca, ruas de exemplo)
const AREA_INICIAL = [
  [-43.2365, -22.9285],
  [-43.2255, -22.9205],
]

// As linhas ficam abaixo desta camada, para os nomes das ruas ficarem por cima
const ABAIXO_DE = 'highway-name-minor'

// O crédito "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" já vem do próprio estilo

/*
  Mapa real (MapLibre + OpenFreeMap) com os trechos coloridos por faixa.
  - trechos: lista de trechos já com { faixa, motivo } calculados
  - escuro: true usa o estilo escuro
  - voce: [lng, lat] da pessoa
  - aoSelecionar(id): abre o detalhe do trecho
*/
export default function Mapa({ trechos, escuro, voce, aoSelecionar }) {
  const cores = escuro ? CORES_MAPA.escuro : CORES_MAPA.claro

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

  return (
    <div className="mapa">
      <MapaBase
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

        {/* Você */}
        {voce && (
          <Marker longitude={voce[0]} latitude={voce[1]}>
            <span className="mapa__voce" role="img" aria-label="Você está aqui">
              <span className="mapa__voce-ponto" />
            </span>
          </Marker>
        )}
      </MapaBase>
    </div>
  )
}
