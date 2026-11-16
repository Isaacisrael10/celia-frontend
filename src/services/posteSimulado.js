/*
  Câmera SIMULADA do poste.
  Na versão real, o ESP32-CAM tira a foto a cada 20 s e envia à API, que roda a IA (RF09, RF22).
  No protótipo não temos a câmera: as "capturas" são fotos já baixadas (public/poste/)
  e o app manda essas fotos para a mesma API.

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
