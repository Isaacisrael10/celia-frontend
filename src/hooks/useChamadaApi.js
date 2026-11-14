import { useState } from 'react'
import { ApiIndisponivel } from '../services/apiEquipe'

/*
  Custom hook para qualquer chamada à API da equipe: guarda carregando e erro.
  - executar(funcao): roda a função do serviço e devolve o resultado (ou null se deu erro)
  - indisponivel: true quando a API não está no ar (plano B: mensagem amigável, nunca erro cru)
  Ex.: const r = await executar(() => perguntarTrajeto(pergunta, contexto))
*/
export function useChamadaApi() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [indisponivel, setIndisponivel] = useState(false)

  async function executar(funcao) {
    setCarregando(true)
    setErro('')
    setIndisponivel(false)
    try {
      return await funcao()
    } catch (e) {
      setErro(e.message)
      setIndisponivel(e instanceof ApiIndisponivel)
      return null
    } finally {
      setCarregando(false)
    }
  }

  return { executar, carregando, erro, indisponivel }
}
