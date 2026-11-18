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
  - segundos: (opcional) tempo de espera, mostrado como "12 s" para a pessoa ver que não travou
  role="status": o leitor de tela anuncia o texto sem interromper a pessoa (RNF08).
  O contador fica fora da leitura (aria-hidden): senão o leitor de tela falaria a cada segundo.
*/
export function CardCarregando({ titulo, texto, linhas = false, segundos }) {
  return (
    <div className="estado cartao estado--card-ia" role="status">
      <span className="estado__titulo">
        <span className="estado__bolinhas" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {titulo}
        {typeof segundos === 'number' && (
          <span className="estado__cronometro" aria-hidden="true">
            {segundos} s
          </span>
        )}
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

/*
  Mensagem de erro amigável, com o botão "Tentar de novo" quando faz sentido.
  role="alert": o leitor de tela lê a mensagem assim que ela aparece.
  - mensagem: o texto já em português simples
  - aoTentarDeNovo: (opcional) função do botão; sem ela, o botão não aparece
*/
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

/*
  Aviso de lista vazia (ex.: nenhum reporte com esse filtro).
  - Icone: (opcional) ícone do Tabler · titulo: a frase principal · texto: (opcional) explicação
*/
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
