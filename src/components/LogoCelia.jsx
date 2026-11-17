/*
  Logo da C.E.L.I.A.: um "C" azul-marinho abraçando uma pessoa azul (cabeça e braços abertos).
  Redesenhada em SVG a partir da imagem original, com as mesmas proporções
  (medidas tiradas da imagem de 1043 × 1073 px). SVG fica nítido em qualquer tamanho
  e não tem fundo, então funciona em cima do vidro e no modo escuro.
  - tamanho: em px (a logo é quadrada)
  - rotulo: texto para o leitor de tela (sem ele, a logo é só decoração)
*/
export default function LogoCelia({ tamanho = 40, rotulo }) {
  return (
    <svg
      className="logo-celia"
      width={tamanho}
      height={tamanho}
      viewBox="48 48 926 926"
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      focusable="false"
    >
      {/* O "C": arco grosso, ponta de cima cortada e ponta de baixo arredondada */}
      <path
        fill="var(--logo-escuro)"
        d="M516.3 78.1 A435 435 0 1 0 804.2 808.7 A71.5 71.5 0 0 0 698.8 710.5 A291 291 0 1 1 455.6 222.6 Q458 128 516.3 78.1 Z"
      />
      {/* A pessoa: cabeça e braços abertos */}
      <circle cx="673" cy="223" r="149" fill="var(--logo-azul)" />
      <path
        d="M437 372 C527 540 819 540 909 372"
        fill="none"
        stroke="var(--logo-azul)"
        strokeWidth="114"
        strokeLinecap="round"
      />
    </svg>
  )
}
