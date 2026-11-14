import { Link, useLocation } from 'react-router-dom'
import FiguraPessoa from './FiguraPessoa'
import IconeNo from './IconeNo'
import { NOS, EXTRAS, noAtivo } from '../domain/navegacao'
import './NavGrafo.css'

/*
  Navegação principal desenhada como um grafo: cada tela é uma BOLINHA
  e uma LINHA liga todas elas (como as mãos e os pés do símbolo de acessibilidade).

  - No celular: barra de vidro flutuando embaixo.
  - Em telas largas: trilho de vidro na lateral, com o símbolo no topo, as bolinhas
    espalhadas pela altura toda e o "Sobre o projeto" embaixo.
  O fundo é glassmorfismo: translúcido, com o que está atrás desfocado (ver NavGrafo.css).

  A bolinha azul (o "viajante") desliza pela linha até a tela escolhida.
  - aoAbrirMenu(): abre o menu em forma de símbolo (MenuGrafo)
*/
export default function NavGrafo({ aoAbrirMenu }) {
  const { pathname } = useLocation()
  const ativo = noAtivo(pathname)
  // Posição da tela atual na lista (0, 1, 2...): o CSS usa este número para mover o viajante.
  // Vale -1 quando a tela não é um ponto do grafo (ex.: Sobre): aí o viajante não aparece.
  const indice = NOS.findIndex((no) => no.id === ativo)

  return (
    <nav className="nav-grafo" aria-label="Navegação principal">
      {/* O símbolo é a marca e também o botão do menu (só aparece no trilho lateral) */}
      <button className="nav-grafo__marca" onClick={aoAbrirMenu} aria-haspopup="dialog">
        <FiguraPessoa tamanho={48} />
        <span className="nav-grafo__marca-textos">
          <span className="nav-grafo__marca-nome">C.E.L.I.A.</span>
          <span className="nav-grafo__marca-apoio">Abrir o menu</span>
        </span>
      </button>

      {/* --total diz ao CSS em quantas partes iguais dividir o espaço */}
      <div className="nav-grafo__trilha" style={{ '--ativo': indice, '--total': NOS.length }}>
        {/* Só desenho: o traço que sobe até o símbolo (no trilho) e a bolinha azul que anda pela linha */}
        <span className="nav-grafo__linha" aria-hidden="true" />
        {indice >= 0 && <span className="nav-grafo__viajante" aria-hidden="true" />}

        <ul className="nav-grafo__nos">
          {NOS.map((no) => (
            <li key={no.id}>
              {/* aria-current="page" avisa o leitor de tela qual é a tela atual */}
              <Link to={no.caminho} className="nav-grafo__no" aria-current={no.id === ativo ? 'page' : undefined}>
                <span className="nav-grafo__bolinha">
                  <IconeNo id={no.id} />
                </span>
                <span className="nav-grafo__textos">
                  <span className="nav-grafo__rotulo">{no.rotulo}</span>
                  {/* A frase de apoio só aparece no trilho largo. O leitor de tela lê só o nome (a navegação se repete em toda tela). */}
                  <span className="nav-grafo__apoio" aria-hidden="true">
                    {no.apoio}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Embaixo do trilho: o Assistente e a página que explica o projeto (fora do símbolo).
          No celular eles ficam no menu (e o Sobre também no Perfil). */}
      {EXTRAS.map((extra) => (
        <Link
          key={extra.id}
          to={extra.caminho}
          className="nav-grafo__sobre"
          aria-current={pathname.startsWith(extra.caminho) ? 'page' : undefined}
        >
          <span className="nav-grafo__sobre-icone">
            <IconeNo id={extra.id} />
          </span>
          <span className="nav-grafo__textos">
            <span className="nav-grafo__rotulo">{extra.rotulo}</span>
            <span className="nav-grafo__apoio" aria-hidden="true">
              {extra.apoio}
            </span>
          </span>
        </Link>
      ))}
    </nav>
  )
}
