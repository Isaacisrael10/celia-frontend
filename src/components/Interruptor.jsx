import './Interruptor.css'

/*
  Interruptor liga/desliga (role="switch"), com o texto "Ligado/Desligado"
  escrito ao lado para não depender só da posição do botão.
  - Icone: ícone do Tabler mostrado à esquerda
  - rotulo: o que ele liga ("Modo escuro")
  - ligado: true ou false
  - aoAlternar: função chamada no clique
*/
export default function Interruptor({ Icone, rotulo, ligado, aoAlternar }) {
  return (
    <button className="interruptor" role="switch" aria-checked={ligado} onClick={aoAlternar}>
      {Icone && <Icone size={24} aria-hidden="true" />}
      <span className="interruptor__rotulo">{rotulo}</span>
      <span className="interruptor__estado">{ligado ? 'Ligado' : 'Desligado'}</span>
      <span className={'interruptor__trilho' + (ligado ? ' interruptor__trilho--ligado' : '')} aria-hidden="true">
        <span className="interruptor__botao" />
      </span>
    </button>
  )
}
