import { useRef, useState } from 'react'
import { IconDeviceCctv, IconInbox, IconInfoSquare, IconTemperatureSun } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import CameraPoste from '../components/CameraPoste'
import EtapasPoste from '../components/EtapasPoste'
import VersaoReal from '../components/VersaoReal'
import AlertasCalor from '../components/AlertasCalor'
import CardReportePrefeitura from '../components/CardReportePrefeitura'
import Filtros from '../components/Filtros'
import Aviso from '../components/Aviso'
import { Vazio } from '../components/Estados'
import { useCameraPoste } from '../hooks/useCameraPoste'
import { useCameraReal } from '../hooks/useCameraReal'
import { useReportesPrefeitura } from '../hooks/useReportesPrefeitura'
import { useAviso } from '../hooks/useAviso'
import { FILTROS_ORIGEM, textoQuantidade } from '../domain/prefeitura'
import dados from '../data/prefeitura.json'
import './Prefeitura.css'

// As abas do módulo (a barra de navegação de dentro da Prefeitura)
const ABAS = [
  { id: 'camera', rotulo: 'Câmera do poste', Icone: IconDeviceCctv },
  { id: 'reportes', rotulo: 'Reportes recebidos', Icone: IconInbox },
  { id: 'calor', rotulo: 'Alertas de calor', Icone: IconTemperatureSun },
]

