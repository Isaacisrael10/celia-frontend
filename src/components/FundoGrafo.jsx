import './FundoGrafo.css'

// As 5 bolinhas do símbolo (cabeça, mãos e pés): [x, y, raio do brilho], no desenho de 420 × 420
const BOLINHAS = [
  [210, 108, 150],
  [15, 148, 115],
  [405, 148, 115],
  [100, 376, 125],
  [320, 376, 125],
]

/*
  Fundo decorativo das telas: o próprio símbolo de acessibilidade, bem grande e bem suave.
  As bolinhas viram manchas de luz azul e as linhas ficam quase invisíveis.
  É o que aparece desfocado atrás das peças de vidro.
  É só enfeite: fica escondido do leitor de tela e some no modo "Mais contraste".
*/
export default function FundoGrafo() {
  return (
    <svg
      className="fundo-grafo"
      viewBox="0 0 420 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="fundo-grafo-brilho">
          <stop offset="0" className="fundo-grafo__centro" />
          <stop offset="1" className="fundo-grafo__borda" />
        </radialGradient>
      </defs>

      {BOLINHAS.map(([x, y, raio]) => (
        <circle key={x + '-' + y} cx={x} cy={y} r={raio} fill="url(#fundo-grafo-brilho)" />
      ))}

      {/* Círculo, braços e pernas do símbolo */}
      <g className="fundo-grafo__tracos">
        <circle cx="210" cy="210" r="196" />
        <path d="M15 148 Q210 278 405 148 M210 213 L100 376 M210 213 L320 376" />
      </g>
    </svg>
  )
}
