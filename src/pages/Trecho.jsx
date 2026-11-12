import { useParams, useNavigate } from 'react-router-dom'
import { IconArrowsHorizontal, IconTemperature, IconDroplet, IconSun, IconMessageReport } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import BadgeFaixa from '../components/BadgeFaixa'
import { MensagemErro } from '../components/Estados'
import HistoricoPoste from '../components/HistoricoPoste'
import { useTrechos } from '../hooks/useTrechos'
import { rotuloCompleto } from '../domain/faixas'
import { textoAtualizado } from '../domain/poste'
import { meioDoTrecho } from '../domain/trechos'
import './Trecho.css'

// Mostra o número arredondado com a unidade, ou "—" se o sensor não mandou
function valor(numero, unidade) {
  return numero === null ? '—' : Math.round(numero) + ' ' + unidade
}

export default function Trecho() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trechos, poste } = useTrechos()
  const trecho = trechos.find((t) => t.id === id)

  if (!trecho) {
    return (
      <>
        <Cabecalho titulo="Trecho" voltar />
        <main className="app__conteudo">
          <MensagemErro mensagem="Não encontramos este trecho." />
        </main>
      </>
    )
  }

  const { faixa, motivo, aoVivo } = trecho
  const leitura = poste.leitura
  const mostrarMedidas = aoVivo && poste.recente

  // Abre o formulário de reporte já com a rua e o ponto do trecho
  function reportar() {
    const [lng, lat] = meioDoTrecho(trecho)
    navigate('/reportar', { state: { rua: trecho.rua + ', ', lat, lng } })
  }

  return (
    <>
      <Cabecalho titulo="Trecho" voltar />
      <main className="app__conteudo">
        <div>
          <h2 className="trecho__rua">{trecho.rua}</h2>
          <p className="trecho__parte">Parte {trecho.parte} · Grajaú</p>
        </div>

        <div className="trecho__faixa">
          <BadgeFaixa faixa={faixa} tamanho={56} />
          {/* Ex.: "Perigo · buraco" (faixa + motivo juntos) */}
          <span className="trecho__faixa-nome">{rotuloCompleto(faixa, motivo)}</span>
        </div>

        <p className="trecho__explicacao">{faixa.explicacao}</p>

        {/* Origem do dado: ao vivo (poste) ou exemplo (simulado) */}
        <p className="trecho__origem">
          {aoVivo
            ? 'Medido ao vivo pelo poste do ponto de ônibus. ' +
              (leitura ? textoAtualizado(leitura.data, poste.agora) + '.' : 'Ainda sem leitura.')
            : 'Este trecho ainda não tem poste. A faixa mostrada é um exemplo (dado simulado).'}
        </p>

        {mostrarMedidas && (
          <div className="trecho__medidas">
            <Medida Icone={IconArrowsHorizontal} nome="Distância livre" texto={valor(leitura.distancia, 'cm')} />
            <Medida Icone={IconSun} nome="Índice de calor" texto={valor(leitura.indiceCalor, '°C')} />
            <Medida Icone={IconTemperature} nome="Temperatura" texto={valor(leitura.temperatura, '°C')} />
            <Medida Icone={IconDroplet} nome="Umidade" texto={valor(leitura.umidade, '%')} />
          </div>
        )}

        {aoVivo && <HistoricoPoste historico={poste.historico} />}

        <button className="botao botao--secundario botao--seta" onClick={reportar}>
          Reportar problema aqui
          <IconMessageReport size={24} aria-hidden="true" />
        </button>
      </main>
    </>
  )
}

function Medida({ Icone, nome, texto }) {
  return (
    <div className="trecho__medida">
      <span className="trecho__medida-nome">
        <Icone size={20} aria-hidden="true" />
        {nome}
      </span>
      <span className="trecho__medida-valor">{texto}</span>
    </div>
  )
}
