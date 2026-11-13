/*
  Símbolo internacional de acessibilidade, redesenhado em SVG
  com as mesmas proporções e cores da imagem original:
  traço preto, bolinhas em azul (#49C8F5) e o círculo aberto
  onde ficam as mãos e os pés. No modo escuro, o fundo vira azul-noite e o traço fica claro.
  - tamanho: em px
  - rotulo: texto para o leitor de tela (sem ele, a figura é só decoração)
*/

const AZUL = '#49C8F5'
// Fundo e traço vêm do tema: original no claro, versão para fundo escuro no escuro
const FUNDO = 'var(--simbolo-fundo)'
const TRACO = 'var(--simbolo-traco)'

// Mãos e pés: posição de cada bolinha (no desenho de 420 × 420)
const BOLINHAS = [
  [15, 148], // mão esquerda
  [405, 148], // mão direita
  [100, 376], // pé esquerdo
  [320, 376], // pé direito
]

export default function FiguraPessoa({ tamanho = 30, rotulo }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="-20 -20 460 460"
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : 'true'}
    >
      {/* Círculo: fundo e contorno */}
      <circle cx="210" cy="210" r="196" fill={FUNDO} stroke={TRACO} strokeWidth="16" />

      {/* Braços (curva) e pernas */}
      <path
        d="M15 148 Q210 278 405 148 M210 213 L100 376 M210 213 L320 376"
        fill="none"
        stroke={TRACO}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Cabeça */}
      <circle cx="210" cy="108" r="50" fill={AZUL} stroke={TRACO} strokeWidth="14" />

      {/* Mãos e pés: a borda da cor do fundo "abre" o círculo em volta de cada bolinha */}
      {BOLINHAS.map(([x, y]) => (
        <g key={x + '-' + y}>
          <circle cx={x} cy={y} r="40" fill={FUNDO} />
          <circle cx={x} cy={y} r="26" fill={AZUL} stroke={TRACO} strokeWidth="12" />
        </g>
      ))}
    </svg>
  )
}
