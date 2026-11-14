import BadgeFaixa from './BadgeFaixa'
import { faixaDoStatus, rotuloCompleto } from '../domain/faixas'
import { horaDaLeitura } from '../domain/poste'
import './HistoricoPoste.css'

/*
  Mini histórico: as últimas leituras do poste, da mais nova para a mais antiga.
  - historico: lista do useStatusPoste
  - quantas: quantas leituras mostrar
*/
export default function HistoricoPoste({ historico, quantas = 6 }) {
  const ultimas = historico.slice(-quantas).reverse()
  if (ultimas.length === 0) return null

  return (
    <section className="cartao" aria-labelledby="titulo-historico">
      <h3 id="titulo-historico" className="historico__titulo">
        Últimas leituras
      </h3>
      <ol className="historico">
        {ultimas.map((l) => {
          const faixa = faixaDoStatus(l.status)
          return (
            <li key={l.data} className="historico__item">
              <span className="historico__hora">{horaDaLeitura(l.data)}</span>
              <BadgeFaixa faixa={faixa} tamanho={28} />
              <span className="historico__faixa">{rotuloCompleto(faixa, l.motivo)}</span>
              <span className="historico__valores">
                {l.indiceCalor !== null && Math.round(l.indiceCalor) + ' °C'}
                {l.distancia !== null && ' · ' + Math.round(l.distancia) + ' cm'}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