/*
  Módulo da PREFEITURA (outro usuário do app, não o cidadão).
  - Aba "Câmera do poste": a câmera REAL do poste (ESP32-CAM), lida da API a cada 5 s, quando
    ela mandou foto há pouco; senão, a câmera simulada (RNF10). Nas duas, a IA de visão (YOLO) da API analisa cada foto,
    e quando acha um buraco o Gemini escreve o reporte e ele é enviado sozinho.
  - Aba "Reportes recebidos": a caixa de entrada, com reportes dos postes e dos cidadãos,
    o local e a data. Começa com reportes de exemplo.
  - Aba "Alertas de calor": o calor medido pelos postes nos pontos de ônibus (dados de exemplo),
    em verde, amarelo ou vermelho.
  A câmera continua rodando ao trocar de aba: dá para ver o reporte chegando na lista.
*/
export default function Prefeitura() {
  // A aba pode vir no endereço (ex.: /prefeitura?aba=calor), para abrir direto nela na demonstração
  const [aba, setAba] = useState(() => {
    const pedida = new URLSearchParams(window.location.search).get('aba')
    return ABAS.some((a) => a.id === pedida) ? pedida : 'camera'
  })
  const { aviso, mostrarAviso } = useAviso()
  // Câmera real: quando chega um report novo da API, avisa na tela
  const real = useCameraReal(dados.poste, (reporte) =>
    mostrarAviso('Novo reporte da câmera real do ' + reporte.poste + ' na caixa de entrada.'),
  )
  const caixa = useReportesPrefeitura(real.reportes)
  const camera = useCameraPoste({
    poste: dados.poste,
    quadros: dados.quadros,
    aoReportar: (reporte) => {
      caixa.adicionar(reporte)
      mostrarAviso('Novo reporte do ' + reporte.poste + ' na caixa de entrada.')
    },
  })

  // Teclado nas abas: setas esquerda e direita trocam de aba (padrão de abas acessíveis)
  const botoesAba = useRef([])
  function teclaNaAba(evento, posicao) {
    if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return
    const passo = evento.key === 'ArrowRight' ? 1 : -1
    const proxima = (posicao + passo + ABAS.length) % ABAS.length
    setAba(ABAS[proxima].id)
    botoesAba.current[proxima].focus()
  }

  return (
    <>
      <Cabecalho titulo="Prefeitura" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo prefeitura">
        <p className="intro prefeitura__intro">
          Área da Prefeitura. Os postes com câmera procuram buracos sozinhos e enviam o reporte pronto. Os reportes dos
          cidadãos chegam aqui também.
        </p>

        {/* Resumo rápido da caixa de entrada */}
        <dl className="prefeitura__resumo">
          <div className="cartao">
            <dt>Reportes</dt>
            <dd>{caixa.contagem.todos}</dd>
          </div>
          <div className="cartao">
            <dt>Dos postes</dt>
            <dd>{caixa.contagem.poste}</dd>
          </div>
          <div className="cartao">
            <dt>Dos cidadãos</dt>
            <dd>{caixa.contagem.cidadao}</dd>
          </div>
        </dl>

        {/* Barra de navegação do módulo */}
        <div className="prefeitura__abas vidro" role="tablist" aria-label="Seções da Prefeitura">
          {ABAS.map(({ id, rotulo, Icone }, posicao) => (
            <button
              key={id}
              ref={(el) => (botoesAba.current[posicao] = el)}
              id={'aba-' + id}
              role="tab"
              aria-selected={aba === id}
              aria-controls={'painel-' + id}
              tabIndex={aba === id ? 0 : -1}
              className="prefeitura__aba"
              onClick={() => setAba(id)}
              onKeyDown={(e) => teclaNaAba(e, posicao)}
            >
              <Icone size={22} aria-hidden="true" />
              {rotulo}
              {id === 'reportes' && caixa.novos > 0 && (
                <span className="prefeitura__contador">
                  {caixa.novos}
                  <span className="so-leitor"> novos</span>
                </span>
              )}
              {id === 'camera' && camera.ligada && <span className="prefeitura__gravando" aria-label="ao vivo" />}
            </button>
          ))}
        </div>

        {aba === 'camera' && (
          <section id="painel-camera" role="tabpanel" aria-labelledby="aba-camera" className="prefeitura__camera">
            {real.aoVivo ? (
              <>
                <CameraPoste camera={real.camera} poste={dados.poste} real />
                <EtapasPoste fase={real.etapa.fase} mqttEnviado={real.captura.mqtt_enviado} texto={real.etapa.texto} />
              </>
            ) : (
              <>
                <CameraPoste camera={camera} poste={dados.poste} />
                <EtapasPoste fase={camera.fase} mqttEnviado={camera.mqttEnviado} texto={camera.texto} />
              </>
            )}
            {!real.aoVivo && real.apiNoAr && (
              <p className="prefeitura__nota prefeitura__nota--camera">
                <IconInfoSquare size={20} aria-hidden="true" />
                A câmera real do poste (ESP32-CAM) não mandou foto nos últimos 2 minutos. Mostrando a câmera simulada.
              </p>
            )}
            <VersaoReal />
          </section>
        )}

        {aba === 'reportes' && (
          <section id="painel-reportes" role="tabpanel" aria-labelledby="aba-reportes" className="prefeitura__reportes">
            <Filtros rotulo="Filtrar por origem" opcoes={FILTROS_ORIGEM} valor={caixa.filtro} aoMudar={caixa.setFiltro} />

            <p className="apoio prefeitura__quantidade" aria-live="polite">
              {textoQuantidade(caixa.visiveis.length)}
            </p>

            {caixa.visiveis.length === 0 && <Vazio Icone={IconInbox} titulo="Nenhum reporte desta origem" />}

            {/* grade--igual: todos os cards da linha com a mesma altura */}
            <ul className="grade grade--igual">
              {caixa.visiveis.map((reporte) => (
                <CardReportePrefeitura key={reporte.id} reporte={reporte} />
              ))}
            </ul>

            <p className="prefeitura__nota">
              <IconInfoSquare size={20} aria-hidden="true" />
              Reportes de exemplo (dados simulados, sem pessoas reais). Os que a câmera do poste enviar nesta demonstração
              entram no topo da lista.
            </p>
          </section>
        )}

        {aba === 'calor' && (
          <section id="painel-calor" role="tabpanel" aria-labelledby="aba-calor">
            <AlertasCalor alertas={dados.alertasCalor} />
          </section>
        )}
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
