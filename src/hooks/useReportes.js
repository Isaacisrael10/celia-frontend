import { useEffect, useState } from 'react'
import { listarReportes, criarReporte, editarReporte, excluirReporte } from '../services/reportesApi'

/*
  Custom hook do CRUD de reportes.
  Junta o acesso à API (services) com o estado da tela:
  - reportes: a lista
  - carregando / erro: para mostrar os estados da tela
  - criar, editar, excluir: atualizam a API e a lista
*/
export function useReportes() {
  const [reportes, setReportes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Cada vez que este número muda, a lista é buscada de novo
  const [tentativa, setTentativa] = useState(0)

  // Busca a lista quando a tela abre e a cada "Tentar de novo"
  useEffect(() => {
    let ativo = true // se a pessoa sair da tela antes da resposta, ignoramos o resultado

    listarReportes()
      .then((lista) => {
        if (!ativo) return
        // Mais recentes primeiro
        lista.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''))
        setReportes(lista)
        setErro('')
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [tentativa])

  // Botão "Tentar de novo"
  function carregar() {
    setCarregando(true)
    setTentativa(tentativa + 1)
  }

  async function criar(dados) {
    const novo = await criarReporte({ ...dados, criadoEm: new Date().toISOString() })
    setReportes((atual) => [novo, ...atual])
    return novo
  }

  async function editar(id, dados) {
    const atualizado = await editarReporte(id, dados)
    setReportes((atual) => atual.map((r) => (r.id === id ? atualizado : r)))
    return atualizado
  }

  async function excluir(id) {
    await excluirReporte(id)
    setReportes((atual) => atual.filter((r) => r.id !== id))
  }

  return { reportes, carregando, erro, carregar, criar, editar, excluir }
}
