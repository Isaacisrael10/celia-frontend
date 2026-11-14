import { useOutletContext } from 'react-router-dom'
import FiguraPessoa from './FiguraPessoa'
import './BotaoMenu.css'

/*
  O símbolo de acessibilidade como botão: abre o menu em forma de símbolo (MenuGrafo).
  Aparece no topo das telas no celular. Em telas largas ele some,
  porque o trilho lateral já tem o símbolo.
  A função abrirMenu vem da moldura do app (Layout, em App.jsx) pelo Outlet.
*/
export default function BotaoMenu() {
  const { abrirMenu } = useOutletContext()

  return (
    <button className="botao-menu" onClick={abrirMenu} aria-haspopup="dialog" aria-label="Abrir o menu da C.E.L.I.A.">
      <FiguraPessoa tamanho={44} />
    </button>
  )
}
