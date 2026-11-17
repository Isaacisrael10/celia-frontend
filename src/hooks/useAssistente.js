import { useRef, useState } from 'react'
import { useRotas } from './useRotas'
import { useChamadaApi } from './useChamadaApi'
import { perguntarTrajeto } from '../services/assistenteApi'
import { montarContexto, idsParaOAssistente } from '../domain/assistente'
import dadosLocais from '../data/locais.json'

/*
  Custom hook da tela Assistente (HU-21): guarda a conversa e faz as perguntas à API.
  A tela só desenha; quem monta o contexto, chama o serviço e preenche a resposta é este hook.
  - conversa: lista de { pergunta, resposta, trechos, locais } (resposta null = ainda sem resposta)
  - pergunta / mudarPergunta(texto): o texto do campo
  - perguntar(texto): manda uma pergunta (o campo limpa na hora)
  - tentarDeNovo(): repete a última pergunta, depois de um erro
  - escolhida: o caminho de sempre (ou null), para a frase de abertura
  - carregando, erro, indisponivel, tentativa, aviso: vêm de useChamadaApi
  Ex.: const { conversa, perguntar } = useAssistente()
*/
export function useAssistente() {
  const { rotas, escolhida, trechos } = useRotas()
  const chamada = useChamadaApi()
  // Guarda a última pergunta para o botão "Tentar de novo"
  const ultimaPergunta = useRef('')
  const [pergunta, setPergunta] = useState('')
  // Interação Web Dev: as perguntas e respostas da conversa (some ao sair da tela, nada é guardado)
  const [conversa, setConversa] = useState([])

  // repetir = true quando vem do "Tentar de novo": a pergunta já está na conversa
  async function perguntar(texto, repetir = false) {
    const limpa = texto.trim()
    if (!limpa || chamada.carregando) return
    ultimaPergunta.current = limpa

    // A pergunta vira balão na hora e o campo fica limpo, sem esperar a resposta da IA
    if (!repetir) {
      setConversa((atual) => [...atual, { pergunta: limpa, resposta: null, trechos: [], locais: [] }])
      setPergunta('')
    }

    // RN06: a IA só pode usar os trechos e locais que o app manda
    const contexto = montarContexto(trechos, idsParaOAssistente(rotas, escolhida), dadosLocais.locais)
    const r = await chamada.executar(() => perguntarTrajeto(limpa, contexto))
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

  function tentarDeNovo() {
    perguntar(ultimaPergunta.current, true)
  }

  return {
    conversa,
    pergunta,
    mudarPergunta: setPergunta,
    perguntar,
    tentarDeNovo,
    escolhida,
    carregando: chamada.carregando,
    erro: chamada.erro,
    indisponivel: chamada.indisponivel,
    tentativa: chamada.tentativa,
    aviso: chamada.aviso,
  }
}
