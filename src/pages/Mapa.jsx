import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cabecalho from '../components/Cabecalho'
import Mapa from '../components/Mapa'
import ListaTrechos from '../components/ListaTrechos'
import WidgetCalor from '../components/WidgetCalor'
import AlertaTrecho from '../components/AlertaTrecho'
import BuscaLugar from '../components/BuscaLugar'
import Aviso from '../components/Aviso'
import { useRotas } from '../hooks/useRotas'
import { useReportes } from '../hooks/useReportes'
import { useLocalizacao } from '../hooks/useLocalizacao'
import { useTema } from '../hooks/useTema'
import { useAviso } from '../hooks/useAviso'
import { trechoEmPerigo } from '../domain/rotas'

// Posição de reserva quando não temos o GPS (Rua Barão do Bom Retiro, Grajaú)
const VOCE_PADRAO = { lat: -22.9223585, lng: -43.2586232 }

export default function PaginaMapa() {
  const { trechos, poste, escolhida } = useRotas()
  const { reportes } = useReportes()
  const { posicao, pedirLocal } = useLocalizacao()
  const { escuro } = useTema()
  const navigate = useNavigate()
  const location = useLocation()
  // Aviso que chega de outra tela (ex.: "Rota escolhida…")
  const { aviso, mostrarAviso } = useAviso((location.state && location.state.aviso) || '')
  // Interação Web Dev: alternar entre o mapa e a lista
  const [visao, setVisao] = useState('mapa')
  // Trecho que a pessoa decidiu ignorar ("Seguir assim")
  const [ignorado, setIgnorado] = useState('')
  // Para onde a câmera do mapa deve ir (busca ou GPS)
  const [alvo, setAlvo] = useState(null)

  // Alerta: a rota escolhida passa por Perigo e a pessoa ainda não dispensou este aviso
  const perigo = escolhida ? trechoEmPerigo(escolhida) : null
  const mostrarAlerta = perigo && ignorado !== perigo.id + perigo.motivo

  function abrirTrecho(id) {
    navigate('/trecho/' + id)
  }

  // Busca de lugar: mostra o mapa e voa até o lugar escolhido
  function irPara(lugar) {
    setVisao('mapa')
    setAlvo(lugar)
  }

  // Botão "Meu local": usa o GPS do celular
  async function irParaMeuLocal() {
    const local = await pedirLocal()
    if (local) {
      setAlvo({ ...local })
    } else {
      mostrarAviso('Não deu para ver sua localização. Confira a permissão do navegador.')
    }
  }

  return (
    <>
      <Cabecalho titulo="Mapa" />
      {/* Tela cheia: o mapa ocupa o espaço que sobra e a página não rola (só o mapa mexe) */}
      <main className={'app__conteudo app__conteudo--mapa' + (visao === 'lista' ? ' app__conteudo--rola' : '')}>
        {mostrarAlerta && <AlertaTrecho trecho={perigo} aoSeguir={() => setIgnorado(perigo.id + perigo.motivo)} />}

        {/* O aviso de calor só aparece quando o poste mandou leitura recente */}
        {poste.recente && <WidgetCalor poste={poste} />}

        {escolhida && (
          <p style={{ fontSize: 16 }}>
            Rota atual: <strong>{escolhida.nome}</strong> · {escolhida.minutos} min ·{' '}
            <Link to="/rotas" style={{ color: 'var(--link)', fontWeight: 700 }}>
              Trocar
            </Link>
          </p>
        )}

        <BuscaLugar aoEscolher={irPara} />

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
            <Mapa
              trechos={trechos}
              reportes={reportes}
              escuro={escuro}
              voce={posicao || VOCE_PADRAO}
              alvo={alvo}
              aoSelecionar={abrirTrecho}
              aoAbrirReporte={() => navigate('/reportar')}
              aoPedirLocal={irParaMeuLocal}
            />
          </>
        ) : (
          <ListaTrechos trechos={trechos} />
        )}
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
