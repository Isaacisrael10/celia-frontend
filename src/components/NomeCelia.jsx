/*
  O nome C.E.L.I.A. com "I.A." no azul da marca (#49c8f5, token --cor-ia)
  e "C.E.L." na cor do texto em volta.
  O leitor de tela continua lendo o nome inteiro: são só dois pedaços do mesmo texto.
*/
export default function NomeCelia() {
  return (
    <span className="nome-celia">
      C.E.L.<span className="nome-celia__ia">I.A.</span>
    </span>
  )
}
