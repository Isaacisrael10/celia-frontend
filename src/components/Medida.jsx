import './Medida.css'

/*
  Uma medida do poste num card pequeno: ícone e nome em cima, valor grande embaixo.
  - Icone: ícone do Tabler
  - nome: o que foi medido ("Temperatura")
  - texto: o valor já com a unidade ("32 °C")
  - detalhe: (opcional) o que o valor quer dizer. Ex.: "Calçada estreita", "Calor: Atenção"
*/
export default function Medida({ Icone, nome, texto, detalhe }) {
  return (
    <div className="medida cartao">
      <span className="medida__nome">
        <Icone size={20} aria-hidden="true" />
        {nome}
      </span>
      <span className="medida__valor">{texto}</span>
      {detalhe && <span className="medida__detalhe">{detalhe}</span>}
    </div>
  )
}
