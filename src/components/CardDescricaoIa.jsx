import { IconSparkles, IconCheck, IconRefresh, IconInfoSquare } from '@tabler/icons-react'
import { CardCarregando, MensagemErro } from './Estados'
import { MAX_TENTATIVAS } from '../hooks/useChamadaApi'
import './CardDescricaoIa.css'

/*
  Card da descrição sugerida pela IA para a Prefeitura [HU-22, RF21, RN05, RN07].
  Aparece sozinho depois que a IA de visão (YOLO) termina de analisar a foto:
  o Gemini escreve o texto a partir do resultado da análise e do local.
  RN07: o texto só vai para o reporte se a pessoa tocar em "Usar esta descrição",
  e ela ainda pode corrigir no campo "O que você viu?" antes de enviar.

  - ia: o que o useFormReporte devolve em "descricaoIa"
    { carregando, erro, indisponivel, tentativa, aviso, sugestao, usada, gerar, usar }
*/
export default function CardDescricaoIa({ ia }) {
  if (ia.carregando) {
    return (
      <CardCarregando
        titulo="Gerando sua descrição para a Prefeitura…"
        texto={
          ia.tentativa > 0
            ? `${ia.aviso} Tentando de novo sozinho (${ia.tentativa} de ${MAX_TENTATIVAS})…`
            : 'A IA escreve a partir da análise da foto. Você revisa antes de enviar.'
        }
        linhas
      />
    )
  }

  // Plano B: a API não está no ar (ex.: app publicado). Nunca mostra erro cru.
  if (ia.erro && ia.indisponivel) {
    return (
      <p className="descricao-ia__plano-b">
        <IconInfoSquare size={22} aria-hidden="true" />
        A descrição por IA roda na demonstração local. Escreva com suas palavras.
      </p>
    )
  }

  // A API respondeu com erro (ex.: Gemini fora mesmo depois das 3 tentativas)
  if (ia.erro) {
    return <MensagemErro mensagem={ia.erro} aoTentarDeNovo={ia.gerar} />
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
