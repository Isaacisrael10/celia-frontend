import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconRoute, IconTemperature, IconArrowsExchange, IconMap2, IconChevronDown, IconMessageQuestion } from '@tabler/icons-react'
import BadgeFaixa from './BadgeFaixa'
import { boletimDaRota, linhaDoPoste } from '../domain/boletim'
import './BoletimCaminho.css'

/*
  Cartão de vidro em cima do mapa: o "boletim do caminho de sempre".
  Responde em poucos segundos se dá para ir trabalhar hoje pelo caminho de sempre.
  - rota: o caminho de sempre já analisado (ou null se a pessoa ainda não escolheu)
  - poste: o que o useStatusPoste devolve
  - limiteCalor: temperatura do alerta de calor (Perfil); 0 = desligado
  - aoVerNoMapa(): enquadra o caminho no mapa
*/
export default function BoletimCaminho({ rota, poste, limiteCalor, aoVerNoMapa }) {
  // Interação Web Dev: abrir e fechar a gaveta com os detalhes
  const [aberto, setAberto] = useState(false)
  const linhaPoste = linhaDoPoste(poste, limiteCalor)

  // Primeira vez: a pessoa ainda não escolheu o caminho de sempre
  if (!rota) {
    return (
      <section className="boletim vidro vidro--forte" aria-labelledby="boletim-titulo">
        <div className="boletim__topo">
          <span className="boletim__icone" aria-hidden="true">
            <IconRoute size={20} />
          </span>
          <div className="boletim__textos">
            <h2 id="boletim-titulo" className="boletim__titulo">
              Qual é o seu caminho de sempre?
            </h2>
            <p className="boletim__apoio">Escolha uma vez e veja como ele está antes de sair.</p>
          </div>
          <Link to="/rotas" className="botao botao--primario botao--pequeno boletim__acao">
            Escolher
          </Link>
        </div>
        {linhaPoste && <p className="boletim__poste">{linhaPoste.texto}</p>}
      </section>
    )
  }

  const { faixa, titulo, apoio } = boletimDaRota(rota)

  return (
    <section className="boletim vidro vidro--forte" aria-labelledby="boletim-titulo">
      <div className="boletim__topo">
        <BadgeFaixa faixa={faixa} tamanho={40} />
        <div className="boletim__textos">
          {/* O título fica em cor escura: só o marcador leva a cor da faixa (contraste no sol) */}
          <h2 id="boletim-titulo" className="boletim__titulo">
            {titulo}
          </h2>
          <p className="boletim__apoio">{apoio}</p>
        </div>
      </div>

      {/* Alerta de calor: só quando o poste passou do limite escolhido no Perfil */}
      {linhaPoste && linhaPoste.calorAlto && (
        <p className="boletim__calor">
          <IconTemperature size={20} aria-hidden="true" />
          Calor acima de {limiteCalor} °C no ponto de ônibus
        </p>
      )}
      {linhaPoste && linhaPoste.calorExtremo && (
        <Link to="/locais" className="acao-texto">
          Ver lugares para descansar na sombra
        </Link>
      )}

      <div className="boletim__acoes">
        <button className="botao botao--secundario botao--pequeno" onClick={aoVerNoMapa}>
          <IconMap2 size={20} aria-hidden="true" />
          Ver no mapa
        </button>
        <button
          className="acao-texto boletim__detalhes-botao"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          aria-controls="boletim-detalhes"
        >
          Detalhes
          {/* A setinha gira quando os detalhes abrem */}
          <IconChevronDown size={20} aria-hidden="true" className={'boletim__seta' + (aberto ? ' boletim__seta--aberta' : '')} />
        </button>
      </div>

      {/*
        Os detalhes ficam sempre na página para a altura poder abrir e fechar com movimento suave.
        Fechados, "inert" tira o conteúdo do teclado e do leitor de tela.
      */}
      <div id="boletim-detalhes" className={'boletim__dobra' + (aberto ? ' boletim__dobra--aberta' : '')} inert={!aberto}>
        <div className="boletim__detalhes">
          <p className="boletim__percurso">
            <span className="boletim__rotulo">Caminho de sempre</span>
            {rota.nome} · {rota.minutos} min
            <span className="boletim__rotulo">
              {rota.origem} até {rota.destino}
            </span>
          </p>
          {linhaPoste && <p className="boletim__poste">{linhaPoste.texto}</p>}
          <p className="boletim__simulado">
            Só o poste do ponto é lido ao vivo. Os outros trechos usam dados simulados de exemplo.
          </p>
          <div className="boletim__links">
            <Link to="/rotas" className="acao-texto">
              <IconArrowsExchange size={20} aria-hidden="true" />
              Trocar caminho
            </Link>
            <Link to="/assistente" className="acao-texto">
              <IconMessageQuestion size={20} aria-hidden="true" />
              Perguntar
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
