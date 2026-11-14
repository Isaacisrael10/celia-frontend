import { useEffect, useState } from 'react'
import { lerSalvo, salvar } from '../services/armazenamento'

const CHAVE = 'celia-tema'

// Descobre o tema inicial: o que a pessoa escolheu antes ou, se não escolheu, o do sistema
function temaInicial() {
  const salvo = lerSalvo(CHAVE)
  if (salvo === 'claro' || salvo === 'escuro') return salvo

  const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
  return sistemaEscuro ? 'escuro' : 'claro'
}

/*
  Custom hook do modo claro/escuro (Web Development: modo Light/Dark).
  - guarda o tema no estado do React
  - coloca data-tema="claro|escuro" no <html> (manipulação do DOM): o CSS troca as cores por esse atributo
  - salva a escolha no navegador
  Ex.: const { escuro, alternarTema } = useTema()
*/
export function useTema() {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    salvar(CHAVE, tema)
  }, [tema])

  function alternarTema() {
    setTema(tema === 'escuro' ? 'claro' : 'escuro')
  }

  return { tema, escuro: tema === 'escuro', alternarTema }
}
