import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import './Cabecalho.css'

/*
  Cabeçalho claro do topo de cada tela: título da tela e o espaço reservado da logo.
  - titulo: texto do h1
  - voltar: true mostra o botão de voltar
  - aoVoltar: (opcional) o que fazer ao voltar. Sem ele, volta para a tela anterior.
*/
export default function Cabecalho({ titulo, voltar = false, aoVoltar }) {
  const navigate = useNavigate()

  return (
    <header className="cabecalho">
      {voltar && (
        <button className="cabecalho__voltar" onClick={aoVoltar || (() => navigate(-1))} aria-label="Voltar">
          <IconArrowLeft size={22} aria-hidden="true" />
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
