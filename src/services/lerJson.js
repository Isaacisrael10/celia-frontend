/*
  Lê o corpo da resposta como JSON, sem deixar erro técnico chegar na tela.
  Às vezes a resposta chega com status 200 mas não é JSON: Wi-Fi público que pede login
  devolve uma página HTML, ou a conexão cai no meio. Sem isto, a tela mostraria
  "Unexpected token '<'..." para a pessoa.
  - resposta: o que o fetch devolveu
  - mensagem: o texto amigável para o erro
  Ex.: const dados = await lerJson(resposta, 'Não deu para ler o poste agora.')
*/
export async function lerJson(resposta, mensagem) {
  try {
    return await resposta.json()
  } catch {
    throw new Error(mensagem)
  }
}
