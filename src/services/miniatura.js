/*
  Gera uma miniatura da foto (imagem pequena em texto "data:image/jpeg;base64,...").
  Ela fica só na memória do navegador de quem enviou (useReportes): não vai para a MockAPI.
*/

// lado: tamanho máximo do lado maior, em pixels
export function gerarMiniatura(arquivo, lado = 240) {
  return new Promise((resolver, rejeitar) => {
    const imagem = new Image()
    const url = URL.createObjectURL(arquivo)

    imagem.onload = () => {
      // Reduz mantendo a proporção da foto
      const escala = Math.min(1, lado / Math.max(imagem.width, imagem.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(imagem.width * escala)
      canvas.height = Math.round(imagem.height * escala)
      canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolver(canvas.toDataURL('image/jpeg', 0.6))
    }
    imagem.onerror = () => {
      URL.revokeObjectURL(url)
      rejeitar(new Error('Não deu para abrir essa imagem.'))
    }
    imagem.src = url
  })
}
