/*
  Mini trilha de IA [HU-19, RF18]: as lições ficam na API da equipe (GET /trilha).
  Só faz a chamada HTTP: não sabe nada de React nem de tela.

  Resposta:
  { "titulo", "observacao",
    "licoes": [{ "id", "titulo", "duracao_minutos", "paragrafos", "exemplo_no_trabalho", "pratique" }] }
*/
import { TRILHA_URL, apiAoAlcance } from './config'

// Se a API demorar mais que isso, o app usa a cópia das lições que vem junto com ele
const TEMPO_MAXIMO_MS = 6000

export async function buscarTrilha() {
  if (!apiAoAlcance(TRILHA_URL)) {
    throw new Error('A API da trilha só roda na demonstração local.')
  }

  // AbortController cancela a chamada se passar do tempo máximo
  const controle = new AbortController()
  const timer = setTimeout(() => controle.abort(), TEMPO_MAXIMO_MS)

  try {
    const resposta = await fetch(TRILHA_URL, { signal: controle.signal })
    if (!resposta.ok) {
      throw new Error('A API da trilha não respondeu.')
    }
    return await resposta.json()
  } finally {
    clearTimeout(timer)
  }
}
