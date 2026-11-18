import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import NavGrafo from './components/NavGrafo'
import FundoGrafo from './components/FundoGrafo'
import ErroDaTela from './components/ErroDaTela'
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
import Prefeitura from './pages/Prefeitura'
import Menu from './pages/Menu'

/*
  Moldura comum a todas as telas:
  fundo decorativo + navegação em grafo + o conteúdo da tela (Outlet).
  O menu é uma página própria (/menu): abrir o menu leva para lá, dizendo de qual tela a pessoa veio.
*/
function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // Ao trocar de tela, o foco vai para o título da tela nova (acessibilidade)
  useFocoNoTitulo()

  function abrirMenu() {
    navigate('/menu', { state: { de: pathname } })
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
        {/* Se a tela quebrar, só ela vira mensagem; a navegação continua (ErroDaTela) */}
        <ErroDaTela key={pathname}>
          {/* context: as telas recebem a função de abrir o menu (usada pelo BotaoMenu) */}
          <Outlet context={{ abrirMenu }} />
        </ErroDaTela>
      </div>
    </div>
  )
}

// Cada endereço do app abre uma tela (as telas ficam em src/pages). "/" e "/home" levam ao Menu; o Mapa fica em "/mapa".
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Menu: página própria, fora da moldura (sem a barra de navegação). É também a entrada do app. */}
        <Route
          path="/menu"
          element={
            <ErroDaTela>
              <Menu />
            </ErroDaTela>
          }
        />
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/home" element={<Navigate to="/menu" replace />} />
        <Route element={<Layout />}>
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/trecho/:id" element={<Trecho />} />
          <Route path="/rotas" element={<Rotas />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/locais" element={<Locais />} />
          <Route path="/trilha" element={<Trilha />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/assistente" element={<Assistente />} />
          <Route path="/prefeitura" element={<Prefeitura />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
