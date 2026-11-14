import './Opcoes.css'

/*
  Escolha de UMA opção entre poucas, em pílulas (usado nos ajustes do Perfil).
  Por baixo são botões de rádio de verdade: funcionam com as setas do teclado
  e o leitor de tela anuncia "1 de 3". O rádio fica escondido e a pílula é o desenho dele.
  - nome: nome do grupo de rádios (precisa ser diferente em cada grupo da tela)
  - opcoes: lista de { valor, rotulo }. Ex.: [{ valor: 32, rotulo: '32 °C' }]
  - valor: a opção escolhida agora
  - aoMudar(valor): chamado quando a pessoa escolhe outra
*/
export default function Opcoes({ nome, opcoes, valor, aoMudar }) {
  return (
    <div className="opcoes">
      {opcoes.map((opcao) => (
        <label key={opcao.valor} className="opcao">
          <input
            type="radio"
            name={nome}
            value={opcao.valor}
            checked={valor === opcao.valor}
            onChange={() => aoMudar(opcao.valor)}
          />
          <span>{opcao.rotulo}</span>
        </label>
      ))}
    </div>
  )
}
