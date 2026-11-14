import { useEffect, useState } from 'react'
import { lerSalvo, salvar } from '../services/armazenamento'

const CHAVE = 'celia-acessibilidade'

// Ajustes de fábrica
const PADRAO = { texto: 'normal', menosMovimento: false, maisContraste: false }

// Tamanhos de texto que a pessoa pode escolher no Perfil
export const TAMANHOS_TEXTO = { normal: 'Normal', grande: 'Grande', maior: 'Maior' }

// Os ajustes ficam salvos como um texto JSON. Se o texto estiver estragado, voltam os de fábrica.
function ajustesSalvos() {
  try {
    return { ...PADRAO, ...JSON.parse(lerSalvo(CHAVE)) }
  } catch {
    return PADRAO
  }
}

/*
  Custom hook dos ajustes de acessibilidade (tela Perfil).
  - guarda os ajustes no estado do React e no navegador
  - escreve os ajustes no <html> (data-texto, data-movimento, data-contraste);
    o CSS lê esses atributos e muda o app inteiro (tokens.css e base.css)
  Ex.: const { ajustes, mudar } = useAcessibilidade()
       mudar('texto', 'grande')
*/
export function useAcessibilidade() {
  const [ajustes, setAjustes] = useState(ajustesSalvos)

  useEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.texto = ajustes.texto
    raiz.dataset.movimento = ajustes.menosMovimento ? 'reduzido' : 'normal'
    raiz.dataset.contraste = ajustes.maisContraste ? 'alto' : 'normal'
    salvar(CHAVE, JSON.stringify(ajustes))
  }, [ajustes])

  // Muda um ajuste. Ex.: mudar('maisContraste', true)
  function mudar(campo, valor) {
    setAjustes({ ...ajustes, [campo]: valor })
  }

  return { ajustes, mudar }
}
