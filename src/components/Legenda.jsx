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
          <svg width="56" height="12" aria-hidden="true">
            <line
              x1="5"
              y1="6"
              x2="51"
              y2="6"
              style={{ stroke: faixa.cor }}
              strokeWidth={faixa.id === 'semDados' ? 5 : 6}
              strokeDasharray={TRACO[faixa.id]}
              strokeLinecap={faixa.id === 'atencao' || faixa.id === 'perigo' ? 'butt' : 'round'}
            />
          </svg>
          <BadgeFaixa faixa={faixa} tamanho={28} />
          <span className="legenda__nome">{faixa.nome}</span>
          <span className="legenda__texto">{SIGNIFICADO[faixa.id]}</span>
        </div>
      ))}
    </section>
  )
}
