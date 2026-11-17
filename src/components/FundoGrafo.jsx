import './FundoGrafo.css'

/*
  Fundo de todas as telas (fica no layout comum, em App.jsx).
  Duas manchas de luz azul, bem desfocadas, que flutuam devagar:
  - em cima, à direita: azul do símbolo (#49C8F5) com um toque do azul dos links (#0A72A8)
  - embaixo, à esquerda: azul do símbolo com um toque do cinza-azulado do texto secundário (#4A5878)
  Feito em CSS puro (o exemplo original era em Tailwind; o projeto não usa Tailwind).
  É só enfeite: fica escondido do leitor de tela, para de mexer com "menos movimento"
  e some no modo "Mais contraste".
*/
export default function FundoGrafo() {
  return (
    <div className="fundo-celia" aria-hidden="true">
      <div className="fundo-celia__mancha fundo-celia__mancha--topo" />
      <div className="fundo-celia__mancha fundo-celia__mancha--base" />
    </div>
  )
}
