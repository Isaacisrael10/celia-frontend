import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import BarraInferior from './components/BarraInferior'
import Mapa from './pages/Mapa'
import Rotas from './pages/Rotas'
import Reportar from './pages/Reportar'
import Locais from './pages/Locais'
import Perfil from './pages/Perfil'
import Trecho from './pages/Trecho'

// Moldura comum a todas as telas: o conteúdo da tela (Outlet) + a barra inferior
function Layout() {
  return (
    <div className="app">
      <Outlet />
      <BarraInferior />
    </div>
  )
}

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
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
