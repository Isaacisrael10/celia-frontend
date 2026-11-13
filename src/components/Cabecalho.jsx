import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import './Cabecalho.css'

/*
  Cabeçalho claro do topo de cada tela: nome do app em cima e o título da tela embaixo.
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
      <div className="cabecalho__textos">
        <p className="cabecalho__marca">
          C.E.L.I.A.
          <span className="cabecalho__nome"> · Caminhos em Liberdade, Inclusão e Acessibilidade</span>
        </p>
        <h1 className="cabecalho__titulo">{titulo}</h1>
      </div>
      {/* Espaço reservado da logo (a logo ainda não existe) */}
      <span className="cabecalho__logo" aria-hidden="true">
        logo
      </span>
    </header>
  )
}
