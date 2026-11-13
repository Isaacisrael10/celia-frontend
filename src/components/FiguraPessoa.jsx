/*
  Figura da pessoa (inspirada no símbolo internacional de acessibilidade):
  cabeça, braços abertos e pernas dentro de um círculo, com as 5 "bolinhas"
  nas mãos e nos pés. Desenho próprio da C.E.L.I.A., em SVG.
  - tamanho: em px
  - rotulo: texto para o leitor de tela (sem ele, a figura é só decoração)
*/
export default function FiguraPessoa({ tamanho = 40, rotulo }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 48 48"
      className="figura-pessoa"
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : 'true'}
    >
      {/* Círculo de fundo */}
      <circle cx="24" cy="24" r="21" fill="var(--card)" stroke="var(--primary)" strokeWidth="2.5" />
      {/* Braços (curva) e pernas */}
      <path
        d="M10 20 Q24 28 38 20 M24 25 L15.5 37 M24 25 L32.5 37"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Cabeça */}
      <circle cx="24" cy="14" r="4.5" fill="var(--primary)" />
      {/* As 4 bolinhas das mãos e dos pés */}
      <circle cx="10" cy="20" r="3" fill="var(--primary)" />
      <circle cx="38" cy="20" r="3" fill="var(--primary)" />
      <circle cx="15.5" cy="37" r="3" fill="var(--primary)" />
      <circle cx="32.5" cy="37" r="3" fill="var(--primary)" />
    </svg>
  )
}
