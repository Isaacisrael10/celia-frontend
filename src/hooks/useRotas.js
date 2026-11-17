import { useEffect, useMemo, useState } from 'react'
import dadosRotas from '../data/rotas.json'
import { useTrechos } from './useTrechos'
import { analisarRota, ordenarRotas } from '../domain/rotas'
import { lerSalvo, salvar } from '../services/armazenamento'

const CHAVE = 'celia-rota'

/*
  Custom hook das rotas.
  - rotas: da mais segura para a menos segura (a primeira é a recomendada)
  - escolhida: o "caminho de sempre" que a pessoa escolheu (fica salvo no navegador)
  - escolher(id): escolhe uma rota
  Também devolve os trechos e o poste, para a tela não precisar buscar de novo.
*/
export function useRotas() {
  const { trechos, poste } = useTrechos()
  const [idEscolhida, setIdEscolhida] = useState(() => lerSalvo(CHAVE) || '')

  // Recalcula quando a situação dos trechos muda (ex.: o poste ficou em Perigo)
  const rotas = useMemo(() => ordenarRotas(dadosRotas.map((r) => analisarRota(r, trechos))), [trechos])

  useEffect(() => {
    if (idEscolhida) salvar(CHAVE, idEscolhida)
  }, [idEscolhida])

  const escolhida = rotas.find((r) => r.id === idEscolhida) || null

  return { rotas, recomendada: rotas[0], escolhida, escolher: setIdEscolhida, trechos, poste }
}
