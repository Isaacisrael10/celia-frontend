import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconCurrentLocation, IconList, IconMap } from '@tabler/icons-react'
import Mapa from '../components/Mapa'
import ListaTrechos from '../components/ListaTrechos'
import BuscaLugar from '../components/BuscaLugar'
import Legenda from '../components/Legenda'
import BoletimCaminho from '../components/BoletimCaminho'
import Aviso from '../components/Aviso'
import { useRotas } from '../hooks/useRotas'
import { useReportes } from '../hooks/useReportes'
import { useLocalizacao } from '../hooks/useLocalizacao'
import { useTema } from '../hooks/useTema'
import { useAviso } from '../hooks/useAviso'
import { useLimiteCalor } from '../hooks/useLimiteCalor'
import './Mapa.css'

// Posição de reserva quando não temos o GPS (Rua Barão do Bom Retiro, Grajaú)
const VOCE_PADRAO = { lat: -22.9223585, lng: -43.2586232 }

// Retângulo que cobre todos os pontos dos trechos de uma rota: [[oeste, sul], [leste, norte]]
function areaDaRota(rota) {
  const pontos = rota.trechosDaRota.flatMap((t) => t.coords)
  const lngs = pontos.map((p) => p[0])
  const lats = pontos.map((p) => p[1])
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
}

/*
  Tela do Mapa: o mapa ocupa a tela toda (de ponta a ponta).
  Por cima dele flutuam a busca (em cima), os botões (acima da gaveta)
  e a gaveta do boletim do caminho de sempre (embaixo).
*/
export default function PaginaMapa() {
  // "escolhida" é o caminho de sempre que a pessoa escolheu na tela Rotas
  const { trechos, poste, escolhida } = useRotas()
  const { reportes } = useReportes()
  const { posicao, pedirLocal } = useLocalizacao()
  const { escuro } = useTema()
  const [limiteCalor] = useLimiteCalor()
  const navigate = useNavigate()
  const location = useLocation()
  // Aviso que chega de outra tela (ex.: "Caminho de sempre salvo…")
  const { aviso, mostrarAviso } = useAviso((location.state && location.state.aviso) || '')
  // Interação Web Dev: alternar entre o mapa e a lista
  const [visao, setVisao] = useState('mapa')
  // Para onde a câmera do mapa deve ir (busca, GPS ou caminho de sempre)
  const [alvo, setAlvo] = useState(null)

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

  // "Ver no mapa" do boletim: enquadra o caminho de sempre
  function verCaminho() {
    setVisao('mapa')
    setAlvo({ area: areaDaRota(escolhida) })
  }

  const naLista = visao === 'lista'

  return (
    <>
      <main className={'tela-mapa' + (naLista ? ' tela-mapa--lista' : '')}>
        {/* A tela não tem cabeçalho: o título existe para o leitor de tela */}
        <h1 className="so-leitor">Mapa</h1>

        {!naLista && (
          <Mapa
            trechos={trechos}
            reportes={reportes}
            escuro={escuro}
            voce={posicao || VOCE_PADRAO}
            alvo={alvo}
            destaque={escolhida ? escolhida.trechos : []}
            aoSelecionar={(id) => navigate('/trecho/' + id)}
            aoAbrirReporte={() => navigate('/reportar')}
          />
        )}

        {/* Em cima: busca e o espaço reservado da logo */}
        <div className="tela-mapa__topo">
          <BuscaLugar aoEscolher={irPara} />
          <span className="tela-mapa__logo" aria-hidden="true">
            logo
          </span>
        </div>

        {/* No meio: na visão em lista, a lista de trechos (só ela rola) */}
        <div className="tela-mapa__meio">
          {naLista && (
            <div className="tela-mapa__lista">
              <ListaTrechos trechos={trechos} />
            </div>
          )}
        </div>

        {/* Embaixo: botões flutuantes e a gaveta do boletim */}
        <div className="tela-mapa__base">
          <div className="tela-mapa__botoes">
            {!naLista && <Legenda />}
            <button
              className="tela-mapa__pilula"
              onClick={() => setVisao(naLista ? 'mapa' : 'lista')}
              aria-pressed={naLista}
            >
              {naLista ? <IconMap size={18} aria-hidden="true" /> : <IconList size={18} aria-hidden="true" />}
              {naLista ? 'Ver mapa' : 'Lista'}
            </button>
            {!naLista && (
              <button className="tela-mapa__meu-local" onClick={irParaMeuLocal} aria-label="Centralizar no meu local">
                <IconCurrentLocation size={24} aria-hidden="true" />
              </button>
            )}
          </div>
          {!naLista && <p className="tela-mapa__credito">OpenFreeMap © OpenMapTiles Data from OpenStreetMap</p>}
          <BoletimCaminho rota={escolhida} poste={poste} limiteCalor={limiteCalor} aoVerNoMapa={verCaminho} />
        </div>
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
