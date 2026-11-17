import { useState } from 'react'
import dados from '../data/locais.json'
import { filtrarLocais } from '../domain/locais'

/*
  Custom hook da tela Locais (banheiros acessíveis, pontos de descanso e lazer acessível) [HU-12, HU-14].
  - filtro: 'todos', 'banheiro', 'descanso' ou 'lazer'
  - mudarFiltro(valor): troca o filtro
  - visiveis: os locais do filtro, do mais perto para o mais longe
  - fonte: de onde vêm os dados (aparece no fim da tela)
*/
export function useLocais() {
  // Interação Web Dev: filtrar por tipo de local
  const [filtro, setFiltro] = useState('todos')

  const visiveis = filtrarLocais(dados.locais, filtro)

  return { filtro, mudarFiltro: setFiltro, visiveis, fonte: dados.fonte }
}
