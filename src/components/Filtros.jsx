/*
  Filtro em pílulas (usado em Reportes e em Locais).
  A pílula escolhida fica azul com contorno escuro; aria-pressed avisa o leitor de tela.
  - rotulo: nome do grupo para o leitor de tela. Ex.: "Filtrar por situação"
  - opcoes: objeto { valor: 'Nome que aparece' }. Ex.: { todos: 'Todos', aberto: 'Abertos' }
  - valor: a opção escolhida agora
  - aoMudar(valor): chamado quando a pessoa escolhe outra
*/
export default function Filtros({ rotulo, opcoes, valor, aoMudar }) {
  return (
    <div className="filtros" role="group" aria-label={rotulo}>
      {Object.entries(opcoes).map(([opcao, nome]) => (
        <button key={opcao} className="pilula" aria-pressed={valor === opcao} onClick={() => aoMudar(opcao)}>
          {nome}
        </button>
      ))}
    </div>
  )
}
