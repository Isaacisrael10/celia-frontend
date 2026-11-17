import { useLocation, useNavigate } from 'react-router-dom'
import { IconBuildingBank, IconUser, IconArrowRight } from '@tabler/icons-react'
import FundoGrafo from '../components/FundoGrafo'
import GrafoAcessibilidade from '../components/GrafoAcessibilidade'
import { useTituloDaPagina } from '../hooks/useTituloDaPagina'
import { useTema } from '../hooks/useTema'
import { useAcessibilidade } from '../hooks/useAcessibilidade'
import { PREFEITURA, noAtivo } from '../domain/navegacao'
import './Menu.css'
import LogoCelia from '../components/LogoCelia'
import NomeCelia from '../components/NomeCelia'

/*
  Página do Menu (endereço /menu). É também a entrada do app: "/" e "/home" levam para cá.
  Fica FORA da moldura das outras telas (sem a barra de navegação), ocupando a tela inteira.
  - à esquerda: o título "Para onde vamos?" e o grafo de acessibilidade,
    em que cada ponto do símbolo abre uma parte do app
  - à direita: o painel de acesso com os dois perfis de quem usa (Prefeitura e Cidadão)
  No celular: painel de acesso em cima; depois o título e o grafo.

  Quem abre o menu pela barra (o símbolo no topo) manda junto a tela de onde veio (state.de):
  o grafo mostra "Você está aqui" nela. Para sair, a pessoa escolhe um ponto do grafo ou um dos botões.
*/
export default function Menu() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const veioDe = state && state.de ? state.de : ''
  useTituloDaPagina('Menu')
  // Pode ser a primeira tela aberta: aplica no <html> o tema e os ajustes de acessibilidade salvos
  useTema()
  useAcessibilidade()

  return (
    // menu-tela: cria uma camada própria (isolation), senão o fundo animado (z-index -1) fica escondido atrás do body
    <div className="menu-tela">
      <FundoGrafo />
      <main id="conteudo" className="menu-pagina">
        {/* Esquerda: "Para onde vamos?" e, logo embaixo, o grafo de acessibilidade */}
        <section className="menu-pagina__grafo" aria-labelledby="menu-grafo-titulo">
          <div className="menu-pagina__chamada">
            <h2 id="menu-grafo-titulo" className="menu-pagina__grafo-titulo">
              Para onde vamos?
            </h2>
            <p className="menu-pagina__grafo-apoio">Cada ponto do símbolo de acessibilidade abre uma parte da <NomeCelia /></p>
          </div>
          <GrafoAcessibilidade ativo={noAtivo(veioDe)} />
        </section>

        {/* Direita: o painel de acesso, com os dois perfis */}
        <div className="menu-pagina__lado">
          <section className="menu-pagina__acesso cartao" aria-labelledby="menu-titulo">
            <p className="menu-pagina__marca">
              <LogoCelia tamanho={36} />
              <NomeCelia />
            </p>
            <h1 id="menu-titulo" className="menu-pagina__titulo">
              Saia de casa sabendo se o caminho até o trabalho está livre.
            </h1>
            <p className="menu-pagina__descricao">
              Postes nos pontos de ônibus medem a calçada e o calor e veem buracos sozinhos. O cidadão escolhe a rota mais
              segura, e a Prefeitura recebe os reportes para saber o que consertar primeiro.
            </p>

            <div className="menu-pagina__acoes">
              <button className="botao botao--primario menu-pagina__botao" onClick={() => navigate(PREFEITURA.caminho)}>
                <IconBuildingBank size={24} aria-hidden="true" />
                Acesso Prefeitura
                <IconArrowRight size={22} aria-hidden="true" />
              </button>
              <button className="botao botao--primario menu-pagina__botao" onClick={() => navigate('/mapa')}>
                <IconUser size={24} aria-hidden="true" />
                Acesso Cidadão
                <IconArrowRight size={22} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
