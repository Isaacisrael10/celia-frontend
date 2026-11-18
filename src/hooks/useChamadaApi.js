import { useState } from 'react'
import { ApiIndisponivel } from '../services/apiEquipe'

/*
  Custom hook para qualquer chamada à API da equipe: guarda carregando e erro.
  - executar(funcao): roda a função do serviço e devolve o resultado (ou null se deu erro)
  - indisponivel: true quando a API não está no ar (plano B: mensagem amigável, nunca erro cru)
  Ex.: const r = await executar(() => perguntarTrajeto(pergunta, contexto))

  Novas tentativas automáticas: se a API responder erro 5xx (ex.: Gemini sobrecarregado, 503),
  o hook espera e tenta de novo sozinho, até 3 vezes (espera 3 s, 6 s e 12 s).
  Não tenta sem parar: a cota grátis do Gemini é de poucos pedidos por minuto e estouraria.
  Depois da 3ª, mostra o motivo e a tela oferece o botão "Tentar de novo".
  - tentativa: 0 na primeira chamada; 1, 2 ou 3 durante as novas tentativas
  - aviso: o motivo da última falha, para a tela explicar por que está demorando

  - esperas (opcional): quanto esperar antes de cada nova tentativa. Sem passar nada, vale o
    padrão (3 s, 6 s e 12 s). useChamadaApi([]) não tenta de novo sozinho: a descrição do
    reporte usa assim, porque a API já tentou os 3 modelos do Gemini antes de responder erro.
*/
const ESPERAS_MS = [3000, 6000, 12000]
export const MAX_TENTATIVAS = ESPERAS_MS.length

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useChamadaApi(esperas = ESPERAS_MS) {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [indisponivel, setIndisponivel] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const [aviso, setAviso] = useState('')

  async function executar(funcao) {
    setCarregando(true)
    setErro('')
    setIndisponivel(false)
    setTentativa(0)
    setAviso('')
    try {
      for (let i = 0; ; i++) {
        try {
          return await funcao()
        } catch (e) {
          // Erro do servidor (5xx) e ainda temos tentativas: espera e tenta de novo
          const erroDoServidor = e.codigo >= 500
          if (erroDoServidor && i < esperas.length) {
            setAviso(e.message)
            setTentativa(i + 1)
            await esperar(esperas[i])
            continue
          }
          setErro(e.message)
          setIndisponivel(e instanceof ApiIndisponivel)
          return null
        }
      }
    } finally {
      setCarregando(false)
      setTentativa(0)
    }
  }

  return { executar, carregando, erro, indisponivel, tentativa, aviso }
}
