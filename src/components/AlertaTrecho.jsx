import { Link } from 'react-router-dom'
import { IconArrowRight } from '@tabler/icons-react'
import BadgeFaixa from './BadgeFaixa'
import { textoDoMotivo } from '../domain/faixas'
import './AlertaTrecho.css'

/*
  Aviso no topo do mapa quando a rota escolhida passa por um trecho em Perigo (RF03).
  Como o poste é lido ao vivo, o aviso aparece sozinho se o trecho mudar para Perigo.
  - trecho: o trecho em Perigo
  - aoSeguir: a pessoa decidiu seguir assim (esconde o aviso)
*/
export default function AlertaTrecho({ trecho, aoSeguir }) {
  const motivo = textoDoMotivo(trecho.motivo)

  return (
    <section className="alerta-trecho" role="alert">
      <div className="alerta-trecho__topo">
        <BadgeFaixa faixa={trecho.faixa} tamanho={32} />
        <p className="alerta-trecho__texto">
          O trecho da {trecho.rua} está em Perigo{motivo && ' por ' + motivo}. Quer ver outra rota?
        </p>
      </div>
      <div className="alerta-trecho__botoes">
        <Link to="/rotas" className="botao botao--primario botao--pequeno">
          Ver rotas
          <IconArrowRight size={20} aria-hidden="true" />
        </Link>
        <button className="botao botao--secundario botao--pequeno" onClick={aoSeguir}>
          Seguir assim
        </button>
      </div>
    </section>
  )
}
