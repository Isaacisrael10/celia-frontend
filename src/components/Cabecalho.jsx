import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import BotaoMenu from './BotaoMenu'
import { useTituloDaPagina } from '../hooks/useTituloDaPagina'
import './Cabecalho.css'

/*
  Topo de cada tela: botão de voltar (opcional), título e o símbolo que abre o menu.
  No celular é uma barra de vidro que fica presa no topo ao rolar.
  Em telas largas vira só um título grande (o símbolo já está no trilho lateral).
  - titulo: texto do h1 (também vai para a aba do navegador)
  - voltar: true mostra o botão de voltar
  - aoVoltar: (opcional) o que fazer ao voltar. Sem ele, volta para a tela anterior.
  O título fica sempre centralizado (padrão de todas as telas).
*/
export default function Cabecalho({ titulo, voltar = false, aoVoltar }) {
  const navigate = useNavigate()
  useTituloDaPagina(titulo)

  return (
    <header className={'cabecalho vidro' + (voltar ? '' : ' cabecalho--sem-voltar')}>
      {voltar && (
        <button className="botao-icone" onClick={aoVoltar || (() => navigate(-1))} aria-label="Voltar">
          <IconArrowLeft size={24} aria-hidden="true" />
        </button>
      )}
      {/* tabIndex -1: o título pode receber o foco ao trocar de tela (ver Layout em App.jsx) */}
      <h1 className="cabecalho__titulo" tabIndex={-1}>
        {titulo}
      </h1>
      <BotaoMenu />
    </header>
  )
}
