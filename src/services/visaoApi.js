/*
  Envio da foto para a API de visão da equipe (FastAPI, POST /analisar).
  Só faz a chamada HTTP: não sabe nada de React nem de tela.

  Resposta (INTEGRACAO.md seção 4):
  { "resultado": "livre" | "buraco",
    "caixas_buracos": [x1, y1, x2, y2, confianca] por buraco, em pixels,
    "largura", "altura" (tamanho da foto que a API analisou), "mqtt_enviado" }
*/
import { VISAO_URL } from './config'

// Nome do campo do arquivo no formulário
const CAMPO_ARQUIVO = 'foto'

// Se a API demorar mais que isso, desistimos e usamos o plano B
const TEMPO_MAXIMO_MS = 20000

// Erro especial: a API não está rodando (versão publicada, sem o computador da demonstração)
export class VisaoIndisponivel extends Error {}

export async function analisarFoto(arquivo) {
  const formulario = new FormData()
  formulario.append(CAMPO_ARQUIVO, arquivo)

  // AbortController cancela a chamada se passar do tempo máximo
  const controle = new AbortController()
  const timer = setTimeout(() => controle.abort(), TEMPO_MAXIMO_MS)

  let resposta
  try {
    resposta = await fetch(VISAO_URL, { method: 'POST', body: formulario, signal: controle.signal })
  } catch {
    // Sem resposta nenhuma: a API não está no ar (ou bloqueou por CORS)
    throw new VisaoIndisponivel()
  } finally {
    clearTimeout(timer)
  }

  if (!resposta.ok) {
    throw new VisaoIndisponivel()
  }
  const dados = await resposta.json()
  return { resultado: dados.resultado, caixas: converterCaixas(dados) }
}

/*
  Converte as caixas da API para o formato que a tela usa:
  { x1, y1, x2, y2, classe, confianca }, com as posições de 0 a 1 (fração da foto).
  Aceita cada caixa como lista [x1, y1, x2, y2, confianca] ou como objeto com esses nomes.
*/
function converterCaixas(dados) {
  const lista = Array.isArray(dados.caixas_buracos) ? dados.caixas_buracos : []
  const largura = dados.largura || 1
  const altura = dados.altura || 1

  return lista.map((c) => {
    const [x1, y1, x2, y2, confianca] = Array.isArray(c) ? c : [c.x1, c.y1, c.x2, c.y2, c.confianca]
    return {
      x1: x1 / largura,
      y1: y1 / altura,
      x2: x2 / largura,
      y2: y2 / altura,
      classe: 'buraco',
      confianca,
    }
  })
}
