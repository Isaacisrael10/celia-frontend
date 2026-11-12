/*
  Envio da foto para a API de visão do Caio (Flask, rota /analisar).
  Só faz a chamada HTTP: não sabe nada de React nem de tela.

  Resposta esperada:
  { "resultado": "livre|obstaculo|buraco",
    "caixas": [{ "x1", "y1", "x2", "y2", "classe", "confianca" }] }
*/
import { VISAO_URL } from './config'

// Nome do campo do arquivo no formulário (PENDENTE: confirmar com o Caio)
const CAMPO_ARQUIVO = 'foto'

// Se a API demorar mais que isso, desistimos e usamos o plano B
const TEMPO_MAXIMO_MS = 20000

// Erro especial: a API não está rodando (versão publicada, sem o computador do Caio)
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
  return resposta.json()
}
