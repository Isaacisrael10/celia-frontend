import './BadgeFaixa.css'

/*
  Marcador de faixa: quadrado colorido com o ícone (✓ ! ✕ ?).
  Nunca usamos só a cor: o leitor de tela lê o nome da faixa.
  - faixa: um objeto de FAIXAS (src/domain/faixas.js)
  - tamanho: 28, 32, 36, 40 ou 56 (px)
  - comNome: true escreve o nome ao lado ("Perigo")
  - rotulo: texto que substitui o nome (ex.: "Perigo · calor")
*/
export default function BadgeFaixa({ faixa, tamanho = 32, comNome = false, rotulo }) {
  const texto = rotulo || faixa.nome
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
      {comNome ? (
        <span className="badge-faixa__nome">{texto}</span>
      ) : (
        <span className="so-leitor">{texto}</span>
      )}
    </span>
  )
}
