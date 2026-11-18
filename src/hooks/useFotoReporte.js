import { useEffect, useRef, useState } from 'react'
import { gerarMiniatura } from '../services/miniatura'

/*
  Custom hook da foto do reporte do CIDADÃO.
  Quando a pessoa escolhe a foto:
  1. mostra a foto na tela
  2. gera a miniatura (para salvar na MockAPI junto com o reporte)

  A IA (YOLO e depois Gemini) fica no useDescricaoIa: este hook só cuida da foto.

  estado: 'vazio' | 'pronta' | 'erro'
  - aoEscolher(arquivo): (opcional) chamada quando a foto está pronta; o formulário usa para
    conferir a foto com o YOLO e pedir a descrição para a Prefeitura [HU-05, HU-22, RF09, RF21]
*/
export function useFotoReporte(aoEscolher) {
  const [estado, setEstado] = useState('vazio')
  const [previa, setPrevia] = useState('') // endereço da foto para mostrar na tela
  const [miniatura, setMiniatura] = useState('')
  const [erro, setErro] = useState('')

  // Conta as fotos escolhidas: se a pessoa trocar de foto no meio, ignoramos a miniatura antiga
  const ultimaFoto = useRef(0)

  // Libera da memória a prévia antiga quando ela muda ou a tela fecha
  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa)
    }
  }, [previa])

  async function escolherFoto(arquivo) {
    if (!arquivo) return
    if (!arquivo.type.startsWith('image/')) {
      setEstado('erro')
      setErro('Escolha uma foto (arquivo de imagem).')
      return
    }

    const numero = ++ultimaFoto.current
    setPrevia(URL.createObjectURL(arquivo))
    setErro('')

    try {
      const pequena = await gerarMiniatura(arquivo)
      if (numero !== ultimaFoto.current) return
      setMiniatura(pequena)
      setEstado('pronta')
      if (aoEscolher) aoEscolher(arquivo)
    } catch (e) {
      if (numero !== ultimaFoto.current) return
      setEstado('erro')
      setErro(e.message)
    }
  }

  return { estado, previa, miniatura, erro, escolherFoto }
}
