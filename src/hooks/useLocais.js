import { useState } from 'react'
import dados from '../data/locais.json'
import { filtrarLocais } from '../domain/locais'

/*
  Custom hook da tela Locais (banheiros acessíveis, pontos de descanso e lazer acessível) [HU-12, HU-14].
  - filtro: 'todos', 'banheiro', 'descanso' ou 'lazer'
  - mudarFiltro(valor): troca o filtro (e volta a categoria de lazer para "todas")
  - categoria: tipo de lazer ('todas', 'esporte', 'cultura' ou 'ar-livre'), só vale no filtro "lazer"
  - mudarCategoria(valor): troca a categoria de lazer
  - visiveis: os locais do filtro, do mais perto para o mais longe
  - fonte: de onde vêm os dados (aparece no fim da tela)
*/
export function useLocais() {
  // Interação Web Dev: filtrar por tipo de local
  const [filtro, setFiltro] = useState('todos')
  // Interação Web Dev: dentro do lazer, filtrar por categoria
  const [categoria, setCategoria] = useState('todas')

  function mudarFiltro(valor) {
    setFiltro(valor)
    setCategoria('todas')
  }

  const visiveis = filtrarLocais(dados.locais, filtro, categoria)

  return { filtro, mudarFiltro, categoria, mudarCategoria: setCategoria, visiveis, fonte: dados.fonte }
}
