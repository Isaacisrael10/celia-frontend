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
