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

  Privacidade da foto do cidadão [RNF01, RN05, HU-08]:
  a miniatura NÃO vai para a MockAPI (ela é pública: qualquer um que chamar GET /reportes veria).
  Ela fica só na memória deste navegador, ligada ao id do reporte, e aparece só para quem enviou.
  Não usa localStorage: ao atualizar a página, a foto some. Para os outros, o card vem sem foto.
*/

// Fica fora do hook para valer em todas as telas (Reportar e Mapa) enquanto a página está aberta.
// Ex.: { '12': 'data:image/jpeg;base64,...' }
const fotosDestaSessao = new Map()

// Põe de volta a foto local nos reportes que esta pessoa enviou agora
function comFotoLocal(reporte) {
  const foto = fotosDestaSessao.get(reporte.id)
  return foto ? { ...reporte, fotoUrl: foto } : reporte
}

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
    // A foto sai do que vai para a API e fica só na memória (fotosDestaSessao)
    const { fotoUrl, ...semFoto } = dados
    const novo = await criarReporte({ ...semFoto, ...local, fotoUrl: '', criadoEm: new Date().toISOString() })
    if (fotoUrl) fotosDestaSessao.set(novo.id, fotoUrl)
    setReportes((atual) => [novo, ...atual])
    return novo
  }

  // UPDATE
  async function editar(id, dados) {
    // Na edição o card manda o reporte inteiro: se a foto é local, ela não pode subir agora
    const paraApi = fotosDestaSessao.has(id) ? { ...dados, fotoUrl: '' } : dados
    const atualizado = await editarReporte(id, paraApi)
    setReportes((atual) => atual.map((r) => (r.id === id ? atualizado : r)))
    return atualizado
  }

  // DELETE
  async function excluir(id) {
    await excluirReporte(id)
    fotosDestaSessao.delete(id)
    setReportes((atual) => atual.filter((r) => r.id !== id))
  }

  return { reportes: reportes.map(comFotoLocal), carregando, erro, carregar, criar, editar, excluir }
}
