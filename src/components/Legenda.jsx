import { useState } from 'react'
import { IconListDetails, IconChevronDown } from '@tabler/icons-react'
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
  Legenda do mapa: um botão "Legenda" em cima do mapa que abre um painel
  com as 4 faixas (tipo de linha + marcador ✓ ! ✕ ? + nome).
  Fechada, o mapa fica limpo; aberta, explica as cores sem depender só delas.
*/
export default function Legenda() {
  // Interação: abrir e fechar a legenda
  const [aberta, setAberta] = useState(false)

  return (
    <div className="legenda">
      {aberta && (
        <div className="legenda__painel" id="painel-legenda">
          <ul aria-label="Legenda do mapa" className="legenda__lista">
            {Object.values(FAIXAS).map((faixa) => (
              <li key={faixa.id} className="legenda__item">
                <svg width="24" height="8" aria-hidden="true">
                  <line
                    x1="2"
                    y1="4"
                    x2="22"
                    y2="4"
                    style={{ stroke: faixa.cor }}
                    strokeWidth="3.5"
                    strokeDasharray={TRACO[faixa.id]}
                    strokeLinecap={faixa.id === 'atencao' || faixa.id === 'perigo' ? 'butt' : 'round'}
                  />
                </svg>
                <BadgeFaixa faixa={faixa} tamanho={18} />
                <span>{faixa.nome}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="legenda__botao"
        onClick={() => setAberta(!aberta)}
        aria-expanded={aberta}
        aria-controls="painel-legenda"
      >
        {aberta ? <IconChevronDown size={18} aria-hidden="true" /> : <IconListDetails size={18} aria-hidden="true" />}
        {aberta ? 'Esconder legenda' : 'Legenda'}
      </button>
    </div>
  )
}
