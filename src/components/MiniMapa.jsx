import MapaBase, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IconToiletPaper, IconArmchair } from '@tabler/icons-react'
import FiguraPessoa from './FiguraPessoa'
import { estiloDoMapa } from '../styles/mapa/estilos'
import { areaDosPontos } from '../domain/mapa'
import { textoQuantidade } from '../domain/locais'
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
  const pontos = [...locais, voce].map((p) => [p.lng, p.lat])
  const area = areaDosPontos(pontos)

  return (
    <div className="mini-mapa" aria-hidden="true">
      <MapaBase
        initialViewState={{ bounds: area, fitBoundsOptions: { padding: 30 } }}
        mapStyle={estiloDoMapa(escuro)}
        attributionControl={false}
        // Só ilustração: o dedo passa direto e rola a página (não fica preso no mapa)
        interactive={false}
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
        {textoQuantidade(locais.length)} perto
      </span>
      <p className="mini-mapa__credito">© OpenStreetMap</p>
    </div>
  )
}
