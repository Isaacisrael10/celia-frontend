import { NavLink } from 'react-router-dom'
import { IconMap, IconRoute, IconMessageReport, IconMapPin, IconUserCircle } from '@tabler/icons-react'
import './BarraInferior.css'

// As 5 abas do app. Para mudar a ordem ou um nome, é só mexer nesta lista.
const ABAS = [
  { caminho: '/', rotulo: 'Mapa', Icone: IconMap },
  { caminho: '/rotas', rotulo: 'Rotas', Icone: IconRoute },
  { caminho: '/reportar', rotulo: 'Reportar', Icone: IconMessageReport },
  { caminho: '/locais', rotulo: 'Locais', Icone: IconMapPin },
  { caminho: '/perfil', rotulo: 'Perfil', Icone: IconUserCircle },
]

export default function BarraInferior() {
  return (
    <nav className="barra-inferior" aria-label="Navegação principal">
      {ABAS.map(({ caminho, rotulo, Icone }) => (
        // NavLink já coloca aria-current="page" na aba da tela atual
        <NavLink key={caminho} to={caminho} end={caminho === '/'} className="barra-inferior__aba">
          <Icone size={26} stroke={2} aria-hidden="true" />
          <span>{rotulo}</span>
        </NavLink>
      ))}
    </nav>
  )
}
