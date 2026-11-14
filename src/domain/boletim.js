/*
  Regras do "boletim do caminho de sempre" (sem React).

  O boletim responde, logo ao abrir o app: "dá para ir trabalhar hoje pelo meu caminho de sempre?".
  O caminho de sempre é a rota que a pessoa escolheu na tela Rotas (fica salva no navegador).
*/
import { textoDoMotivo } from './faixas'
import { minutosDesde, faixaDoCalor } from './poste'

/*
  Título e linha de apoio do boletim, a partir da rota já analisada (analisarRota).
  O pior trecho da rota decide o estado. Devolve { faixa, titulo, apoio }.
  Os títulos usam o nome da faixa: se a equipe trocar "Perigo" por "Evite", o boletim acompanha.
*/
export function boletimDaRota(rota) {
  const pior = rota.pior
  const faixa = pior.faixa

  if (faixa.id === 'normal') {
    return { faixa, titulo: 'Caminho de sempre livre', apoio: 'Nenhum trecho com problema · ' + rota.minutos + ' min' }
  }

  if (faixa.id === 'semDados') {
    return {
      faixa,
      titulo: 'Caminho de sempre sem dados',
      apoio: 'Sem leitura recente na ' + pior.rua + '. Confira os reportes antes de sair.',
    }
  }

  // Atenção ou Perigo: diz o motivo e a rua. Ex.: "Calçada estreita na Rua Itabaiana"
  const motivo = textoDoMotivo(pior.motivo)
  const problema = motivo ? motivo.charAt(0).toUpperCase() + motivo.slice(1) + ' na ' : 'Problema na '
  return { faixa, titulo: faixa.nome + ' no caminho de sempre', apoio: problema + pior.rua }
}

/*
  Linha do poste no boletim (o que o poste mediu no ponto de ônibus).
  - poste: o que o useStatusPoste devolve
  - limiteCalor: número (°C) escolhido no Perfil, ou 0 se a pessoa desligou o alerta
  Devolve { texto, calorAlto, calorExtremo } ou null quando o poste nunca mandou leitura.
*/
export function linhaDoPoste(poste, limiteCalor) {
  const { leitura, recente, agora } = poste
  if (!leitura) return null

  const minutos = minutosDesde(leitura.data, agora)

  // Regra dos 10 minutos: leitura velha não vale como situação de agora
  if (!recente) {
    const quando = minutos < 60 ? 'há ' + minutos + ' min' : 'há mais de 1 hora'
    return { texto: 'Poste sem sinal recente: última leitura ' + quando, calorAlto: false, calorExtremo: false }
  }

  const graus = leitura.indiceCalor !== null ? Math.round(leitura.indiceCalor) : null
  const quando = minutos < 1 ? 'agora há pouco' : 'há ' + minutos + ' min'
  const calorAlto = graus !== null && limiteCalor > 0 && graus >= limiteCalor
  // Nível de calor da equipe (Normal, Atenção, Perigo); Perigo sugere lugares para descansar
  const nivel = faixaDoCalor(leitura.indiceCalor)
  const calorExtremo = nivel !== null && nivel.nome === 'Perigo'

  if (graus === null) return { texto: 'Poste do ponto atualizado ' + quando, calorAlto, calorExtremo }
  return {
    texto: graus + ' °C no ponto de ônibus (calor ' + nivel.nome + ') · atualizado ' + quando,
    calorAlto,
    calorExtremo,
  }
}

// Opções do alerta de calor no Perfil (0 = desligado)
export const LIMITES_CALOR = [0, 30, 32, 35]
