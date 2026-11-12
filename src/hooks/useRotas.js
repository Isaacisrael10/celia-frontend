import { useEffect, useMemo, useState } from 'react'
import dadosRotas from '../data/rotas.json'
import { useTrechos } from './useTrechos'
import { analisarRota, ordenarRotas } from '../domain/rotas'

const CHAVE = 'celia-rota'

function rotaSalva() {
  try {
    return localStorage.getItem(CHAVE) || ''
  } catch {
    return ''
  }
}

/*
  Custom hook das rotas.
  - rotas: da mais segura para a menos segura (a primeira é a recomendada)
  - escolhida: a rota que a pessoa escolheu (fica salva no navegador)
  - escolher(id): escolhe uma rota
*/
export function useRotas() {
  const { trechos, poste } = useTrechos()
  const [idEscolhida, setIdEscolhida] = useState(rotaSalva)

  // Recalcula quando a situação dos trechos muda (ex.: o poste ficou em Perigo)
  const rotas = useMemo(() => ordenarRotas(dadosRotas.map((r) => analisarRota(r, trechos))), [trechos])

  useEffect(() => {
    try {
      if (idEscolhida) localStorage.setItem(CHAVE, idEscolhida)
    } catch {
      // sem localStorage: a escolha vale só até fechar a página
    }
  }, [idEscolhida])

  const escolhida = rotas.find((r) => r.id === idEscolhida) || null

  return { rotas, recomendada: rotas[0], escolhida, escolher: setIdEscolhida, trechos, poste }
}
