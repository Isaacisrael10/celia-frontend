/*
  Câmera REAL do poste (ESP32-CAM), pela API da equipe (INTEGRACAO.md seção 8.2).
  A câmera manda uma foto a cada 20 s para a API; a API guarda, analisa com o YOLO e,
  se houver buraco, o Gemini escreve o report. Aqui o app só LÊ o que já foi feito.
  Só faz a chamada HTTP: não sabe nada de React nem de tela.
*/
import { chamarApi } from './apiEquipe'
import { API_URL } from './config'

// Últimas capturas do poste, da mais nova para a mais velha
export function buscarCapturasPoste(poste, limite = 1) {
  return chamarApi(`/poste/capturas?poste=${encodeURIComponent(poste)}&limite=${limite}`)
}

// Reports automáticos dos postes, do mais novo para o mais velho
export function buscarReportesPoste(limite = 20) {
  return chamarApi(`/poste/reportes?limite=${limite}`)
}

// A API devolve só o caminho da foto (ex.: /poste/capturas/12/foto): junta com o endereço da API
export function enderecoDaFoto(caminho) {
  return API_URL + caminho
}
