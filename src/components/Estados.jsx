import { IconRefresh, IconInfoSquare } from '@tabler/icons-react'
import './Estados.css'

/*
  Estados que toda tela precisa ter: carregando, erro e vazio.
*/

export function Carregando({ texto = 'Carregando…' }) {
  return (
    <p className="estado" role="status">
      {texto}
    </p>
  )
}

export function MensagemErro({ mensagem, aoTentarDeNovo }) {
  return (
    <div className="estado estado--caixa" role="alert">
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
