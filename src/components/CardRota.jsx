import { IconArrowRight, IconCheck, IconStarFilled } from '@tabler/icons-react'
import BadgeFaixa from './BadgeFaixa'
import { FAIXAS, rotuloCompleto } from '../domain/faixas'
import { trechoEmPerigo, textoDistancia } from '../domain/rotas'
import { nomeDoTrecho } from '../domain/trechos'
import './CardRota.css'

/*
  Card de uma rota na comparação.
  A rota é desenhada como um grafo em linha: cada trecho é uma bolinha (com a faixa dele)
  e as bolinhas são ligadas na ordem em que a pessoa passa por elas.
  - rota: rota já analisada (analisarRota)
  - recomendada: true mostra o selo "Recomendada" e o botão principal
  - atual: true se é o caminho de sempre da pessoa
  - aoEscolher(id)
*/
export default function CardRota({ rota, recomendada, atual, aoEscolher }) {
  const perigo = trechoEmPerigo(rota)
  const { contagem } = rota

  // Ex.: "3 Acessível · 1 Atenção · 0 Evite" (+ "1 Sem dados" se houver)
  let resumo = `${contagem.normal} ${FAIXAS.normal.nome} · ${contagem.atencao} ${FAIXAS.atencao.nome} · ${contagem.perigo} ${FAIXAS.perigo.nome}`
  if (contagem.semDados > 0) resumo += ` · ${contagem.semDados} Sem dados`

  return (
    <article className={'card-rota cartao' + (recomendada ? ' card-rota--recomendada' : '')} aria-label={rota.nome}>
      {recomendada && (
        <p className="card-rota__selo">
          <IconStarFilled size={16} aria-hidden="true" /> Recomendada
        </p>
      )}

      {/* Topo: nome e pior trecho à esquerda, tempo à direita */}
      <div className="card-rota__topo">
        <div>
          <h3 className="card-rota__nome">{rota.nome}</h3>
          <p className="card-rota__pior">Pior trecho: {rotuloCompleto(rota.pior.faixa, rota.pior.motivo)}</p>
        </div>
        <p className="card-rota__tempo">
          <span className="card-rota__minutos">{rota.minutos} min</span>
          <span className="card-rota__km">{textoDistancia(rota.km)}</span>
        </p>
      </div>

      {/* Os trechos do caminho, em ordem, ligados por uma linha (da saída até a chegada) */}
      <div className="card-rota__caminho">
        <ol className="card-rota__trechos" aria-label="Trechos no caminho">
          {rota.trechosDaRota.map((t) => (
            <li key={t.id} className="card-rota__trecho">
              <BadgeFaixa faixa={t.faixa} tamanho={28} />
              <span className="so-leitor">
                {nomeDoTrecho(t)}: {rotuloCompleto(t.faixa, t.motivo)}
              </span>
            </li>
          ))}
          {/* A chegada: bolinha azul no fim da linha (só desenho) */}
          <li className="card-rota__trecho" aria-hidden="true">
            <span className="card-rota__chegada" />
          </li>
        </ol>
        <p className="card-rota__resumo">{resumo}</p>
      </div>

      {perigo && (
        <p className="card-rota__alerta">
          <BadgeFaixa faixa={FAIXAS.perigo} tamanho={24} />
          <span>
            <strong>Passa por trecho para evitar:</strong> {perigo.rua}.
          </span>
        </p>
      )}

      {atual ? (
        <p className="card-rota__atual">
          <IconCheck size={20} aria-hidden="true" /> Seu caminho de sempre
        </p>
      ) : (
        <button
          className={'botao botao--pequeno botao--seta ' + (recomendada ? 'botao--primario' : 'botao--secundario')}
          onClick={() => aoEscolher(rota.id)}
        >
          Usar como caminho de sempre
          <IconArrowRight size={20} aria-hidden="true" />
        </button>
      )}
    </article>
  )
}
