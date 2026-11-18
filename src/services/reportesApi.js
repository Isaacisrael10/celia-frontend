/*
  Acesso aos reportes na MockAPI (a "API externa" do CRUD).
  Só faz as chamadas HTTP: não sabe nada de React nem de tela.

  GET    /reportes      → listar
  POST   /reportes      → criar
  PUT    /reportes/:id  → editar
  DELETE /reportes/:id  → excluir
*/
import { REPORTES_URL } from './config'
import { lerJson } from './lerJson'

// Faz a chamada e devolve o JSON. Se der erro, lança uma mensagem simples.
async function chamar(url, opcoes) {
  if (!REPORTES_URL) {
    throw new Error('A lista de reportes ainda não está ligada à API.')
  }

  let resposta
  try {
    resposta = await fetch(url, opcoes)
  } catch {
    throw new Error('Sem conexão com a internet. Tente de novo.')
  }

  if (!resposta.ok) {
    throw new Error('Não deu para falar com o servidor agora. Tente de novo.')
  }
  return lerJson(resposta, 'Não deu para falar com o servidor agora. Tente de novo.')
}

// Lista todos os reportes. Devolve [{ id, rua, tipo, descricao, status, fotoUrl, lat, lng, criadoEm }]
export function listarReportes() {
  return chamar(REPORTES_URL)
}

// Cria um reporte novo. Devolve o reporte salvo, já com o id que a MockAPI deu.
export function criarReporte(reporte) {
  return chamar(REPORTES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reporte),
  })
}

// Troca os dados do reporte "id" pelos novos. Devolve o reporte atualizado.
export function editarReporte(id, reporte) {
  return chamar(REPORTES_URL + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reporte),
  })
}

// Apaga o reporte "id" na MockAPI.
export function excluirReporte(id) {
  return chamar(REPORTES_URL + '/' + id, { method: 'DELETE' })
}
