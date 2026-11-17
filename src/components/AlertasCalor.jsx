import { useState } from 'react'
import { IconTemperatureSun, IconInfoSquare } from '@tabler/icons-react'
import CardAlertaCalor from './CardAlertaCalor'
import Filtros from './Filtros'
import { Vazio } from './Estados'
import { FILTROS_CALOR, NIVEIS_CALOR_PONTO, ordenarAlertas, filtrarAlertas, contarAlertas } from '../domain/prefeitura'
import './AlertasCalor.css'

/*
  Aba "Alertas de calor" do módulo Prefeitura (dados de EXEMPLO).
  Mostra o calor medido pelos postes nos pontos de ônibus, do mais grave para o mais leve.
  - alertas: lista de src/data/prefeitura.json (alertasCalor)
*/
export default function AlertasCalor({ alertas }) {
  // Interação: filtrar os alertas pelo nível
  const [filtro, setFiltro] = useState('todos')
  const visiveis = filtrarAlertas(ordenarAlertas(alertas), filtro)
  const contagem = contarAlertas(alertas)

  return (
    <div className="alertas-calor">
      {/* O que é o alerta e por que ele importa para quem tem mobilidade reduzida */}
      <section className="alertas-calor__explica cartao" aria-labelledby="alertas-calor-titulo">
        <h2 id="alertas-calor-titulo" className="alertas-calor__titulo">
          <IconTemperatureSun size={26} aria-hidden="true" />
          Alerta de calor no ponto
        </h2>
        <p>
          Para quem usa cadeira de rodas, muletas ou anda com dificuldade, o calor pesa mais. O caminho até o ponto já
          cansa, a espera costuma ser longa e nem todo ponto tem sombra. A cadeira e o corpo esquentam, e a pessoa chega ao
          trabalho esgotada, quando chega.
        </p>
        <p>
          Por isso o poste mede a temperatura e a umidade no ponto de ônibus e calcula o índice de calor (a sensação
          térmica). O app avisa quem tem esse ponto no trajeto, a partir do limite que a pessoa escolheu no Perfil (30, 32
          ou 35 °C), para ela sair em outro horário, trocar de ponto ou levar água. Aqui, a Prefeitura vê onde o calor
          aperta e pode priorizar cobertura, sombra e bebedouro.
        </p>
        <p>
          Chegar bem ao trabalho, todos os dias, também é o que ajuda a pessoa a continuar nele.
        </p>
      </section>

      {/* Legenda das cores: o número de alertas de cada nível */}
      <ul className="alertas-calor__legenda" aria-label="Alertas por nível">
        {Object.values(NIVEIS_CALOR_PONTO)
          .slice()
          .reverse()
          .map((nivel) => (
            <li key={nivel.id} style={{ '--cor-nivel': nivel.cor }}>
              <span className="alertas-calor__bolinha" aria-hidden="true">
                {nivel.icone}
              </span>
              <span>
                <strong>{nivel.nome}</strong> · a partir de {nivel.apartir} °C
              </span>
              <span className="alertas-calor__quantos">{contagem[nivel.id]}</span>
            </li>
          ))}
      </ul>

      <Filtros rotulo="Filtrar alertas por nível" opcoes={FILTROS_CALOR} valor={filtro} aoMudar={setFiltro} />

      {visiveis.length === 0 && <Vazio titulo="Nenhum alerta neste nível" />}

      <ul className="alertas-calor__lista">
        {visiveis.map((alerta) => (
          <CardAlertaCalor key={alerta.id} alerta={alerta} />
        ))}
      </ul>

      <p className="alertas-calor__nota">
        <IconInfoSquare size={20} aria-hidden="true" />
        Alertas de exemplo (dados simulados). Só o Poste 01 existe no protótipo; os outros mostram como seria com mais
        postes.
      </p>
    </div>
  )
}
