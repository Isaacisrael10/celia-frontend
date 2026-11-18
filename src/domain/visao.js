/*
  Regras da IA de visão (sem React).
  Usadas pela câmera do poste (tela Prefeitura) e, desde 18/11, pelo reporte do cidadão:
  no tipo buraco, o YOLO confere a foto antes do Gemini escrever (useDescricaoIa).
*/

/*
  Tira da resposta da API a lista de caixas para desenhar sobre a foto.
  A API só detecta buracos e manda as caixas em "caixas_buracos" (sem o nome da classe),
  então colocamos a classe "buraco" em cada uma. "caixas" é o nome antigo, aceito por garantia.
*/
export function caixasDaResposta(resposta) {
  const lista = resposta.caixas_buracos || resposta.caixas
  if (!Array.isArray(lista)) return []
  return lista.map((caixa) => ({ classe: 'buraco', ...caixa }))
}

/*
  Converte uma caixa da IA em porcentagens da foto, para desenhar por cima dela.
  Funciona com as duas possibilidades:
  - coordenadas em pixels (ex.: x1 = 120), que é como a API manda hoje
  - coordenadas normalizadas, de 0 a 1 (ex.: x1 = 0.25)
*/
export function caixaEmPorcentagem(caixa, largura, altura) {
  const normalizada = [caixa.x1, caixa.y1, caixa.x2, caixa.y2].every((v) => v >= 0 && v <= 1)
  const w = normalizada ? 1 : largura
  const h = normalizada ? 1 : altura

  return {
    left: (caixa.x1 / w) * 100,
    top: (caixa.y1 / h) * 100,
    width: ((caixa.x2 - caixa.x1) / w) * 100,
    height: ((caixa.y2 - caixa.y1) / h) * 100,
  }
}

// Ex.: { classe: "buraco", confianca: 0.87 } → "Buraco 87%"
export function rotuloDaCaixa(caixa) {
  const nome = caixa.classe ? caixa.classe.charAt(0).toUpperCase() + caixa.classe.slice(1) : 'Objeto'
  const confianca = typeof caixa.confianca === 'number' ? ' ' + Math.round(caixa.confianca * 100) + '%' : ''
  return nome + confianca
}
