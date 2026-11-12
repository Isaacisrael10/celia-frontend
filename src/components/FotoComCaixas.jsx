import { useState } from 'react'
import { caixaEmPorcentagem, rotuloDaCaixa } from '../domain/visao'
import './FotoComCaixas.css'

/*
  Mostra a foto com as caixas que a IA encontrou desenhadas por cima.
  - src: endereço da foto
  - caixas: lista de { x1, y1, x2, y2, classe, confianca }
*/
export default function FotoComCaixas({ src, caixas = [] }) {
  // Tamanho real da foto (precisamos dele para converter pixels em porcentagem)
  const [tamanho, setTamanho] = useState(null)

  function aoCarregar(evento) {
    setTamanho({ largura: evento.target.naturalWidth, altura: evento.target.naturalHeight })
  }

  const descricao =
    caixas.length === 0
      ? 'Foto da calçada.'
      : 'Foto da calçada. A IA marcou: ' + caixas.map(rotuloDaCaixa).join(', ') + '.'

  return (
    <figure className="foto-caixas">
      <img src={src} alt={descricao} onLoad={aoCarregar} />
      {tamanho &&
        caixas.map((caixa, i) => {
          const pos = caixaEmPorcentagem(caixa, tamanho.largura, tamanho.altura)
          return (
            <div
              key={i}
              className="foto-caixas__caixa"
              style={{ left: pos.left + '%', top: pos.top + '%', width: pos.width + '%', height: pos.height + '%' }}
              aria-hidden="true"
            >
              <span className="foto-caixas__rotulo">{rotuloDaCaixa(caixa)}</span>
            </div>
          )
        })}
    </figure>
  )
}
