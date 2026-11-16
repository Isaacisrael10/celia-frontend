/*
  Regras do módulo da Prefeitura (sem React).

  Dois tipos de reporte chegam à Prefeitura:
  - do POSTE: a câmera do poste (ESP32-CAM, na versão real) envia a foto e a API roda a IA de visão (YOLO).
    Quando acha um buraco, o Gemini escreve o reporte e ele é enviado SOZINHO, sem revisão humana.
  - do CIDADÃO: enviado pelo app. A IA só ajuda a escrever; o cidadão revisa antes de enviar (RN07).

  No protótipo não temos ESP32-CAM: fotos já baixadas fazem o papel da câmera (SIMULAÇÃO),
  e o app envia essas fotos para a mesma API. Isso aparece escrito na tela.
*/

// De onde veio o reporte
export const ORIGENS = {
  poste: 'Automático · Poste',
  cidadao: 'Cidadão',
}

// Opções do filtro da lista
export const FILTROS_ORIGEM = { todos: 'Todos', poste: 'Postes', cidadao: 'Cidadãos' }

// Situação do reporte do lado da Prefeitura (dados de exemplo)
export const SITUACOES_PREFEITURA = {
  recebido: 'Recebido',
  em_analise: 'Em análise',
  conserto_agendado: 'Conserto agendado',
  resolvido: 'Resolvido',
}

// Devolve só os reportes da origem escolhida ("todos" devolve a lista inteira)
export function filtrarPorOrigem(reportes, filtro) {
  if (filtro === 'todos') return reportes
  return reportes.filter((r) => r.origem === filtro)
}

// Mais recentes primeiro (devolve uma cópia: não mexe na lista original)
export function ordenarRecentes(reportes) {
  return [...reportes].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
}

// Quantos reportes de cada origem. Ex.: { todos: 6, poste: 3, cidadao: 3 }
export function contarPorOrigem(reportes) {
  const poste = reportes.filter((r) => r.origem === 'poste').length
  return { todos: reportes.length, poste, cidadao: reportes.length - poste }
}

/*
  Monta o reporte que o poste envia sozinho depois que o YOLO acha um buraco.
  - poste: dados do poste (src/data/prefeitura.json)
  - quadro: a imagem em que o buraco apareceu
  - caixas: as caixas que o YOLO desenhou
  - descricao: o texto que o Gemini escreveu
*/
export function montarReportePoste(poste, quadro, caixas, descricao) {
  const agora = new Date()
  return {
    id: 'poste-' + agora.getTime(),
    origem: 'poste',
    poste: poste.nome,
    tipo: 'buraco',
    rua: poste.local,
    bairro: 'Grajaú',
    lat: poste.lat,
    lng: poste.lng,
    criadoEm: agora.toISOString(),
    descricao,
    situacao: 'recebido',
    fotoUrl: quadro.src,
    caixas,
    novo: true,
  }
}

// Ex.: "2026-11-15T07:42:00-03:00" → "15/11/2026 às 07:42"
export function formatarDataHora(textoIso) {
  const data = new Date(textoIso)
  if (isNaN(data)) return ''
  const dia = data.toLocaleDateString('pt-BR')
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return dia + ' às ' + hora
}

// Ex.: 1 → "1 reporte" · 3 → "3 reportes"
export function textoQuantidade(quantidade) {
  return quantidade === 1 ? '1 reporte' : quantidade + ' reportes'
}

/*
  As etapas do que acontece no poste, na ordem.
  O LED acende logo depois da IA de visão (o poste não espera o texto ficar pronto).
*/
export const ETAPAS_POSTE = [
  { id: 'captura', titulo: 'Câmera captura', texto: 'O poste tira uma foto da calçada.' },
  { id: 'visao', titulo: 'IA de visão (YOLO)', texto: 'O modelo da equipe procura buracos.' },
  { id: 'led', titulo: 'LED do poste fica vermelho', texto: 'Trecho vira "Evite" no mapa (MQTT).' },
  { id: 'report', titulo: 'Gemini escreve o reporte', texto: 'Texto claro, sem dados pessoais.' },
  { id: 'envio', titulo: 'Enviado à Prefeitura', texto: 'Automático, sem revisão humana.' },
]

