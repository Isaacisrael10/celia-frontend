/*
  Envio da foto para a API de visão da equipe (FastAPI, rota /analisar) [HU-05, RF08].
  Só faz a chamada HTTP: não sabe nada de React nem de tela.

  Resposta (contrato da equipe, INTEGRACAO.md seção 4):
  { "resultado": "livre|buraco",
    "caixas_buracos": [{ "x1", "y1", "x2", "y2", "confianca" }],
    "largura", "altura" }
  A foto é analisada em memória e não fica guardada na API (RNF01).
*/
import { API_URL, VISAO_URL, apiAoAlcance } from './config'

// Nome do campo do arquivo no formulário (combinado com a API)
const CAMPO_ARQUIVO = 'foto'

// Se a API demorar mais que isso, desistimos e usamos o plano B
const TEMPO_MAXIMO_MS = 30000

// Erro especial: a API não está rodando (versão publicada, sem o computador da demonstração)
export class VisaoIndisponivel extends Error {}

/*
  Pergunta à API se o modelo de buracos já está pronto (GET /, campo modelo_pronto).
  Logo que a API liga, ela "aquece" o modelo: sem isso, a primeira análise levava mais de 1 minuto.
  Devolve true ou false. Se a API não responder, dispara VisaoIndisponivel (plano B).
*/
export async function modeloPronto() {
  if (!apiAoAlcance(API_URL)) {
    throw new VisaoIndisponivel()
  }
  const controle = new AbortController()
  const timer = setTimeout(() => controle.abort(), 5000)
  try {
    const resposta = await fetch(API_URL + '/', { signal: controle.signal })
    const dados = await resposta.json()
    // API antiga, sem o campo: consideramos pronta
    return dados.modelo_pronto !== false
  } catch {
    throw new VisaoIndisponivel()
  } finally {
    clearTimeout(timer)
  }
}

/*
  Manda a foto para o YOLO procurar buracos.
  Devolve { resultado, caixas_buracos, largura, altura }. Se a API não responder,
  responder com erro ou mandar algo que não é JSON, dispara VisaoIndisponivel (plano B).
*/
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
  try {
    return await resposta.json()
  } catch {
    throw new VisaoIndisponivel()
  }
}
