import { Link } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import BadgeFaixa from './BadgeFaixa'
import { rotuloCompleto } from '../domain/faixas'
import { nomeDoTrecho } from '../domain/trechos'
import './ListaTrechos.css'

// Ordem da lista: o que pede mais cuidado primeiro
const ORDEM = { perigo: 0, atencao: 1, semDados: 2, normal: 3 }

/*
  Os trechos em lista: a alternativa completa ao mapa para quem usa leitor de tela.
*/
export default function ListaTrechos({ trechos }) {
  const ordenados = [...trechos].sort((a, b) => ORDEM[a.faixa.id] - ORDEM[b.faixa.id])

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
