/*
  Regras da descrição por IA no reporte do cidadão (sem React) [HU-22, RF21, RN05, RN07].
*/

// Obstáculo: o Gemini só escreve depois que o cidadão conta o que viu (pelo menos uma frase curta)
export const MINIMO_TEXTO_OBSTACULO = 10

// Ex.: textoSuficiente('carro na calçada') → true · textoSuficiente('oi') → false
export function textoSuficiente(texto) {
  return texto.trim().length >= MINIMO_TEXTO_OBSTACULO
}

/*
  Plano B: texto padrão para quando o Gemini não responde (os 3 modelos falharam ou a API
  está fora). Sai do próprio app, então funciona até sem internet. O cidadão revisa antes
  de enviar (RN07). Se ele já escreveu algo, o texto dele fica no fim, sem ser apagado.
  Ex.: descricaoPadrao('buraco', 'Rua A, 10', '') →
       "Há um buraco na calçada em Rua A, 10. Ele atrapalha a passagem de pessoas com ..."
*/
const TEXTOS_PADRAO = {
  buraco:
    'Há um buraco na calçada {onde}. Ele atrapalha a passagem de pessoas com deficiência ou mobilidade reduzida e pode causar quedas.',
  obstaculo:
    'Há um obstáculo bloqueando a calçada {onde}. Ele impede a passagem de pessoas com deficiência ou mobilidade reduzida.',
}

export function descricaoPadrao(tipo, local, textoCidadao = '') {
  const onde = local.trim() ? 'em ' + local.trim() : 'no local indicado no mapa'
  const padrao = (TEXTOS_PADRAO[tipo] || TEXTOS_PADRAO.buraco).replace('{onde}', onde)
  const texto = textoCidadao.trim()
  // Já tem o texto padrão no campo (a pessoa tocou duas vezes): não repete
  if (texto.includes(padrao)) return texto
  return texto ? padrao + ' ' + texto : padrao
}
