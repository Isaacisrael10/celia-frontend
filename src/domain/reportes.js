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

// Ex.: "2026-11-14T10:20:00Z" → "14/11/2026"
export function formatarData(textoIso) {
  const data = new Date(textoIso)
  if (isNaN(data)) return ''
  return data.toLocaleDateString('pt-BR')
}
