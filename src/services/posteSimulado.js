/*
  Câmera SIMULADA do poste.
  Na versão real, o ESP32-CAM tira a foto e roda a IA ali mesmo, no poste.
  No protótipo não temos a câmera: as "capturas" são fotos já baixadas (public/poste/)
  e a API da equipe roda o YOLO no lugar do poste.

  Só faz trabalho de rede: não sabe nada de React nem de tela.
*/

/*
  Busca a imagem de um quadro e devolve como arquivo, igual a uma foto escolhida no celular.
  Assim ela vai para a mesma rota /analisar da API.
  Ex.: await arquivoDoQuadro({ id: 'quadro-2', src: '/poste/quadro-2.jpg' })
*/
export async function arquivoDoQuadro(quadro) {
  const resposta = await fetch(quadro.src)
  if (!resposta.ok) {
    throw new Error('Não achamos a imagem da câmera simulada.')
  }
  const conteudo = await resposta.blob()
  return new File([conteudo], quadro.id + '.jpg', { type: conteudo.type || 'image/jpeg' })
}
