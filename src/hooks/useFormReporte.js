import { useState } from 'react'
import { useAnaliseFoto } from './useAnaliseFoto'
import { useLocalDoReporte } from './useLocalDoReporte'
import { validarReporte, montarReporte } from '../domain/reportes'

/*
  Custom hook do formulário de reporte (novo e edição).
  Junta três coisas para a tela só precisar desenhar:
  - os campos digitados (dados) e os erros da validação
  - a foto e a análise da IA (useAnaliseFoto), só no reporte novo
  - o local escolhido no mapa (useLocalDoReporte)

  - inicial: os dados que começam preenchidos
  - editando: true na edição (a foto e a IA não entram)
  - aoSalvar(reporte): manda para a API; devolve true se deu certo
*/
export function useFormReporte(inicial, editando, aoSalvar) {
  const [dados, setDados] = useState(inicial)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  // Tipo escolhido à mão; enquanto for null, vale o que a IA disse
  const [tipoManual, setTipoManual] = useState(null)

  // Foto + IA de visão
  const analise = useAnaliseFoto()

  // Local do problema: mapa com pino, GPS e busca de endereço
  const local = useLocalDoReporte({ lat: inicial.lat, lng: inicial.lng }, (texto) =>
    // O mapa achou o endereço do pino: preenche o campo
    setDados((atual) => ({ ...atual, rua: texto })),
  )

  const tipoAtual = editando ? dados.tipo : tipoManual || analise.tipo
  const analisando = analise.estado === 'analisando'

  // Atualiza um campo do formulário. Ex.: mudar('rua', 'Rua X, 10')
  function mudar(campo, valor) {
    setDados({ ...dados, [campo]: valor })
  }

  function mudarTipo(valor) {
    if (editando) mudar('tipo', valor)
    else setTipoManual(valor)
  }

  async function enviar(evento) {
    evento.preventDefault() // não deixa o navegador recarregar a página
    if (analisando) return

    // No reporte novo entram também o tipo e a miniatura da foto (regra RN05)
    const daFoto = editando ? null : { tipo: tipoAtual, fotoUrl: analise.miniatura }
    const reporte = montarReporte(dados, local.coordenadas, daFoto)

    const encontrados = validarReporte(reporte, !editando)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    const deuCerto = await aoSalvar(reporte)
    if (!deuCerto) setEnviando(false)
  }

  return { dados, erros, enviando, analisando, tipoAtual, analise, local, mudar, mudarTipo, enviar }
}