/*
  Estado de cada etapa em cada fase da câmera: 'espera' | 'ativa' | 'feita' | 'pulada'.
  Fases: 'parada' | 'preparando' | 'capturando' | 'analisando' | 'livre' | 'escrevendo' | 'enviado' | 'falhou' | 'fim'
  Ex.: fase 'escrevendo' → captura, visão e LED feitos; o Gemini está escrevendo; o envio espera.
*/
const TABELA_ETAPAS = {
  capturando: { captura: 'ativa' },
  analisando: { captura: 'feita', visao: 'ativa' },
  livre: { captura: 'feita', visao: 'feita', led: 'pulada', report: 'pulada', envio: 'pulada' },
  escrevendo: { captura: 'feita', visao: 'feita', led: 'feita', report: 'ativa' },
  enviado: { captura: 'feita', visao: 'feita', led: 'feita', report: 'feita', envio: 'feita' },
  falhou: { captura: 'feita', visao: 'feita', led: 'feita', report: 'pulada', envio: 'pulada' },
}

export function estadoDasEtapas(fase) {
  const daFase = TABELA_ETAPAS[fase] || {}
  // O que a tabela não cita está esperando
  return Object.fromEntries(ETAPAS_POSTE.map((e) => [e.id, daFase[e.id] || 'espera']))
}

/*
  ---------- Alertas de calor no ponto de ônibus ----------
  O poste mede temperatura e umidade (DHT22) e calcula o índice de calor (sensação térmica).
  Cada alerta ganha uma cor pelo índice de calor.

  PROPOSTA (pedido do João, 15/11/2026): faixas de 30, 32 e 35 °C, as mesmas opções do
  "Alerta de calor no ponto" do Perfil. ATENÇÃO: o ESP32 (edge/celia_logica.h) hoje usa
  32 °C para atenção e 41 °C para perigo. A equipe precisa alinhar os dois antes da entrega.
  Para mudar, troque só os números abaixo.
*/
export const NIVEIS_CALOR_PONTO = {
  leve: {
    id: 'leve',
    nome: 'Calor leve',
    icone: '✓',
    cor: 'var(--faixa-normal)',
    apartir: 30,
    orientacao: 'O app avisa só quem escolheu 30 °C no Perfil.',
  },
  atencao: {
    id: 'atencao',
    nome: 'Atenção',
    icone: '!',
    cor: 'var(--faixa-atencao)',
    apartir: 32,
    orientacao: 'O app avisa quem tem este ponto no trajeto. Sombra e água ajudam na espera.',
  },
  evite: {
    id: 'evite',
    nome: 'Evite',
    icone: '✕',
    cor: 'var(--faixa-perigo)',
    apartir: 35,
    orientacao: 'O app sugere outro ponto ou horário. Prioridade para cobertura no ponto.',
  },
}

// Opções do filtro da aba de calor
export const FILTROS_CALOR = { todos: 'Todos', evite: 'Evite', atencao: 'Atenção', leve: 'Calor leve' }

/*
  Nível do alerta pelo índice de calor.
  Ex.: 30.4 → leve · 33.1 → atencao · 35.6 → evite
*/
export function nivelDoCalor(indiceCalor) {
  if (indiceCalor >= NIVEIS_CALOR_PONTO.evite.apartir) return NIVEIS_CALOR_PONTO.evite
  if (indiceCalor >= NIVEIS_CALOR_PONTO.atencao.apartir) return NIVEIS_CALOR_PONTO.atencao
  return NIVEIS_CALOR_PONTO.leve
}

// Mais graves primeiro; no mesmo nível, o mais recente primeiro
export function ordenarAlertas(alertas) {
  return [...alertas].sort(
    (a, b) => b.indiceCalor - a.indiceCalor || new Date(b.horario) - new Date(a.horario),
  )
}

// Só os alertas do nível escolhido ("todos" devolve a lista inteira)
export function filtrarAlertas(alertas, filtro) {
  if (filtro === 'todos') return alertas
  return alertas.filter((a) => nivelDoCalor(a.indiceCalor).id === filtro)
}

// Quantos alertas de cada nível. Ex.: { evite: 2, atencao: 2, leve: 2 }
export function contarAlertas(alertas) {
  const contagem = { evite: 0, atencao: 0, leve: 0 }
  alertas.forEach((a) => {
    contagem[nivelDoCalor(a.indiceCalor).id]++
  })
  return contagem
}

// Ex.: 35.6 → "35,6 °C"
export function textoGraus(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' °C'
}

// Ex.: "2026-11-15T13:40:00-03:00" → "13:40"
export function horaDoAlerta(textoIso) {
  return new Date(textoIso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
