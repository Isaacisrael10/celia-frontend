import { IconArrowRight, IconCheck, IconStarFilled } from '@tabler/icons-react'
import BadgeFaixa from './BadgeFaixa'
import { FAIXAS, rotuloCompleto } from '../domain/faixas'
import { trechoEmPerigo, textoDistancia } from '../domain/rotas'
import { nomeDoTrecho } from '../domain/trechos'
import './CardRota.css'

/*
  Card de uma rota na comparação.
  - rota: rota já analisada (analisarRota)
  - recomendada: true mostra a faixa "RECOMENDADA" e o botão principal
  - atual: true se é a rota que a pessoa escolheu
  - aoEscolher(id)
*/
export default function CardRota({ rota, recomendada, atual, aoEscolher }) {
  const perigo = trechoEmPerigo(rota)
  const { contagem } = rota

  // Ex.: "3 Normal · 1 Atenção · 0 Perigo" (+ "1 Sem dados" se houver)
  let resumo = `${contagem.normal} Normal · ${contagem.atencao} Atenção · ${contagem.perigo} Perigo`
  if (contagem.semDados > 0) resumo += ` · ${contagem.semDados} Sem dados`

  return (
    <article className={'card-rota' + (recomendada ? ' card-rota--recomendada' : '')} aria-label={rota.nome}>
      {recomendada && (
        <p className="card-rota__faixa">
          <IconStarFilled size={14} aria-hidden="true" /> Recomendada
        </p>
      )}

      <div className="card-rota__corpo">
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

        {/* Os trechos do caminho, em ordem */}
        <div className="card-rota__linha">
          <ol className="card-rota__trechos" aria-label="Trechos no caminho">
            {rota.trechosDaRota.map((t) => (
              <li key={t.id}>
                <BadgeFaixa faixa={t.faixa} tamanho={24} />
                <span className="so-leitor">
                  {nomeDoTrecho(t)}: {rotuloCompleto(t.faixa, t.motivo)}
                </span>
              </li>
            ))}
          </ol>
          <p className="card-rota__resumo">{resumo}</p>
        </div>

        {perigo && (
          <p className="card-rota__alerta">
            <BadgeFaixa faixa={FAIXAS.perigo} tamanho={20} />
            <span>
              <strong>Passa por Perigo:</strong> {perigo.rua}.
            </span>
          </p>
        )}

        {atual ? (
          <p className="card-rota__atual">
            Rota atual <IconCheck size={20} aria-hidden="true" />
          </p>
        ) : (
          <button
            className={'botao botao--pequeno botao--seta ' + (recomendada ? 'botao--primario' : 'botao--secundario')}
            onClick={() => aoEscolher(rota.id)}
          >
            Escolher esta rota
            <IconArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  )
}
