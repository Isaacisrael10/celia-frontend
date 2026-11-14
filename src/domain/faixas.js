/*
  Regras das faixas do semáforo (sem React, só dados e funções puras).

  Tudo o que diz respeito a nome, cor, ícone e motivo das faixas fica AQUI.
  Nomes iguais aos do ESP32 e da documentação: Acessível · Atenção · Evite.
  Se a equipe mudar, basta trocar neste arquivo e o app inteiro acompanha.
  (Os ids "normal" e "perigo" são só nomes internos do código.)

  Os números seguem o ESP32 (ThingSpeak):
    field5 status: 0 verde · 1 amarelo · 2 vermelho
    field6 motivo: 0 nenhum · 1 calçada · 2 calor · 3 ambos · 4 veículo · 5 buraco
*/

export const FAIXAS = {
  normal: {
    id: 'normal',
    nome: 'Acessível',
    icone: '✓',
    cor: 'var(--faixa-normal)',
    linha: 'continua',
    explicacao: 'Calçada livre e sem calor forte. Boa para cadeira de rodas, andador e bengala.',
  },
  atencao: {
    id: 'atencao',
    nome: 'Atenção',
    icone: '!',
    cor: 'var(--faixa-atencao)',
    linha: 'tracejado-longo',
    explicacao: 'Dá para passar, mas com cuidado. Veja o motivo antes de sair.',
  },
  perigo: {
    id: 'perigo',
    nome: 'Evite',
    icone: '✕',
    cor: 'var(--faixa-perigo)',
    linha: 'tracejado-curto',
    explicacao: 'Trecho difícil agora. Prefira outro caminho.',
  },
  semDados: {
    id: 'semDados',
    nome: 'Sem dados',
    icone: '?',
    cor: 'var(--faixa-sem-dados)',
    linha: 'pontilhado',
    explicacao: 'Não temos leitura recente deste trecho.',
  },
}

/*
  Cores das linhas no mapa. O MapLibre desenha fora do CSS, então
  precisa do código da cor (as mesmas de src/styles/tokens.css).
*/
export const CORES_MAPA = {
  claro: { normal: '#1E8E3E', atencao: '#B26A00', perigo: '#C62828', semDados: '#6B717B' },
  escuro: { normal: '#5BD08A', atencao: '#F2B84B', perigo: '#FF7A7A', semDados: '#A0A6B0' },
}

// Texto do motivo, na ordem do field6 do ESP32
// O 4 (veículo) foi removido em 12/11 (o modelo marcava carros estacionados): fica vazio
export const MOTIVOS = ['', 'calçada estreita', 'calor', 'calçada e calor', '', 'buraco']

// Converte o número do status (0, 1, 2) na faixa. Qualquer outra coisa vira "Sem dados".
export function faixaDoStatus(status) {
  if (status === 0) return FAIXAS.normal
  if (status === 1) return FAIXAS.atencao
  if (status === 2) return FAIXAS.perigo
  return FAIXAS.semDados
}

// Converte o número do motivo no texto. Ex.: 2 → "calor"
export function textoDoMotivo(motivo) {
  return MOTIVOS[motivo] || ''
}

// Junta faixa e motivo para mostrar na tela. Ex.: "Evite · calor"
export function rotuloCompleto(faixa, motivo) {
  const texto = textoDoMotivo(motivo)
  if (faixa.id === 'normal' || faixa.id === 'semDados' || texto === '') {
    return faixa.nome
  }
  return faixa.nome + ' · ' + texto
}
