import { useState } from 'react'
import { IconInfoCircle, IconX } from '@tabler/icons-react'
import { creditoDoMapa } from '../styles/mapa/estilos'
import './CreditoMapa.css'

/*
  Crédito obrigatório do mapa (OpenFreeMap / OpenStreetMap e, no satélite, Esri).
  No celular e no tablet ele fica recolhido num botão "i" para não tampar o mapa,
  do mesmo jeito que o MapLibre faz em telas pequenas; um toque abre o texto completo.
  No computador sobra espaço: o texto aparece sempre e o botão some (só CSS).
  - satelite: true se a foto de satélite está ligada (o crédito muda)
*/
export default function CreditoMapa({ satelite }) {
  // Interação: abrir e fechar o crédito
  const [aberto, setAberto] = useState(false)

  return (
    <div className={'credito-mapa' + (aberto ? ' credito-mapa--aberto' : '')}>
      <p className="credito-mapa__texto" id="credito-mapa">
        {creditoDoMapa(satelite)}
      </p>
      <button
        className="botao-icone credito-mapa__botao"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-controls="credito-mapa"
        aria-label={aberto ? 'Fechar créditos do mapa' : 'Créditos do mapa'}
      >
        {aberto ? <IconX size={18} aria-hidden="true" /> : <IconInfoCircle size={20} aria-hidden="true" />}
      </button>
    </div>
  )
}
