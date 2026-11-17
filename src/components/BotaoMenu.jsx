import { useOutletContext } from 'react-router-dom'
import LogoCelia from './LogoCelia'
import './BotaoMenu.css'

/*
  A logo da C.E.L.I.A. como botão: abre a página do Menu (/menu).
  Aparece no topo das telas no celular. Em telas largas ele some,
  porque o trilho lateral já tem a logo.
  A função abrirMenu vem da moldura do app (Layout, em App.jsx) pelo Outlet.
*/
export default function BotaoMenu() {
  const { abrirMenu } = useOutletContext()

  return (
    <button className="botao-menu" onClick={abrirMenu} aria-label="Abrir o menu da C.E.L.I.A.">
      <LogoCelia tamanho={40} />
    </button>
  )
}
