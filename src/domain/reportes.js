/*
  Regras dos reportes (sem React): tipos, situações, validação e data.
*/

// Tipo = o que a IA de visão encontrou na foto (ou "não analisada", no plano B)
export const TIPOS = {
  buraco: 'Buraco na calçada',
  obstaculo: 'Obstáculo na calçada',
  livre: 'Calçada livre',
  nao_analisada: 'Não analisada',
}

// Situação do reporte. Usa só grafite e azul: o semáforo é reservado às faixas.
export const SITUACOES = {
  aberto: 'Aberto',
  enviado: 'Enviado à prefeitura',
  resolvido: 'Resolvido',
}

// Opções do filtro da lista (nomes curtos para caber na largura do celular)
export const FILTROS_REPORTE = { todos: 'Todos', aberto: 'Abertos', enviado: 'Enviados', resolvido: 'Resolvidos' }

// Devolve só os reportes da situação escolhida ("todos" devolve a lista inteira)
export function filtrarReportes(reportes, filtro) {
  if (filtro === 'todos') return reportes
  return reportes.filter((r) => r.status === filtro)
}

// Mais recentes primeiro (devolve uma cópia: não mexe na lista original)
export function ordenarPorData(reportes) {
  return [...reportes].sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''))
}

// Ex.: 1 → "1 reporte" · 3 → "3 reportes"
export function textoQuantidade(quantidade) {
  return quantidade === 1 ? '1 reporte' : quantidade + ' reportes'
}

// Reporte em branco, usado no formulário de "Novo reporte"
export const REPORTE_VAZIO = {
  rua: '',
  tipo: 'nao_analisada',
  descricao: '',
  status: 'aberto',
  fotoUrl: '',
  lat: null,
  lng: null,
}

/*
  Confere o formulário e devolve os erros encontrados.
  Se o objeto voltar vazio ({}), está tudo certo.
  Regra RN05: reporte novo só sai com foto, classificação e descrição.
  - exigirFoto: true no "Novo reporte" (na edição a foto não muda)
*/
export function validarReporte(reporte, exigirFoto = false) {
  const erros = {}
  const rua = reporte.rua.trim()
  const descricao = reporte.descricao.trim()

  if (exigirFoto && !reporte.fotoUrl) {
    erros.foto = 'Tire ou escolha uma foto da calçada.'
  }

  // Rua e número: precisa ter pelo menos um número junto do nome
  if (rua.length < 5 || !/\d/.test(rua)) {
    erros.rua = 'Escreva a rua e o número.'
  }
  if (descricao.length < 5) {
    erros.descricao = 'Escreva pelo menos uma frase.'
  }
  return erros
}

/*
  Monta o reporte que vai para a API, a partir do que está no formulário.
  - dados: os campos do formulário
  - coordenadas: { lat, lng } do pino do mapa (ou nulos, se a pessoa só digitou o endereço)
  - daFoto: { tipo, fotoUrl } vindos da foto e da IA. Só no reporte NOVO; na edição vai null,
    porque a foto e o tipo já estão salvos nos dados.
*/
export function montarReporte(dados, coordenadas, daFoto) {
  const comLocal = { ...dados, lat: coordenadas.lat, lng: coordenadas.lng }
  if (!daFoto) return comLocal
  return { ...comLocal, tipo: daFoto.tipo, fotoUrl: daFoto.fotoUrl }
}

// Ex.: "2026-11-14T10:20:00Z" → "14/11/2026"
export function formatarData(textoIso) {
  const data = new Date(textoIso)
  if (isNaN(data)) return ''
  return data.toLocaleDateString('pt-BR')
}
