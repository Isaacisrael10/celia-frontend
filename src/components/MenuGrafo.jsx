import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconX } from '@tabler/icons-react'
import IconeNo from './IconeNo'
import { NOS, SOBRE, ASSISTENTE, noAtivo } from '../domain/navegacao'
import './MenuGrafo.css'

/*
  Menu em forma do símbolo de acessibilidade.
  O símbolo é desenhado grande e cada ponto dele (cabeça, mãos, pés e o meio do corpo)
  é um botão que leva a uma parte do app. É o "mapa do app": mostra tudo o que existe numa tela só.

  Usa a tag <dialog> do HTML: com showModal() o próprio navegador prende o foco
  dentro do menu, fecha com a tecla Esc e devolve o foco para o botão que abriu.
  - aberto: true ou false
  - aoFechar(): chamado ao fechar (botão, Esc, clique fora ou escolha de uma tela)
*/
export default function MenuGrafo({ aberto, aoFechar }) {
  const dialogo = useRef(null)
  const { pathname } = useLocation()
  const ativo = noAtivo(pathname)

  // Abre ou fecha a caixa de diálogo quando "aberto" muda
  useEffect(() => {
    const caixa = dialogo.current
    if (aberto && !caixa.open) caixa.showModal()
    if (!aberto && caixa.open) caixa.close()
  }, [aberto])

  // Clique no fundo (fora do conteúdo) também fecha
  function fecharSeClicouFora(evento) {
    if (evento.target === evento.currentTarget) aoFechar()
  }

  return (
    <dialog ref={dialogo} className="menu-grafo" aria-labelledby="menu-grafo-titulo" onClose={aoFechar}>
      {/* Fechar: fica preso no canto da tela, mesmo se o menu rolar */}
      <button className="botao-icone menu-grafo__fechar" onClick={aoFechar} aria-label="Fechar o menu">
        <IconX size={24} aria-hidden="true" />
      </button>

      {/* Só esta parte rola (em telas baixas); o botão de fechar fica parado */}
      <div className="menu-grafo__rolagem" onClick={fecharSeClicouFora}>
        <div className="menu-grafo__caixa">
          <div className="menu-grafo__topo">
            <h2 id="menu-grafo-titulo" className="menu-grafo__titulo">
              Para onde vamos?
            </h2>
            <p className="menu-grafo__apoio">Cada ponto do símbolo de acessibilidade abre uma parte da C.E.L.I.A.</p>
          </div>

          <nav className="menu-grafo__figura" aria-label="Partes do app">
            {/* As linhas do símbolo: círculo, braços e pernas (só desenho) */}
            <svg className="menu-grafo__tracos" viewBox="0 0 420 420" aria-hidden="true" focusable="false">
              <circle className="menu-grafo__traco menu-grafo__traco--circulo" cx="210" cy="210" r="196" pathLength="1" />
              <path className="menu-grafo__traco" d="M15 148 Q210 278 405 148" pathLength="1" />
              <path className="menu-grafo__traco" d="M210 213 L100 376" pathLength="1" />
              <path className="menu-grafo__traco" d="M210 213 L320 376" pathLength="1" />
            </svg>

            {/* Os pontos: cada um é um link, colocado na posição x/y do símbolo */}
            <ul className="menu-grafo__nos">
              {NOS.map((no, ordem) => (
                <li
                  key={no.id}
                  className={'menu-grafo__no menu-grafo__no--' + no.id}
                  style={{ '--x': no.x + '%', '--y': no.y + '%', '--ordem': ordem }}
                >
                  <Link
                    to={no.caminho}
                    className="menu-grafo__link"
                    onClick={aoFechar}
                    aria-current={no.id === ativo ? 'page' : undefined}
                  >
                    <span className="menu-grafo__bolinha">
                      <IconeNo id={no.id} tamanho={28} />
                    </span>
                    {/* Nome, frase de apoio e "Você está aqui": o CSS decide de que lado da bolinha eles ficam */}
                    <span className="menu-grafo__textos">
                      <span className="menu-grafo__nome">{no.rotulo}</span>
                      <span className="menu-grafo__descricao">{no.apoio}</span>
                      {no.id === ativo && <span className="menu-grafo__aqui">Você está aqui</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Fora do símbolo: o assistente de IA e a página que explica o projeto */}
          <Link to={ASSISTENTE.caminho} className="pilula menu-grafo__sobre" onClick={aoFechar}>
            <IconeNo id={ASSISTENTE.id} tamanho={20} />
            Assistente de IA
          </Link>
          <Link
            to={SOBRE.caminho}
            className="pilula menu-grafo__sobre menu-grafo__sobre--seguinte"
            onClick={aoFechar}
          >
            <IconeNo id={SOBRE.id} tamanho={20} />
            Sobre o projeto
          </Link>
        </div>
      </div>
    </dialog>
  )
}
