/*
  Assistente de IA da equipe (INTEGRACAO.md seção 6).
  O app manda só texto para a API da equipe. Quem fala com o Gemini é a API:
  o app nunca guarda chave nenhuma.
*/
import { enviarJson } from './apiEquipe'

/*
  Pergunta sobre o trajeto.
  - contexto: { trechos, locais } montado por montarContexto (domain/assistente.js)
  Devolve { resposta, trechos_citados, locais_citados }
*/
export function perguntarTrajeto(pergunta, contexto) {
  return enviarJson('/assistente/trajeto', { pergunta, ...contexto })
}

/*
  Sugestão de descrição do reporte. A API nunca recebe a foto, só o resultado dela.
  Devolve { descricao_sugerida, revisar_antes_de_enviar }
*/
export function sugerirDescricao(resultadoIa, local, textoCidadao) {
  return enviarJson('/assistente/descricao', {
    resultado_ia: resultadoIa,
    local,
    texto_cidadao: textoCidadao,
  })
}
