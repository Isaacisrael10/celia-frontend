import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import './Cabecalho.css'

/*
  Cabeçalho grafite do topo de cada tela.
  - titulo: texto do h1
  - voltar: true mostra o botão de voltar
*/
export default function Cabecalho({ titulo, voltar = false }) {
  const navigate = useNavigate()

  return (
    <header className="cabecalho">
      {voltar && (
        <button className="cabecalho__voltar" onClick={() => navigate(-1)} aria-label="Voltar">
          <IconArrowLeft size={26} aria-hidden="true" />
        </button>
      )}
      <h1 className="cabecalho__titulo">{titulo}</h1>
      {/* Espaço reservado da logo (a logo ainda não existe) */}
      <span className="cabecalho__logo" aria-hidden="true">
        logo
      </span>
    </header>
  )
}
