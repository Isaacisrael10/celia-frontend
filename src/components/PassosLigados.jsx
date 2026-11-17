import './PassosLigados.css'

/*
  Uma sequência de passos desenhada como um grafo em linha:
  cada passo é uma bolinha numerada e uma linha liga uma à outra.
  Em pé no celular, deitada em telas largas.
  - passos: lista de { titulo, texto }, na ordem em que acontecem
*/
export default function PassosLigados({ passos }) {
  return (
    <ol className="passos">
      {passos.map((passo, i) => (
        <li key={passo.titulo} className="passos__item">
          <span className="passos__numero" aria-hidden="true">
            {i + 1}
          </span>
          <div className="passos__textos">
            <h3 className="passos__titulo">{passo.titulo}</h3>
            <p>{passo.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
