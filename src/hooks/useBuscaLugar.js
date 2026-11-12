import { useState } from 'react'
import { buscarLugar } from '../services/geocodificacao'

/*
  Custom hook da busca de lugar no mapa.
  - buscar(texto): procura e guarda os resultados
  - limpar(): fecha a lista de resultados
*/
export function useBuscaLugar() {
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState('')

  async function buscar(texto) {
    if (texto.trim().length < 3) {
      setErro('Escreva pelo menos 3 letras.')
      setResultados([])
      return
    }
    setBuscando(true)
    setErro('')
    try {
      const lista = await buscarLugar(texto.trim())
      setResultados(lista)
      if (lista.length === 0) setErro('Não achamos esse lugar. Tente com o bairro ou a cidade.')
    } catch (e) {
      setErro(e.message)
      setResultados([])
    } finally {
      setBuscando(false)
    }
  }

  function limpar() {
    setResultados([])
    setErro('')
  }

  return { resultados, buscando, erro, buscar, limpar }
}
