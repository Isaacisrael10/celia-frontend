/*
  Mini trilha de IA (INTEGRACAO.md seção 5).
  O conteúdo é da API do João; o app só monta a tela.
*/
import { chamarApi } from './apiEquipe'

// { titulo, observacao, licoes: [...] }
export function buscarTrilha() {
  return chamarApi('/trilha')
}

// Uma lição: { id, titulo, duracao_minutos, paragrafos, exemplo_no_trabalho, pratique }
export function buscarLicao(id) {
  return chamarApi('/trilha/' + encodeURIComponent(id))
}
