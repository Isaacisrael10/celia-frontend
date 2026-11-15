import { useState } from 'react'
import dados from '../data/prefeitura.json'
import { filtrarPorOrigem, ordenarRecentes, contarPorOrigem } from '../domain/prefeitura'

/*
  Custom hook da caixa de entrada da Prefeitura.
  - Começa com reportes de EXEMPLO (src/data/prefeitura.json), para a lista não abrir vazia.
  - Os reportes que a câmera do poste envia na demonstração entram no topo (adicionar).
  Ficam só na memória da tela: ao recarregar a página, voltam os de exemplo.
*/
export function useReportesPrefeitura() {
  const [reportes, setReportes] = useState(dados.reportes)
  // Interação: filtrar por origem (todos, postes ou cidadãos)
  const [filtro, setFiltro] = useState('todos')

  // Forma com função: funciona mesmo chamada de dentro da ronda da câmera (que é assíncrona)
  function adicionar(reporte) {
    setReportes((atuais) => [reporte, ...atuais])
  }

  const ordenados = ordenarRecentes(reportes)
  const visiveis = filtrarPorOrigem(ordenados, filtro)
  const novos = reportes.filter((r) => r.novo).length

  return { reportes: ordenados, visiveis, filtro, setFiltro, contagem: contarPorOrigem(reportes), novos, adicionar }
}
