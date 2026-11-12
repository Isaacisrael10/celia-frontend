import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cabecalho from '../components/Cabecalho'
import Mapa from '../components/Mapa'
import ListaTrechos from '../components/ListaTrechos'
import Legenda from '../components/Legenda'
import WidgetCalor from '../components/WidgetCalor'
import { useTrechos } from '../hooks/useTrechos'
import { useTema } from '../hooks/useTema'

// Onde a pessoa está (simulado: na Rua Conde de Bonfim, perto do poste)
const VOCE = [-43.2303751, -22.9233039]

export default function PaginaMapa() {
  const { trechos, poste } = useTrechos()
  const { escuro } = useTema()
  const navigate = useNavigate()
  // Interação Web Dev: alternar entre o mapa e a lista
  const [visao, setVisao] = useState('mapa')

  function abrirTrecho(id) {
    navigate('/trecho/' + id)
  }

  return (
    <>
      <Cabecalho titulo="Mapa" />
      <main className="app__conteudo">
        <WidgetCalor poste={poste} />

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
    </>
  )
}
