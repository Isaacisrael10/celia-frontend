import { useState } from 'react'
import { IconPencil, IconTrash, IconStairsDown, IconBarrierBlock, IconCheck, IconQuestionMark } from '@tabler/icons-react'
import { TIPOS, SITUACOES, formatarData } from '../domain/reportes'
import './CardReporte.css'

// Ícone de cada tipo de reporte
const ICONES = {
  buraco: IconStairsDown,
  obstaculo: IconBarrierBlock,
  livre: IconCheck,
  nao_analisada: IconQuestionMark,
}

/*
  Um item da lista de reportes, com Editar e Excluir.
  Excluir pede confirmação dentro do próprio card.
  A situação é desenhada como um caminho de 3 bolinhas: Aberto → Enviado → Resolvido.
*/
export default function CardReporte({ reporte, aoEditar, aoExcluir }) {
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const Icone = ICONES[reporte.tipo] || IconQuestionMark
  // Em que passo o reporte está: 0 aberto · 1 enviado · 2 resolvido
  const passos = Object.keys(SITUACOES)
  const passoAtual = Math.max(0, passos.indexOf(reporte.status))

  async function confirmarExclusao() {
    setExcluindo(true)
    const deuCerto = await aoExcluir(reporte.id)
    // Se der certo o card some da lista; se der errado, volta ao normal
    if (!deuCerto) {
      setExcluindo(false)
      setConfirmando(false)
    }
  }

  return (
    <li className="card-reporte cartao">
      <div className="card-reporte__topo">
        {reporte.fotoUrl ? (
          <img className="card-reporte__foto" src={reporte.fotoUrl} alt="" />
        ) : (
          <span className="card-reporte__icone" aria-hidden="true">
            <Icone size={24} />
          </span>
        )}
        <span className="card-reporte__textos">
          <span className="card-reporte__tipo">{TIPOS[reporte.tipo] || 'Reporte'}</span>
          <span>{reporte.rua}</span>
          {reporte.descricao && <span className="card-reporte__descricao">{reporte.descricao}</span>}
          <span className="card-reporte__data">{formatarData(reporte.criadoEm)}</span>
        </span>
      </div>

      <span className="card-reporte__situacao">
        {/* Só desenho: as bolinhas até o passo atual ficam cheias. O texto ao lado diz a mesma coisa. */}
        <span className="card-reporte__passos" aria-hidden="true">
          {passos.map((passo, i) => (
            <span key={passo} className={'card-reporte__passo' + (i <= passoAtual ? ' card-reporte__passo--feito' : '')} />
          ))}
        </span>
        Situação: {SITUACOES[reporte.status] || 'Aberto'}
      </span>

      {confirmando ? (
        <div className="card-reporte__confirmar" role="alertdialog" aria-label="Confirmar exclusão">
          <span className="card-reporte__pergunta">Excluir este reporte? Não dá para desfazer.</span>
          <div className="card-reporte__botoes">
            <button className="botao botao--grafite botao--pequeno" onClick={confirmarExclusao} disabled={excluindo}>
              {excluindo ? 'Excluindo…' : 'Sim, excluir'}
            </button>
            <button className="botao botao--secundario botao--pequeno" onClick={() => setConfirmando(false)} disabled={excluindo}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="card-reporte__acoes">
          <button className="acao-texto" onClick={() => aoEditar(reporte)}>
            <IconPencil size={20} aria-hidden="true" />
            Editar<span className="so-leitor"> reporte da {reporte.rua}</span>
          </button>
          <button className="acao-texto acao-texto--grafite" onClick={() => setConfirmando(true)}>
            <IconTrash size={20} aria-hidden="true" />
            Excluir<span className="so-leitor"> reporte da {reporte.rua}</span>
          </button>
        </div>
      )}
    </li>
  )
}
