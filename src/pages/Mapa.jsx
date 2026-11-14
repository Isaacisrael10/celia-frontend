import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconCurrentLocation, IconList, IconX } from '@tabler/icons-react'
import Mapa from '../components/Mapa'
import ListaTrechos from '../components/ListaTrechos'
import BuscaLugar from '../components/BuscaLugar'
import Legenda from '../components/Legenda'
import BoletimCaminho from '../components/BoletimCaminho'
import BotaoMenu from '../components/BotaoMenu'
import BotaoVisaoMapa from '../components/BotaoVisaoMapa'
import Aviso from '../components/Aviso'
import { useRotas } from '../hooks/useRotas'
import { useReportes } from '../hooks/useReportes'
import { useLocalizacao } from '../hooks/useLocalizacao'
import { useTema } from '../hooks/useTema'
import { usePreferencia } from '../hooks/usePreferencia'
import { useAviso } from '../hooks/useAviso'
import { useLimiteCalor } from '../hooks/useLimiteCalor'
import { useConsultaDeTela } from '../hooks/useConsultaDeTela'
import { useTituloDaPagina } from '../hooks/useTituloDaPagina'
import { VOCE_PADRAO } from '../domain/mapa'
import { areaDaRota } from '../domain/rotas'
import { creditoDoMapa } from '../styles/mapa/estilos'
import './Mapa.css'

/*
  Tela do Mapa: o mapa ocupa a tela toda (de ponta a ponta) e as peças de vidro flutuam por cima.
  - Celular: busca em cima; botões e o boletim do caminho de sempre embaixo.
  - Computador: busca, boletim e lista numa coluna à esquerda; o mapa continua aparecendo ao lado.
  No canto de baixo, à direita: "Meu local" e a troca entre mapa e satélite.
*/
export default function PaginaMapa() {
  useTituloDaPagina('Mapa')
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
  // Interação Web Dev: alternar entre o desenho do mapa e a foto de satélite (fica salvo no navegador)
  const [satelite, alternarSatelite] = usePreferencia('celia-satelite')
  // Para onde a câmera do mapa deve ir (busca, GPS ou caminho de sempre)
  const [alvo, setAlvo] = useState(null)
  // Em tela larga cabem o mapa E a lista lado a lado
  const telaLarga = useConsultaDeTela('(min-width: 960px)')

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
  // No celular a lista entra no lugar do mapa; em tela larga o mapa fica sempre
  const mostrarMapa = telaLarga || !naLista

  return (
    <>
      <main id="conteudo" className={'tela-mapa' + (mostrarMapa ? '' : ' tela-mapa--sem-mapa')}>
        {/* A tela não tem cabeçalho: o título existe para o leitor de tela */}
        <h1 className="so-leitor" tabIndex={-1}>
          Mapa
        </h1>

        {mostrarMapa && (
          <Mapa
            trechos={trechos}
            reportes={reportes}
            escuro={escuro}
            satelite={satelite}
            voce={posicao || VOCE_PADRAO}
            alvo={alvo}
            destaque={escolhida ? escolhida.trechos : []}
            aoSelecionar={(id) => navigate('/trecho/' + id)}
            aoAbrirReporte={() => navigate('/reportar')}
          />
        )}

        {/* Em cima: o símbolo (abre o menu) e a busca */}
        <div className="tela-mapa__topo">
          <BotaoMenu />
          <BuscaLugar aoEscolher={irPara} />
        </div>

        {/* O boletim do caminho de sempre: embaixo no celular, abaixo da busca no computador */}
        <div className="tela-mapa__boletim">
          <BoletimCaminho rota={escolhida} poste={poste} limiteCalor={limiteCalor} aoVerNoMapa={verCaminho} />
        </div>

        {/* A lista de trechos: a alternativa completa ao mapa (só ela rola) */}
        <div className="tela-mapa__meio">
          {naLista && (
            <section className="tela-mapa__lista vidro vidro--forte" aria-label="Trechos em lista">
              <ListaTrechos trechos={trechos} />
            </section>
          )}
        </div>

        {/* Botões flutuantes: legenda e lista de um lado; meu local e mapa/satélite no canto direito */}
        <div className="tela-mapa__ferramentas">
          {mostrarMapa && <Legenda />}
          <button
            className="pilula pilula--vidro"
            onClick={() => setVisao(naLista ? 'mapa' : 'lista')}
            aria-pressed={naLista}
          >
            {naLista ? <IconX size={20} aria-hidden="true" /> : <IconList size={20} aria-hidden="true" />}
            {naLista ? 'Fechar lista' : 'Lista'}
          </button>
          {mostrarMapa && (
            <>
              <p className="tela-mapa__credito">{creditoDoMapa(satelite)}</p>
              <div className="tela-mapa__canto">
                <button className="botao-icone" onClick={irParaMeuLocal} aria-label="Centralizar no meu local">
                  <IconCurrentLocation size={24} aria-hidden="true" />
                </button>
                <BotaoVisaoMapa satelite={satelite} aoAlternar={alternarSatelite} />
              </div>
            </>
          )}
        </div>
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
