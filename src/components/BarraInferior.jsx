import { NavLink, useLocation } from 'react-router-dom'
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

/*
  Identidade: as 5 abas são as 5 bolinhas do símbolo de acessibilidade,
  ligadas por uma linha curva (como os braços do bonequinho).
  A bolinha azul cheia marca a aba atual e desliza quando a pessoa troca de tela.

  Posição de cada bolinha: no meio de cada aba (10%, 30%, 50%, 70%, 90%),
  um pouco mais baixa no centro, acompanhando a curva.
*/
const PONTOS = [
  { x: 10, y: 6 },
  { x: 30, y: 9 },
  { x: 50, y: 10 },
  { x: 70, y: 9 },
  { x: 90, y: 6 },
]

export default function BarraInferior() {
  const { pathname } = useLocation()
  // Qual aba está aberta? (-1 quando a tela não é uma das 5, ex.: detalhe do trecho)
  const ativa = ABAS.findIndex((aba) => aba.caminho === pathname)

  return (
    <nav className="barra-inferior" aria-label="Navegação principal">
      {/* Desenho do "corpo": decorativo, escondido do leitor de tela */}
      <div className="barra-inferior__corpo" aria-hidden="true">
        <svg className="barra-inferior__linha" viewBox="0 0 100 14" preserveAspectRatio="none">
          <path d="M10 6 Q50 14 90 6" vectorEffect="non-scaling-stroke" />
        </svg>
        {PONTOS.map((p, i) => (
          <span key={i} className="barra-inferior__no" style={{ left: p.x + '%', top: p.y + 'px' }} />
        ))}
        {ativa >= 0 && (
          <span
            className="barra-inferior__no-ativo"
            style={{ left: PONTOS[ativa].x + '%', top: PONTOS[ativa].y + 'px' }}
          />
        )}
      </div>

      {ABAS.map(({ caminho, rotulo, Icone }) => (
        // NavLink já coloca aria-current="page" na aba da tela atual
        <NavLink key={caminho} to={caminho} end={caminho === '/'} className="barra-inferior__aba">
          <Icone size={24} stroke={2} aria-hidden="true" />
          <span>{rotulo}</span>
        </NavLink>
      ))}
    </nav>
  )
}
