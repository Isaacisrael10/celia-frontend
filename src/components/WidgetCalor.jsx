import BadgeFaixa from './BadgeFaixa'
import { FAIXAS } from '../domain/faixas'
import { textoAtualizado } from '../domain/poste'
import './WidgetCalor.css'

// Motivos do ESP32 que envolvem calor: 2 = calor · 3 = calçada e calor
const MOTIVOS_DE_CALOR = [2, 3]

/*
  Widget de calor no topo do mapa: "Calor: Atenção · 34 °C".
  - poste: o que o useStatusPoste devolve
*/
export default function WidgetCalor({ poste }) {
  const { leitura, recente, faixa, motivo, agora, carregando, erro } = poste

  // Sem leitura que valha: mostra "Sem dados" com o motivo em texto
  if (!recente) {
    let detalhe = 'Sem leitura nos últimos 10 minutos.'
    if (carregando) detalhe = 'Lendo o poste…'
    else if (erro) detalhe = erro

    return (
      <section className="widget-calor" aria-label="Calor agora">
        <BadgeFaixa faixa={FAIXAS.semDados} tamanho={40} />
        <span className="widget-calor__textos">
          <span className="widget-calor__titulo">Calor: sem dados</span>
          <span className="widget-calor__detalhe">{detalhe}</span>
        </span>
      </section>
    )
  }

  // O calor só herda a faixa do poste quando o motivo é calor; senão está Normal
  const faixaCalor = MOTIVOS_DE_CALOR.includes(motivo) ? faixa : FAIXAS.normal
  const graus = leitura.indiceCalor !== null ? Math.round(leitura.indiceCalor) + ' °C' : ''

  return (
    <section className="widget-calor" aria-label="Calor agora">
      <BadgeFaixa faixa={faixaCalor} tamanho={40} />
      <span className="widget-calor__textos">
        <span className="widget-calor__titulo">
          Calor: {faixaCalor.nome}
          {graus && ' · ' + graus}
        </span>
        <span className="widget-calor__detalhe">
          Sensação térmica no ponto de ônibus · {textoAtualizado(leitura.data, agora).toLowerCase()}
        </span>
      </span>
    </section>
  )
}
