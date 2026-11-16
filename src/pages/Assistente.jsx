import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconSend, IconInfoSquare } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import { useRotas } from '../hooks/useRotas'
import { useChamadaApi, MAX_TENTATIVAS } from '../hooks/useChamadaApi'
import { CardCarregando, MensagemErro } from '../components/Estados'
import { perguntarTrajeto } from '../services/assistenteApi'
import { montarContexto, idsParaOAssistente, PERGUNTAS_PRONTAS } from '../domain/assistente'
import { nomeDoTrecho } from '../domain/trechos'
import dadosLocais from '../data/locais.json'
import './Assistente.css'

/*
  Assistente do trajeto (HU-21).
  A pessoa pergunta; o app manda a pergunta + a situação dos trechos e a lista de locais
  para a API da equipe, que responde só com esses dados (RN06).
*/
export default function Assistente() {
  const { rotas, escolhida, trechos } = useRotas()
  const { executar, carregando, erro, indisponivel, tentativa, aviso } = useChamadaApi()
  // Guarda a última pergunta para o botão "Tentar de novo"
  const ultimaPergunta = useRef('')
  const [pergunta, setPergunta] = useState('')
  // Interação Web Dev: as perguntas e respostas da conversa (some ao sair da tela, nada é guardado)
  const [conversa, setConversa] = useState([])

  // repetir = true quando vem do "Tentar de novo": a pergunta já está na conversa
  async function perguntar(texto, repetir = false) {
    const limpa = texto.trim()
    if (!limpa || carregando) return
    ultimaPergunta.current = limpa

    // A pergunta vira balão na hora e o campo fica limpo, sem esperar a resposta da IA
    if (!repetir) {
      setConversa((atual) => [...atual, { pergunta: limpa, resposta: null, trechos: [], locais: [] }])
      setPergunta('')
    }

    const contexto = montarContexto(trechos, idsParaOAssistente(rotas, escolhida), dadosLocais.locais)
    const r = await executar(() => perguntarTrajeto(limpa, contexto))
    if (!r) return

    // A resposta entra no último balão (o da pergunta que acabou de ser feita)
    setConversa((atual) =>
      atual.map((item, i) =>
        i === atual.length - 1
          ? {
              ...item,
              resposta: r.resposta,
              // Ids citados pela IA viram links para o trecho e para os locais
              trechos: trechos.filter((t) => (r.trechos_citados || []).includes(t.id)),
              locais: dadosLocais.locais.filter((l) => (r.locais_citados || []).includes(l.id)),
            }
          : item,
      ),
    )
  }

  function enviar(evento) {
    evento.preventDefault()
    perguntar(pergunta)
  }

  return (
    <>
      <Cabecalho titulo="Assistente" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo">
        <p className="assistente__intro">
          Pergunte sobre {escolhida ? 'o seu caminho de sempre (' + escolhida.nome + ')' : 'os caminhos até o trabalho'}.
          A resposta usa só os trechos e os locais do app.
        </p>

        {/* Conversa: o leitor de tela lê cada resposta nova sozinho */}
        <ol className="assistente__conversa" aria-live="polite">
          {conversa.map((item, i) => (
            <li key={i} className="assistente__troca">
              <p className="assistente__pergunta">
                <span className="so-leitor">Você perguntou: </span>
                {item.pergunta}
              </p>
              {/* Pergunta antiga que ficou sem resposta (a IA falhou e a pessoa perguntou outra coisa) */}
              {item.resposta === null && i < conversa.length - 1 && (
                <p className="assistente__sem-resposta">Sem resposta para esta pergunta.</p>
              )}
              {item.resposta !== null && (
                <div className="assistente__resposta">
                  <p>
                    <span className="so-leitor">Resposta: </span>
                    {item.resposta}
                  </p>
                  {(item.trechos.length > 0 || item.locais.length > 0) && (
                    <ul className="assistente__citados" aria-label="Citados na resposta">
                      {item.trechos.map((t) => (
                        <li key={t.id}>
                          <Link to={'/trecho/' + t.id} className="acao-texto">
                            {nomeDoTrecho(t)}
                          </Link>
                        </li>
                      ))}
                      {item.locais.map((l) => (
                        <li key={l.id}>
                          <Link to="/locais" className="acao-texto">
                            {l.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Espera: se o Gemini falhar (5xx), o card mostra o motivo e a nova tentativa */}
        {carregando && (
          <CardCarregando
            titulo="Pensando…"
            texto={
              tentativa > 0
                ? `${aviso} Tentando de novo sozinho (${tentativa} de ${MAX_TENTATIVAS})…`
                : 'Pode levar uns 20 segundos.'
            }
          />
        )}

        {/* Plano B: a API não está no ar. Nunca mostra erro cru. */}
        {erro && indisponivel && (
          <p className="assistente__erro" role="alert">
            <IconInfoSquare size={22} aria-hidden="true" />
            O assistente roda na demonstração local. Veja o vídeo no README.
          </p>
        )}

        {/* A API respondeu com erro (ex.: Gemini fora mesmo depois das 3 tentativas) */}
        {erro && !indisponivel && (
          <MensagemErro mensagem={erro} aoTentarDeNovo={() => perguntar(ultimaPergunta.current, true)} />
        )}

        {conversa.length === 0 && !carregando && (
          <div className="assistente__prontas">
            <p className="assistente__rotulo">Para começar</p>
            {PERGUNTAS_PRONTAS.map((texto) => (
              <button key={texto} className="assistente__pronta" onClick={() => perguntar(texto)}>
                {texto}
              </button>
            ))}
          </div>
        )}

        <form className="assistente__form" onSubmit={enviar}>
          <label className="so-leitor" htmlFor="campo-pergunta">
            Sua pergunta
          </label>
          <input
            id="campo-pergunta"
            className="campo__entrada assistente__campo"
            placeholder="Escreva sua pergunta"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            maxLength={300}
            autoComplete="off"
          />
          <button
            type="submit"
            className="botao botao--primario assistente__enviar"
            disabled={carregando || !pergunta.trim()}
            aria-label="Perguntar"
          >
            <IconSend size={22} aria-hidden="true" />
          </button>
        </form>

        <p className="assistente__aviso">
          Respostas feitas por IA, a partir de dados simulados de exemplo. Confira o mapa antes de sair. Nada da conversa
          fica guardado.
        </p>
      </main>
    </>
  )
}
