import { useState } from 'react'
import { useFotoReporte } from './useFotoReporte'
import { useChamadaApi } from './useChamadaApi'
import { sugerirDescricao } from '../services/assistenteApi'
import { useLocalDoReporte } from './useLocalDoReporte'
import { validarReporte, montarReporte, TIPOS_CIDADAO } from '../domain/reportes'

/*
  Custom hook do formulário de reporte (novo e edição).
  Junta três coisas para a tela só precisar desenhar:
  - os campos digitados (dados) e os erros da validação
  - a foto (useFotoReporte), só no reporte novo. Sem YOLO: a IA de visão é dos postes (tela Prefeitura)
  - o local escolhido no mapa (useLocalDoReporte)
  - a descrição para a Prefeitura sugerida pela IA (Gemini) assim que a foto é escolhida [HU-22, RF21]
    A pessoa revisa antes de enviar (RN07): é a diferença para o reporte do poste, que vai sozinho.

  - inicial: os dados que começam preenchidos
  - editando: true na edição (a foto e a IA não entram)
  - aoSalvar(reporte): manda para a API; devolve true se deu certo
*/
export function useFormReporte(inicial, editando, aoSalvar) {
  const [dados, setDados] = useState(inicial)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  // Tipo do problema no reporte novo: o cidadão escolhe (buraco ou obstáculo)
  const [tipoNovo, setTipoNovo] = useState(TIPOS_CIDADAO[inicial.tipo] ? inicial.tipo : 'buraco')

  // Descrição sugerida pela IA (Gemini). RN07: só entra no reporte quando a pessoa escolhe usar.
  const chamadaDescricao = useChamadaApi()
  const [sugestao, setSugestao] = useState('')

  async function gerarDescricao(tipo) {
    setSugestao('')
    // A API nunca recebe a foto: só o tipo escolhido, o local e o que a pessoa escreveu
    const r = await chamadaDescricao.executar(() => sugerirDescricao(tipo, dados.rua, dados.descricao))
    if (r) setSugestao(r.descricao_sugerida)
  }

  // Foto do reporte. Quando ela fica pronta, já pede a descrição ao Gemini.
  const foto = useFotoReporte(() => gerarDescricao(tipoNovo))

  // Local do problema: mapa com pino, GPS e busca de endereço
  const local = useLocalDoReporte({ lat: inicial.lat, lng: inicial.lng }, (texto) =>
    // O mapa achou o endereço do pino: preenche o campo
    setDados((atual) => ({ ...atual, rua: texto })),
  )

  const tipoAtual = editando ? dados.tipo : tipoNovo

  // Tudo o que o card da descrição precisa para desenhar e para os botões
  const descricaoIa = {
    carregando: chamadaDescricao.carregando,
    erro: chamadaDescricao.erro,
    indisponivel: chamadaDescricao.indisponivel,
    tentativa: chamadaDescricao.tentativa,
    aviso: chamadaDescricao.aviso,
    sugestao,
    usada: sugestao !== '' && dados.descricao === sugestao,
    gerar: () => gerarDescricao(tipoAtual),
    usar: () => mudar('descricao', sugestao),
  }

  // Atualiza um campo do formulário. Ex.: mudar('rua', 'Rua X, 10')
  function mudar(campo, valor) {
    setDados({ ...dados, [campo]: valor })
  }

  function mudarTipo(valor) {
    if (editando) mudar('tipo', valor)
    else setTipoNovo(valor)
  }

  async function enviar(evento) {
    evento.preventDefault() // não deixa o navegador recarregar a página

    // No reporte novo entram também o tipo e a miniatura da foto (regra RN05)
    const daFoto = editando ? null : { tipo: tipoAtual, fotoUrl: foto.miniatura }
    const reporte = montarReporte(dados, local.coordenadas, daFoto)

    const encontrados = validarReporte(reporte, !editando)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    const deuCerto = await aoSalvar(reporte)
    if (!deuCerto) setEnviando(false)
  }

  return { dados, erros, enviando, tipoAtual, foto, local, descricaoIa, mudar, mudarTipo, enviar }
}
