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
          <IconStarFilled size={16} aria-hidden="true" /> Recomendada
        </p>
      )}

      <div className="card-rota__corpo">
        <h3 className="card-rota__nome">{rota.nome}</h3>

        <p className="card-rota__tempo">
          <span className="card-rota__minutos">{rota.minutos}</span> min
        </p>
        <p className="card-rota__distancia">
          {textoDistancia(rota.km)} · pior trecho: {rotuloCompleto(rota.pior.faixa, rota.pior.motivo)}
        </p>

        <div>
          <p className="card-rota__rotulo">Trechos no caminho</p>
          <ol className="card-rota__trechos">
            {rota.trechosDaRota.map((t) => (
              <li key={t.id}>
                <BadgeFaixa faixa={t.faixa} tamanho={32} />
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
            <BadgeFaixa faixa={FAIXAS.perigo} tamanho={28} />
            <span>
              <strong>Passa por trecho em Perigo.</strong> {perigo.rua} ({rotuloCompleto(perigo.faixa, perigo.motivo)}).
            </span>
          </p>
        )}

        {atual ? (
          <p className="card-rota__atual">
            Rota atual <IconCheck size={22} aria-hidden="true" />
          </p>
        ) : (
          <button
            className={'botao botao--seta ' + (recomendada ? 'botao--primario' : 'botao--secundario')}
            onClick={() => aoEscolher(rota.id)}
          >
            Escolher esta rota
            <IconArrowRight size={24} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  )
}
