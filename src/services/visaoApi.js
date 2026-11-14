/*
  Envio da foto para a API de visão da equipe (FastAPI, rota /analisar) [HU-05, RF08].
  Só faz a chamada HTTP: não sabe nada de React nem de tela.

  Resposta (contrato da equipe, INTEGRACAO.md seção 4):
  { "resultado": "livre|buraco",
    "caixas_buracos": [{ "x1", "y1", "x2", "y2", "confianca" }],
    "largura", "altura" }
  A foto é analisada em memória e não fica guardada na API (RNF01).
*/
import { VISAO_URL, apiAoAlcance } from './config'

// Nome do campo do arquivo no formulário (combinado com a API)
const CAMPO_ARQUIVO = 'foto'

// Se a API demorar mais que isso, desistimos e usamos o plano B
const TEMPO_MAXIMO_MS = 20000

// Erro especial: a API não está rodando (versão publicada, sem o computador da demonstração)
export class VisaoIndisponivel extends Error {}

export async function analisarFoto(arquivo) {
  // App publicado e API em "localhost": nem tenta, vai direto para o plano B
  if (!apiAoAlcance(VISAO_URL)) {
    throw new VisaoIndisponivel()
  }

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
  return resposta.json()
}
