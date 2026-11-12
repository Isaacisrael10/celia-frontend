import BadgeFaixa from './BadgeFaixa'
import { FAIXAS } from '../domain/faixas'
import './Legenda.css'

// O que cada faixa quer dizer, em poucas palavras
const SIGNIFICADO = {
  normal: 'pode passar',
  atencao: 'com cuidado',
  perigo: 'evite agora',
  semDados: 'não medido',
}

// Desenho do tipo de linha de cada faixa, igual ao do mapa
const TRACO = {
  normal: '',
  atencao: '14 6',
  perigo: '7 5',
  semDados: '0.1 9',
}

export default function Legenda() {
  return (
    <section aria-label="Legenda" className="legenda">
      {Object.values(FAIXAS).map((faixa) => (
        <div key={faixa.id} className="legenda__item">
          <svg width="48" height="10" aria-hidden="true">
            <line
              x1="4"
              y1="5"
              x2="44"
              y2="5"
              style={{ stroke: faixa.cor }}
              strokeWidth={faixa.id === 'semDados' ? 4 : 5}
              strokeDasharray={TRACO[faixa.id]}
              strokeLinecap={faixa.id === 'atencao' || faixa.id === 'perigo' ? 'butt' : 'round'}
            />
          </svg>
          <span className="legenda__nome">
            <BadgeFaixa faixa={faixa} tamanho={20} />
            {faixa.nome}
          </span>
          <span className="legenda__texto">{SIGNIFICADO[faixa.id]}</span>
        </div>
      ))}
    </section>
  )
}
