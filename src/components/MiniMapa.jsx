import MapaBase, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IconToiletPaper, IconArmchair } from '@tabler/icons-react'
import estiloClaro from '../styles/mapa/celia-mapa-claro.json'
import estiloEscuro from '../styles/mapa/celia-mapa-escuro.json'
import FiguraPessoa from './FiguraPessoa'
import './MiniMapa.css'

const ICONES = { banheiro: IconToiletPaper, descanso: IconArmchair }

/*
  Mapa pequeno com os locais (pinos) e a pessoa.
  É só para se localizar: a lista abaixo dele tem as mesmas informações em texto.
  - locais: lista com lat/lng
  - voce: { lat, lng }
  - escuro: estilo escuro
*/
export default function MiniMapa({ locais, voce, escuro }) {
  // Enquadra todos os pontos (locais + pessoa) no mapa
  const lngs = [...locais.map((l) => l.lng), voce.lng]
  const lats = [...locais.map((l) => l.lat), voce.lat]
  const area = [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]

  return (
    <div className="mini-mapa" aria-hidden="true">
      <MapaBase
        initialViewState={{ bounds: area, fitBoundsOptions: { padding: 30 } }}
        mapStyle={escuro ? estiloEscuro : estiloClaro}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {locais.map((local) => {
          const Icone = ICONES[local.tipo]
          return (
            <Marker key={local.id} longitude={local.lng} latitude={local.lat} anchor="bottom">
              <span className="mini-mapa__pino">
                <Icone size={16} />
              </span>
            </Marker>
          )
        })}
        <Marker longitude={voce.lng} latitude={voce.lat}>
          <FiguraPessoa tamanho={24} />
        </Marker>
      </MapaBase>
      <span className="mini-mapa__contador">
        {locais.length === 1 ? '1 local perto' : locais.length + ' locais perto'}
      </span>
      <p className="mini-mapa__credito">© OpenStreetMap</p>
    </div>
  )
}
