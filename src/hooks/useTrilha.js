import { useEffect, useState } from 'react'
import { buscarTrilha, buscarLicao } from '../services/trilhaApi'
import copiaLocal from '../data/trilha.json'

/*
  Custom hooks da mini trilha de IA.
  Primeiro tenta a API da equipe. Se ela não estiver no ar (versão publicada),
  usa a cópia salva no app (src/data/trilha.json): o plano B da trilha.

  origem: 'api' | 'copia'
*/
export function useTrilha() {
  const [trilha, setTrilha] = useState(null)
  const [origem, setOrigem] = useState('')

  useEffect(() => {
    let ativo = true // se a tela fechar antes da resposta, não mexe no estado
    buscarTrilha()
      .then((dados) => {
        if (!ativo) return
        setTrilha(dados)
        setOrigem('api')
      })
      .catch(() => {
        if (!ativo) return
        setTrilha(copiaLocal)
        setOrigem('copia')
      })
    return () => {
      ativo = false
    }
  }, [])

  return { trilha, origem, carregando: trilha === null }
}

/*
  Uma lição da trilha.
  estado: 'carregando' | 'pronta' | 'naoExiste'
*/
export function useLicao(id) {
  const [licao, setLicao] = useState(null)
  const [estado, setEstado] = useState('carregando')

  useEffect(() => {
    let ativo = true
    setEstado('carregando')
    buscarLicao(id)
      .then((dados) => {
        if (!ativo) return
        setLicao(dados)
        setEstado('pronta')
      })
      .catch(() => {
        if (!ativo) return
        // API fora do ar ou lição que não existe: procura na cópia do app
        const daCopia = copiaLocal.licoes.find((l) => String(l.id) === String(id))
        setLicao(daCopia || null)
        setEstado(daCopia ? 'pronta' : 'naoExiste')
      })
    return () => {
      ativo = false
    }
  }, [id])

  return { licao, estado }
}
