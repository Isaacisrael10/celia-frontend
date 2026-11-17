import NomeCelia from './NomeCelia'

/*
  Para textos que vêm dos arquivos de dados (src/data/*.json):
  troca cada "C.E.L.I.A." do texto pelo nome com o "I.A." em azul.
  Ex.: comNomeCelia('A C.E.L.I.A. mostra...') → ['A ', <NomeCelia />, ' mostra...']
*/
export function comNomeCelia(texto) {
  if (typeof texto !== 'string' || !texto.includes('C.E.L.I.A.')) return texto
  return texto.split('C.E.L.I.A.').flatMap((pedaco, i) => (i === 0 ? [pedaco] : [<NomeCelia key={i} />, pedaco]))
}
