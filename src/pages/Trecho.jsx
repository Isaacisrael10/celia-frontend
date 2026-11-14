import { useParams, useNavigate } from 'react-router-dom'
import { IconArrowsHorizontal, IconTemperature, IconDroplet, IconSun, IconMessageReport } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import BadgeFaixa from '../components/BadgeFaixa'
import Medida from '../components/Medida'
import { MensagemErro } from '../components/Estados'
import HistoricoPoste from '../components/HistoricoPoste'
import { useTrechos } from '../hooks/useTrechos'
import { rotuloCompleto } from '../domain/faixas'
import { textoAtualizado, textoDaMedida, situacaoDaCalcada, faixaDoCalor } from '../domain/poste'
import { meioDoTrecho } from '../domain/trechos'
import './Trecho.css'

/*
  Detalhe de um trecho: faixa e motivo, de onde veio o dado (poste ao vivo ou exemplo simulado),
  as medidas do poste e o atalho para reportar um problema ali.
*/
export default function Trecho() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trechos, poste } = useTrechos()
  const trecho = trechos.find((t) => t.id === id)

  if (!trecho) {
    return (
      <>
        <Cabecalho titulo="Trecho" voltar />
        <main id="conteudo" tabIndex={-1} className="app__conteudo">
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
      <main id="conteudo" tabIndex={-1} className="app__conteudo trecho">
        {/* Resumo do trecho num card: rua, faixa (com motivo), explicação e a ação de reportar */}
        <section className="trecho__resumo cartao" aria-labelledby="trecho-rua">
          <div>
            <h2 id="trecho-rua" className="trecho__rua">
              {trecho.rua}
            </h2>
            <p className="trecho__parte">Parte {trecho.parte} · Grajaú</p>
          </div>

          <div className="trecho__faixa">
            <BadgeFaixa faixa={faixa} tamanho={48} />
            {/* Ex.: "Perigo · buraco" (faixa + motivo juntos) */}
            <span className="trecho__faixa-nome">{rotuloCompleto(faixa, motivo)}</span>
          </div>

          <p className="trecho__explicacao">{faixa.explicacao}</p>

          {/* Origem do dado: ao vivo (poste) ou exemplo (simulado) */}
          <p className="apoio">
            {aoVivo
              ? 'Medido ao vivo pelo poste do ponto de ônibus. ' +
                (leitura ? textoAtualizado(leitura.data, poste.agora) + '.' : 'Ainda sem leitura.')
              : 'Este trecho ainda não tem poste. A faixa mostrada é um exemplo (dado simulado).'}
          </p>

          <button className="botao botao--secundario botao--seta" onClick={reportar}>
            Reportar problema aqui
            <IconMessageReport size={24} aria-hidden="true" />
          </button>
        </section>

        {mostrarMedidas && (
          <div className="trecho__medidas">
            <Medida
              Icone={IconArrowsHorizontal}
              nome="Distância livre"
              texto={textoDaMedida(leitura.distancia, 'cm')}
              detalhe={situacaoDaCalcada(leitura.distancia)}
            />
            <Medida
              Icone={IconSun}
              nome="Índice de calor"
              texto={textoDaMedida(leitura.indiceCalor, '°C')}
              detalhe={faixaDoCalor(leitura.indiceCalor) ? 'Calor: ' + faixaDoCalor(leitura.indiceCalor).nome : ''}
            />
            <Medida Icone={IconTemperature} nome="Temperatura" texto={textoDaMedida(leitura.temperatura, '°C')} />
            <Medida Icone={IconDroplet} nome="Umidade" texto={textoDaMedida(leitura.umidade, '%')} />
          </div>
        )}

        {aoVivo && <HistoricoPoste historico={poste.historico} />}
      </main>
    </>
  )
}
