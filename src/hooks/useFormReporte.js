import { useState } from 'react'
import { useFotoReporte } from './useFotoReporte'
import { useDescricaoIa } from './useDescricaoIa'
import { useLocalDoReporte } from './useLocalDoReporte'
import { validarReporte, montarReporte, TIPOS_CIDADAO } from '../domain/reportes'
import { descricaoPadrao, textoSuficiente } from '../domain/descricaoIa'

/*
  Custom hook do formulário de reporte (novo e edição).
  Junta estas coisas para a tela só precisar desenhar:
  - os campos digitados (dados) e os erros da validação
  - a foto (useFotoReporte), só no reporte novo
  - o local escolhido no mapa (useLocalDoReporte)
  - a descrição para a Prefeitura (useDescricaoIa): no buraco, o YOLO confere a foto e só então
    o Gemini escreve; no obstáculo, o Gemini organiza o que o cidadão contou [HU-05, HU-22, RF21]
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

  // Descrição pela IA. RN07: só entra no reporte quando a pessoa escolhe usar.
  const ia = useDescricaoIa()

  // Foto do reporte. Quando ela fica pronta, a IA confere (buraco) ou espera o texto (obstáculo).
  const foto = useFotoReporte((arquivo) => ia.aoEscolherFoto(arquivo, tipoNovo, dados))

  // Local do problema: mapa com pino, GPS e busca de endereço
  const local = useLocalDoReporte({ lat: inicial.lat, lng: inicial.lng }, (texto) =>
    // O mapa achou o endereço do pino: preenche o campo
    setDados((atual) => ({ ...atual, rua: texto })),
  )

  const tipoAtual = editando ? dados.tipo : tipoNovo

  // Tudo o que o card da descrição precisa para desenhar e para os botões
  const descricaoIa = {
    etapa: ia.etapa,
    carregando: ia.carregando,
    erro: ia.erro,
    indisponivel: ia.indisponivel,
    segundos: ia.segundos,
    sugestao: ia.sugestao,
    usada: ia.sugestao !== '' && dados.descricao === ia.sugestao,
    podeGerar: textoSuficiente(dados.descricao), // obstáculo: só depois que a pessoa contou
    gerar: () => ia.gerar(tipoAtual, dados),
    usar: () => mudar('descricao', ia.sugestao),
  }

  // Pop-up de quando o Gemini falha: motivo + plano B (texto padrão, que a pessoa revisa)
  const popupIa = {
    aberto: ia.popupAberto,
    motivo: ia.erro,
    usarPadrao: () => {
      mudar('descricao', descricaoPadrao(tipoAtual, dados.rua, dados.descricao))
      ia.fecharPopup()
    },
    tentarDeNovo: () => ia.gerar(tipoAtual, dados),
    fechar: ia.fecharPopup,
  }

  // Atualiza um campo do formulário. Ex.: mudar('rua', 'Rua X, 10')
  function mudar(campo, valor) {
    setDados({ ...dados, [campo]: valor })
  }

  function mudarTipo(valor) {
    if (editando) mudar('tipo', valor)
    else {
      setTipoNovo(valor)
      ia.aoMudarTipo(valor, dados)
    }
  }

  async function enviar(evento) {
    evento.preventDefault() // não deixa o navegador recarregar a página

    // No reporte novo entram também o tipo e a miniatura da foto (regra RN05).
    // A miniatura serve para validar e mostrar o card; o useReportes não a manda para a MockAPI.
    const daFoto = editando ? null : { tipo: tipoAtual, fotoUrl: foto.miniatura }
    const reporte = montarReporte(dados, local.coordenadas, daFoto)

    const encontrados = validarReporte(reporte, !editando)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    const deuCerto = await aoSalvar(reporte)
    if (!deuCerto) setEnviando(false)
  }

  return {
    dados,
    erros,
    enviando,
    tipoAtual,
    foto,
    caixasIa: ia.caixas,
    local,
    descricaoIa,
    popupIa,
    mudar,
    mudarTipo,
    enviar,
  }
}
