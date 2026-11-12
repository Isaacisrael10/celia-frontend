import './BadgeFaixa.css'

/*
  Marcador de faixa: quadrado colorido com o ícone (✓ ! ✕ ?).
  Nunca usamos só a cor: o nome da faixa sempre aparece escrito
  (aqui com comNome, ou no texto ao lado do marcador).
  O quadrado é escondido do leitor de tela, para o nome não ser lido duas vezes.
  - faixa: um objeto de FAIXAS (src/domain/faixas.js)
  - tamanho: 28, 32, 36, 40 ou 56 (px)
  - comNome: true escreve o nome ao lado ("Perigo")
*/
export default function BadgeFaixa({ faixa, tamanho = 32, comNome = false }) {
  const semDados = faixa.id === 'semDados'

  return (
    <span className="badge-faixa">
      <span
        className={'badge-faixa__marcador' + (semDados ? ' badge-faixa__marcador--sem-dados' : '')}
        style={{
          width: tamanho,
          height: tamanho,
          fontSize: tamanho * 0.55,
          '--cor-faixa': faixa.cor,
        }}
        aria-hidden="true"
      >
        {faixa.icone}
      </span>
      {comNome && <span className="badge-faixa__nome">{faixa.nome}</span>}
    </span>
  )
}
