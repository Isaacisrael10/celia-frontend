import { useEffect, useState } from 'react'
import { buscarTrilha } from '../services/trilhaApi'
import { trilhaValida } from '../domain/trilha'
import copiaDaTrilha from '../data/trilha.json'

/*
  Custom hook da mini trilha de IA [HU-19, RF18].
  1. Ao abrir a tela, pede as lições para a API da equipe.
  2. Deu certo → usa as lições da API (origem "api").
  3. API fora do ar ou resposta fora do formato → PLANO B: usa a cópia das lições
     que vem junto com o app (origem "copia"). A pessoa nunca vê um erro cru.

  - trilha: { titulo, licoes }
  - origem: 'api' ou 'copia'
  - carregando: true enquanto a API não respondeu
  - aberta: id da lição aberta (null = todas fechadas)
  - alternarLicao(id): abre a lição; se ela já estava aberta, fecha
*/
export function useTrilha() {
  const [trilha, setTrilha] = useState(copiaDaTrilha)
  const [origem, setOrigem] = useState('copia')
  const [carregando, setCarregando] = useState(true)
  // Interação: qual lição está aberta
  const [aberta, setAberta] = useState(null)

  useEffect(() => {
    let ativo = true // se a pessoa sair da tela antes da resposta, ignoramos o resultado

    buscarTrilha()
      .then((dados) => {
        if (!ativo || !trilhaValida(dados)) return
        setTrilha(dados)
        setOrigem('api')
      })
      .catch(() => {
        // Plano B: a tela segue com a cópia local, sem mensagem de erro
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  function alternarLicao(id) {
    setAberta(aberta === id ? null : id)
  }

  return { trilha, origem, carregando, aberta, alternarLicao }
}
