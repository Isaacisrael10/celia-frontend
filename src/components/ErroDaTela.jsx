import { Component } from 'react'
import { MensagemErro } from './Estados'
import './Estados.css'

/*
  Rede de segurança das telas [RNF09].
  Se algum componente quebrar ao desenhar (um dado que veio num formato inesperado, por exemplo),
  o React apaga o app inteiro e a pessoa fica com a tela em branco.
  Este componente "segura" o erro: só a tela que quebrou vira uma mensagem amigável,
  e a navegação continua funcionando.

  Por que é uma classe e não uma função com hooks: o React só oferece esse recurso
  (getDerivedStateFromError) em componentes de classe. É o único do app.

  - children: a tela que fica protegida
  Uso: <ErroDaTela key={endereco}><Outlet /></ErroDaTela>
  O "key" com o endereço faz a proteção recomeçar do zero quando a pessoa troca de tela.
*/
export default class ErroDaTela extends Component {
  constructor(props) {
    super(props)
    this.state = { quebrou: false }
    this.tentarDeNovo = this.tentarDeNovo.bind(this)
  }

  // O React chama isto quando um componente dentro deste quebra: guardamos que quebrou
  static getDerivedStateFromError() {
    return { quebrou: true }
  }

  // "Tentar de novo": desenha a tela outra vez
  tentarDeNovo() {
    this.setState({ quebrou: false })
  }

  render() {
    if (this.state.quebrou) {
      return (
        <main className="app__conteudo erro-da-tela" id="conteudo" tabIndex={-1}>
          <MensagemErro
            mensagem="Esta tela teve um problema. Tente de novo ou escolha outra parte do app no menu."
            aoTentarDeNovo={this.tentarDeNovo}
          />
          {/* Link simples (sem hooks): funciona mesmo com a tela quebrada */}
          <a className="botao botao--secundario botao--pequeno" href="/menu">
            Ir para o Menu
          </a>
        </main>
      )
    }
    return this.props.children
  }
}
