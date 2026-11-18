import { IconSatellite, IconMap2 } from '@tabler/icons-react'
import { VISOES_MAPA } from '../domain/mapa'

/*
  Botão que troca o jeito de ver o mapa: desenho (mapa) ou foto de satélite.
  O ícone mostra para ONDE a pessoa vai: no mapa aparece o satélite; no satélite aparece o mapa.
  - satelite: true se a foto de satélite está ligada agora
  - aoAlternar(): troca de um para o outro
*/
export default function BotaoVisaoMapa({ satelite, aoAlternar }) {
  const Icone = satelite ? IconMap2 : IconSatellite
  const destino = satelite ? VISOES_MAPA.mapa : VISOES_MAPA.satelite
  const texto = 'Trocar para ' + destino

  return (
    <button className="botao-icone" onClick={aoAlternar} aria-label={texto} title={texto}>
      <Icone size={22} aria-hidden="true" />
    </button>
  )
}
