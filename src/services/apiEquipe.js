/*
  Chamada HTTP para a API da equipe (FastAPI do João): trilha e assistente.
  Só faz o fetch: não sabe nada de React nem de tela. (A foto usa o visaoApi.js.)

  Dois tipos de erro, para a tela saber o que mostrar:
  - ApiIndisponivel: a API não respondeu (versão publicada, sem o computador da demonstração)
  - Error comum: a API respondeu com erro. A mensagem vem pronta, em português, no campo "detail"
*/
import { URL_API } from './config'

// O assistente pode levar uns 20 s por modelo, e a API tenta até 3 modelos do Gemini
// (principal, reserva e Flash-Lite): por isso esperamos até 65 s
const TEMPO_MAXIMO_MS = 65000

export const TEXTO_API_LOCAL = 'A IA da equipe roda na demonstração local. Veja o vídeo no README.'

export class ApiIndisponivel extends Error {
  constructor() {
    super(TEXTO_API_LOCAL)
  }
}

// Mensagem para quando a API não mandou o "detail" (tabela do passo 9 do contrato)
function mensagemDoCodigo(codigo) {
  if (codigo === 404) return 'Não encontramos o que você pediu.'
  if (codigo === 413) return 'Pedido grande demais para a IA.'
  if (codigo === 429) return 'Muitas perguntas seguidas. Espere um minuto e tente de novo.'
  if (codigo === 503) return 'O assistente está indisponível agora. Tente de novo daqui a pouco.'
  return 'Não deu certo agora. Tente de novo.'
}

/*
  Chama a API e devolve o JSON.
  Ex.: await chamarApi('/trilha')
*/
export async function chamarApi(caminho, opcoes = {}) {
  // AbortController cancela a chamada se passar do tempo máximo
  const controle = new AbortController()
  const timer = setTimeout(() => controle.abort(), TEMPO_MAXIMO_MS)

  let resposta
  try {
    resposta = await fetch(URL_API + caminho, { ...opcoes, signal: controle.signal })
  } catch {
    // Sem resposta nenhuma: a API não está no ar (ou bloqueou por CORS)
    throw new ApiIndisponivel()
  } finally {
    clearTimeout(timer)
  }

  let dados = null
  try {
    dados = await resposta.json()
  } catch {
    dados = null
  }

  if (!resposta.ok) {
    const temDetalhe = dados && typeof dados.detail === 'string'
    const erro = new Error(temDetalhe ? dados.detail : mensagemDoCodigo(resposta.status))
    erro.codigo = resposta.status // ex.: 503 → o useChamadaApi tenta de novo sozinho
    throw erro
  }
  return dados
}

// Atalho para mandar JSON com POST
export function enviarJson(caminho, corpo) {
  return chamarApi(caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
}
