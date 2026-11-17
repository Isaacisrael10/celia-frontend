import { Link } from 'react-router-dom'
import IconeNo from './IconeNo'
import { NOS } from '../domain/navegacao'
import './GrafoAcessibilidade.css'

/*
  O grafo de acessibilidade: o símbolo internacional de acessibilidade desenhado grande,
  em que cada ponto (cabeça, mãos, pés e o meio do corpo) é um link para uma parte do app.
  Veio do antigo menu em caixa de diálogo SEM mudar a estrutura (mesmo HTML e mesmas classes).
  Hoje mora na página do Menu (/menu).
  - ativo: id do ponto da tela de onde a pessoa veio ('' se nenhuma): mostra "Você está aqui"
  - aoEscolher(): (opcional) chamado ao tocar num ponto
*/
export default function GrafoAcessibilidade({ ativo = '', aoEscolher }) {
  return (
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
              onClick={aoEscolher}
              aria-current={no.id === ativo ? 'page' : undefined}
            >
              <span className="menu-grafo__bolinha">
                <IconeNo id={no.id} tamanho={28} />
              </span>
              {/* Nome, frase de apoio e "Você está aqui": o CSS decide de que lado da bolinha eles ficam */}
              <span className="menu-grafo__textos">
                {/* Nome longo ("Locais acessíveis") e curto ("Locais"): o CSS mostra só um dos dois,
                    o curto quando a figura fica pequena para o tamanho do texto */}
                {no.rotuloLongo ? (
                  <>
                    <span className="menu-grafo__nome menu-grafo__nome--longo">{no.rotuloLongo}</span>
                    <span className="menu-grafo__nome menu-grafo__nome--curto">{no.rotulo}</span>
                  </>
                ) : (
                  <span className="menu-grafo__nome">{no.rotulo}</span>
                )}
                <span className="menu-grafo__descricao">{no.apoio}</span>
                {no.id === ativo && <span className="menu-grafo__aqui">Você está aqui</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
