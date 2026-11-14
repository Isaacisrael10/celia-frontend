import { IconRefresh, IconInfoSquare } from '@tabler/icons-react'
import './Estados.css'

/*
  Estados que toda tela precisa ter: carregando, erro e vazio.
*/

export function Carregando({ texto = 'Carregando…' }) {
  return (
    <p className="estado estado--carregando" role="status">
      {/* Três bolinhas ligadas que acendem uma depois da outra (só desenho) */}
      <span className="estado__bolinhas" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {texto}
    </p>
  )
}

/*
  Card de espera para chamadas demoradas à IA (foto, descrição e assistente).
  Usa as mesmas bolinhas ligadas do Carregando; o texto diz o que está acontecendo.
  - linhas: true desenha linhas de texto "se formando" (para quando a IA está escrevendo)
  role="status": o leitor de tela anuncia o texto sem interromper a pessoa (RNF08).
*/
export function CardCarregando({ titulo, texto, linhas = false }) {
  return (
    <div className="estado cartao estado--card-ia" role="status">
      <span className="estado__titulo">
        <span className="estado__bolinhas" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {titulo}
      </span>
      {texto && <span className="estado__texto">{texto}</span>}
      {linhas && (
        <span className="estado__linhas" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
    </div>
  )
}

export function MensagemErro({ mensagem, aoTentarDeNovo }) {
  return (
    <div className="estado cartao" role="alert">
      <span className="estado__titulo">
        <IconInfoSquare size={24} aria-hidden="true" />
        {mensagem}
      </span>
      {aoTentarDeNovo && (
        <button className="botao botao--secundario botao--pequeno" onClick={aoTentarDeNovo}>
          <IconRefresh size={20} aria-hidden="true" />
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export function Vazio({ Icone, titulo, texto }) {
  return (
    <div className="estado">
      {Icone && (
        <span className="estado__icone" aria-hidden="true">
          <Icone size={28} />
        </span>
      )}
      <span className="estado__titulo estado__titulo--grande">{titulo}</span>
      {texto && <span className="estado__texto">{texto}</span>}
    </div>
  )
}
