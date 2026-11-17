import { IconCheck } from '@tabler/icons-react'
import { ETAPAS_POSTE, estadoDasEtapas } from '../domain/prefeitura'
import './EtapasPoste.css'

// Texto curto do estado, para quem não enxerga a cor da bolinha (e para o leitor de tela)
const NOME_DO_ESTADO = { espera: 'Aguardando', ativa: 'Agora', feita: 'Feito', pulada: 'Não precisou' }

/*
  O caminho do reporte automático do poste, em etapas que acendem uma depois da outra.
  Mostra que ninguém precisa revisar: o poste vê, escreve e envia sozinho.
  - fase: a fase da câmera (useCameraPoste)
  - mqttEnviado: true se a API avisou o poste no Wokwi; false se o MQTT está desligado ou sem conexão
  - texto: o último reporte que o Gemini escreveu
*/
export default function EtapasPoste({ fase, mqttEnviado, texto }) {
  const estados = estadoDasEtapas(fase)

  return (
    <section className="etapas-poste cartao" aria-labelledby="etapas-poste-titulo">
      <h2 id="etapas-poste-titulo" className="etapas-poste__titulo">
        O que o poste faz sozinho
      </h2>

      <ol className="etapas-poste__lista">
        {ETAPAS_POSTE.map((etapa, i) => {
          const estado = estados[etapa.id]
          // LED: se o MQTT estiver desligado na API, avisamos em vez de fingir que acendeu
          const semMqtt = etapa.id === 'led' && estado === 'feita' && mqttEnviado === false
          return (
            <li key={etapa.id} className={'etapas-poste__item etapas-poste__item--' + estado}>
              <span className="etapas-poste__bolinha" aria-hidden="true">
                {estado === 'feita' ? <IconCheck size={18} stroke={3} /> : i + 1}
              </span>
              <span className="etapas-poste__textos">
                <span className="etapas-poste__nome">{etapa.titulo}</span>
                <span className="etapas-poste__texto">
                  {semMqtt ? 'O aviso por MQTT não chegou ao poste desta vez.' : etapa.texto}
                </span>
              </span>
              <span className="etapas-poste__estado">{NOME_DO_ESTADO[estado]}</span>
            </li>
          )
        })}
      </ol>

      {/* O texto que acabou de ir para a Prefeitura */}
      <div aria-live="polite">
        {texto && (
          <blockquote className="etapas-poste__reporte">
            <span className="etapas-poste__reporte-rotulo">Reporte enviado</span>
            {texto}
          </blockquote>
        )}
      </div>
    </section>
  )
}
