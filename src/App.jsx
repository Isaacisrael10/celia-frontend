import { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import NavGrafo from './components/NavGrafo'
import MenuGrafo from './components/MenuGrafo'
import FundoGrafo from './components/FundoGrafo'
import { useFocoNoTitulo } from './hooks/useFocoNoTitulo'
import Mapa from './pages/Mapa'
import Rotas from './pages/Rotas'
import Reportar from './pages/Reportar'
import Locais from './pages/Locais'
import Trilha from './pages/Trilha'
import Perfil from './pages/Perfil'
import Sobre from './pages/Sobre'
import Assistente from './pages/Assistente'
import Trecho from './pages/Trecho'

/*
  Moldura comum a todas as telas:
  fundo decorativo + navegação em grafo + o conteúdo da tela (Outlet) + menu em forma de símbolo.
*/
function Layout() {
  // Interação: abrir e fechar o menu em forma de símbolo
  const [menuAberto, setMenuAberto] = useState(false)
  // Ao trocar de tela, o foco vai para o título da tela nova (acessibilidade)
  useFocoNoTitulo()

  function abrirMenu() {
    setMenuAberto(true)
  }

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <div className="app">
      {/* Primeiro item do teclado: pula a navegação e vai direto para o conteúdo */}
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <FundoGrafo />
      <NavGrafo aoAbrirMenu={abrirMenu} />
      <div className="app__tela">
        {/* context: as telas recebem a função de abrir o menu (usada pelo BotaoMenu) */}
        <Outlet context={{ abrirMenu }} />
      </div>
      <MenuGrafo aberto={menuAberto} aoFechar={fecharMenu} />
    </div>
  )
}

// Cada endereço do app abre uma tela (as telas ficam em src/pages)
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Mapa />} />
          <Route path="/trecho/:id" element={<Trecho />} />
          <Route path="/rotas" element={<Rotas />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/locais" element={<Locais />} />
          <Route path="/trilha" element={<Trilha />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/assistente" element={<Assistente />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
