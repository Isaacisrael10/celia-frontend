import BadgeFaixa from './BadgeFaixa'
import { FAIXAS } from '../domain/faixas'
import './Legenda.css'

// Desenho do tipo de linha de cada faixa, igual ao do mapa
const TRACO = {
  normal: '',
  atencao: '7 3',
  perigo: '3.5 2.5',
  semDados: '0.1 4.5',
}

/*
  Legenda em "pílulas": tipo de linha do mapa + marcador (✓ ! ✕ ?) + nome.
  Nunca depende só da cor.
*/
export default function Legenda() {
  return (
    <ul aria-label="Legenda" className="legenda">
      {Object.values(FAIXAS).map((faixa) => (
        <li key={faixa.id} className="legenda__item">
          <svg width="22" height="8" aria-hidden="true">
            <line
              x1="2"
              y1="4"
              x2="20"
              y2="4"
              style={{ stroke: faixa.cor }}
              strokeWidth="3.5"
              strokeDasharray={TRACO[faixa.id]}
              strokeLinecap={faixa.id === 'atencao' || faixa.id === 'perigo' ? 'butt' : 'round'}
            />
          </svg>
          <BadgeFaixa faixa={faixa} tamanho={18} />
          <span className="legenda__nome">{faixa.nome}</span>
        </li>
      ))}
    </ul>
  )
}
