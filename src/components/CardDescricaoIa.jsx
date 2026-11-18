import { IconSparkles, IconCheck, IconRefresh, IconInfoSquare } from '@tabler/icons-react'
import { CardCarregando, MensagemErro } from './Estados'
import './CardDescricaoIa.css'

/*
  Card da descrição sugerida pela IA para a Prefeitura [HU-05, HU-22, RF09, RF21, RN05, RN07].
  O que aparece depende da etapa (useDescricaoIa):
  - buraco: "Conferindo a foto" (YOLO) → se achou buraco, "Gerando sua descrição" (Gemini) → texto
            → se não achou, avisa e não gera (a pessoa pode escrever com as próprias palavras)
  - obstáculo: pede para a pessoa contar o que viu e mostra o botão "Gerar descrição com IA"
  Os cards de espera mostram os segundos passando.
  RN07: o texto só vai para o reporte se a pessoa tocar em "Usar esta descrição",
  e ela ainda pode corrigir no campo "O que você viu?" antes de enviar.

  - ia: o que o useFormReporte devolve em "descricaoIa"
    { etapa, carregando, erro, indisponivel, segundos, sugestao, usada, podeGerar, gerar, usar }
*/
export default function CardDescricaoIa({ ia }) {
  if (ia.etapa === 'conferindo') {
    return (
      <CardCarregando
        titulo="Conferindo a foto com a IA de visão…"
        texto="Procurando buraco na calçada. Só se ela achar, a IA escreve a descrição."
        segundos={ia.segundos}
      />
    )
  }

  if (ia.carregando) {
    return (
      <CardCarregando
        titulo="Gerando sua descrição para a Prefeitura…"
        texto="A IA escreve a partir do tipo de problema e do local. Você revisa antes de enviar."
        segundos={ia.segundos}
        linhas
      />
    )
  }

  // Plano B: a API não está no ar (ex.: app publicado). Nunca mostra erro cru.
  if (ia.etapa === 'visaoFora' || (ia.erro && ia.indisponivel)) {
    return (
      <p className="descricao-ia__plano-b">
        <IconInfoSquare size={22} aria-hidden="true" />
        A análise por IA roda na demonstração local. Escreva com suas palavras.
      </p>
    )
  }

  if (ia.etapa === 'semBuraco') {
    return (
      <div className="cartao descricao-ia descricao-ia--info" role="status">
        <p className="descricao-ia__titulo">
          <IconInfoSquare size={22} aria-hidden="true" />A IA não viu buraco nesta foto
        </p>
        <p className="descricao-ia__texto">
          Por isso ela não escreveu a descrição. Se for mesmo um buraco, troque a foto ou escreva com
          suas palavras em “O que você viu?”. A IA às vezes não vê buracos pequenos.
        </p>
      </div>
    )
  }

  // A API respondeu com erro (o pop-up já mostrou o motivo; aqui fica o botão para tentar de novo)
  if (ia.erro) {
    return <MensagemErro mensagem={ia.erro} aoTentarDeNovo={ia.gerar} />
  }

  // Obstáculo, ainda sem texto da IA: a pessoa conta o que viu e pede a descrição
  if (ia.etapa === 'obstaculo' && !ia.sugestao) {
    return (
      <div className="cartao descricao-ia descricao-ia--info">
        <p className="descricao-ia__titulo">
          <IconSparkles size={22} aria-hidden="true" />
          Descrição com IA
        </p>
        <p className="descricao-ia__texto">
          Conte em “O que você viu?” o que está bloqueando a calçada. Depois a IA organiza o seu texto
          para a Prefeitura.
        </p>
        <div className="descricao-ia__acoes">
          <button
            type="button"
            className="botao botao--secundario botao--pequeno"
            onClick={ia.gerar}
            disabled={!ia.podeGerar}
          >
            <IconSparkles size={20} aria-hidden="true" />
            Gerar descrição com IA
          </button>
          {!ia.podeGerar && <span className="descricao-ia__aviso">Escreva pelo menos uma frase curta.</span>}
        </div>
      </div>
    )
  }

  if (!ia.sugestao) return null

  return (
    <section className="cartao descricao-ia" aria-labelledby="titulo-descricao-ia">
      <h3 className="descricao-ia__titulo" id="titulo-descricao-ia">
        <IconSparkles size={22} aria-hidden="true" />
        Descrição para a Prefeitura
      </h3>
      <p className="descricao-ia__texto">{ia.sugestao}</p>
      <p className="descricao-ia__aviso">Sugerida pela IA. Confira se está certo antes de usar.</p>

      <div className="descricao-ia__acoes">
        <button type="button" className="botao botao--secundario botao--pequeno" onClick={ia.usar} disabled={ia.usada}>
          <IconCheck size={20} aria-hidden="true" />
          {ia.usada ? 'Descrição em uso' : 'Usar esta descrição'}
        </button>
        <button type="button" className="acao-texto" onClick={ia.gerar}>
          <IconRefresh size={18} aria-hidden="true" />
          Gerar outra
        </button>
      </div>
    </section>
  )
}
