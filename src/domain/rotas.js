/*
  Regras das rotas (sem React).
  A recomendada é a mais SEGURA, não a mais curta.
*/

// Gravidade de cada faixa: quanto maior, pior
const GRAVIDADE = { normal: 0, atencao: 1, semDados: 2, perigo: 3 }

/*
  Junta a rota com a situação de cada trecho e calcula o resumo.
  - rota: item de rotas.json
  - trechos: lista do useTrechos (cada um com faixa e motivo)
*/
export function analisarRota(rota, trechos) {
  const seus = rota.trechos.map((id) => trechos.find((t) => t.id === id)).filter(Boolean)

  // Pior trecho: o de maior gravidade
  let pior = seus[0]
  for (const t of seus) {
    if (GRAVIDADE[t.faixa.id] > GRAVIDADE[pior.faixa.id]) pior = t
  }

  // Quantos trechos em cada faixa. Ex.: { normal: 3, atencao: 1, perigo: 0, semDados: 0 }
  const contagem = { normal: 0, atencao: 0, perigo: 0, semDados: 0 }
  for (const t of seus) contagem[t.faixa.id]++

  return { ...rota, trechosDaRota: seus, pior, contagem }
}

/*
  Ordena da mais segura para a menos segura:
  1º menor gravidade do pior trecho · 2º menos trechos problemáticos · 3º menos minutos
*/
export function ordenarRotas(rotas) {
  return [...rotas].sort((a, b) => {
    const diferencaPior = GRAVIDADE[a.pior.faixa.id] - GRAVIDADE[b.pior.faixa.id]
    if (diferencaPior !== 0) return diferencaPior

    const problemasA = a.trechosDaRota.length - a.contagem.normal
    const problemasB = b.trechosDaRota.length - b.contagem.normal
    if (problemasA !== problemasB) return problemasA - problemasB

    return a.minutos - b.minutos
  })
}

// A rota passa por algum trecho em Perigo? Devolve o primeiro, ou null.
export function trechoEmPerigo(rota) {
  return rota.trechosDaRota.find((t) => t.faixa.id === 'perigo') || null
}

// Ex.: 1.1 → "1,1 km"
export function textoDistancia(km) {
  return km.toLocaleString('pt-BR') + ' km'
}
