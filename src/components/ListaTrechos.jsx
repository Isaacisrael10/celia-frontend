import { Link } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import BadgeFaixa from './BadgeFaixa'
import { rotuloCompleto } from '../domain/faixas'
import { nomeDoTrecho, ordenarPorCuidado } from '../domain/trechos'
import './ListaTrechos.css'

/*
  Os trechos em lista: a alternativa completa ao mapa para quem usa leitor de tela.
  O que pede mais cuidado aparece primeiro (Perigo, Atenção, Sem dados, Normal).
*/
export default function ListaTrechos({ trechos }) {
  const ordenados = ordenarPorCuidado(trechos)

  return (
    <ul className="lista-trechos">
      {ordenados.map((t) => (
        <li key={t.id}>
          <Link to={'/trecho/' + t.id} className="lista-trechos__item">
            <BadgeFaixa faixa={t.faixa} tamanho={30} />
            <span className="lista-trechos__textos">
              <span className="lista-trechos__nome">{nomeDoTrecho(t)}</span>
              <span className="lista-trechos__faixa">
                {rotuloCompleto(t.faixa, t.motivo)}
                {t.aoVivo && ' · ao vivo'}
              </span>
            </span>
            <IconChevronRight size={24} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
