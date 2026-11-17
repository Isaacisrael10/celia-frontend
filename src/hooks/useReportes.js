import { useEffect, useState } from 'react'
import { listarReportes, criarReporte, editarReporte, excluirReporte } from '../services/reportesApi'
import { coordenadasDoEndereco } from '../services/geocodificacao'
import { ordenarPorData } from '../domain/reportes'

/*
  Custom hook do CRUD de reportes (a API externa é a MockAPI).
  Junta o acesso à API (services) com o estado da tela:
  - reportes: a lista
  - carregando / erro: para mostrar os estados da tela
  - criar, editar, excluir: atualizam a API e, se der certo, a lista
*/
export function useReportes() {
  const [reportes, setReportes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Cada vez que este número muda, a lista é buscada de novo
  const [tentativa, setTentativa] = useState(0)

  // READ: busca a lista quando a tela abre e a cada "Tentar de novo"
  useEffect(() => {
    let ativo = true // se a pessoa sair da tela antes da resposta, ignoramos o resultado

    listarReportes()
      .then((lista) => {
        if (!ativo) return
        setReportes(ordenarPorData(lista))
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

  // CREATE
  async function criar(dados) {
    // Sem localização? Procuramos as coordenadas do endereço para o reporte aparecer no mapa
    let local = { lat: dados.lat, lng: dados.lng }
    if (typeof local.lat !== 'number') {
      local = (await coordenadasDoEndereco(dados.rua)) || { lat: null, lng: null }
    }
    const novo = await criarReporte({ ...dados, ...local, criadoEm: new Date().toISOString() })
    setReportes((atual) => [novo, ...atual])
    return novo
  }

  // UPDATE
  async function editar(id, dados) {
    const atualizado = await editarReporte(id, dados)
    setReportes((atual) => atual.map((r) => (r.id === id ? atualizado : r)))
    return atualizado
  }

  // DELETE
  async function excluir(id) {
    await excluirReporte(id)
    setReportes((atual) => atual.filter((r) => r.id !== id))
  }

  return { reportes, carregando, erro, carregar, criar, editar, excluir }
}
