import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cabecalho from '../components/Cabecalho'
import Mapa from '../components/Mapa'
import ListaTrechos from '../components/ListaTrechos'
import Legenda from '../components/Legenda'
import WidgetCalor from '../components/WidgetCalor'
import AlertaTrecho from '../components/AlertaTrecho'
import Aviso from '../components/Aviso'
import { useRotas } from '../hooks/useRotas'
import { useTema } from '../hooks/useTema'
import { useAviso } from '../hooks/useAviso'
import { trechoEmPerigo } from '../domain/rotas'

// Onde a pessoa está (simulado: na Rua Conde de Bonfim, perto do poste)
const VOCE = [-43.2303751, -22.9233039]

export default function PaginaMapa() {
  const { trechos, poste, escolhida } = useRotas()
  const { escuro } = useTema()
  const navigate = useNavigate()
  const location = useLocation()
  // Aviso que chega de outra tela (ex.: "Rota escolhida…")
  const { aviso } = useAviso((location.state && location.state.aviso) || '')
  // Interação Web Dev: alternar entre o mapa e a lista
  const [visao, setVisao] = useState('mapa')
  // Trecho que a pessoa decidiu ignorar ("Seguir assim")
  const [ignorado, setIgnorado] = useState('')

  // Alerta: a rota escolhida passa por Perigo e a pessoa ainda não dispensou este aviso
  const perigo = escolhida ? trechoEmPerigo(escolhida) : null
  const mostrarAlerta = perigo && ignorado !== perigo.id + perigo.motivo

  function abrirTrecho(id) {
    navigate('/trecho/' + id)
  }

  return (
    <>
      <Cabecalho titulo="Mapa" />
      <main className="app__conteudo">
        {mostrarAlerta && <AlertaTrecho trecho={perigo} aoSeguir={() => setIgnorado(perigo.id + perigo.motivo)} />}

        <WidgetCalor poste={poste} />

        {escolhida && (
          <p style={{ fontSize: 16 }}>
            Rota atual: <strong>{escolhida.nome}</strong> · {escolhida.minutos} min ·{' '}
            <Link to="/rotas" style={{ color: 'var(--link)', fontWeight: 700 }}>
              Trocar
            </Link>
          </p>
        )}

        <div className="abas" role="tablist" aria-label="Ver trechos como">
          <button
            role="tab"
            className="abas__aba"
            aria-selected={visao === 'mapa'}
            onClick={() => setVisao('mapa')}
          >
            Mapa
          </button>
          <button
            role="tab"
            className="abas__aba"
            aria-selected={visao === 'lista'}
            onClick={() => setVisao('lista')}
          >
            Lista
          </button>
        </div>

        {visao === 'mapa' ? (
          <>
            <Mapa trechos={trechos} escuro={escuro} voce={VOCE} aoSelecionar={abrirTrecho} />
            <Legenda />
          </>
        ) : (
          <ListaTrechos trechos={trechos} />
        )}
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
