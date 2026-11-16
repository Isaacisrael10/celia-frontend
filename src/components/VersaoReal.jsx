import {
  IconBuildingBank,
  IconCamera,
  IconEye,
  IconBulb,
  IconMap2,
  IconSend,
  IconShieldLock,
  IconFlask,
} from '@tabler/icons-react'
import { useAparecerAoRolar } from '../hooks/useAparecerAoRolar'
import './VersaoReal.css'

/*
  "Como é na versão real" contado como uma história, em linha do tempo (scroll storytelling).
  Cada etapa é um NÓ da linha. Ao rolar a página, o card daquela etapa se abre com animação.
  Cada card diz o que acontece no poste de verdade e, embaixo, como isso é feito nesta demonstração.
  Segue a arquitetura da C.E.L.I.A. (ver INTEGRACAO.md).
*/
const ETAPAS = [
  {
    id: 'poste',
    Icone: IconBuildingBank,
    titulo: 'O poste no ponto de ônibus',
    texto:
      'Fica num ponto escolhido junto com a Prefeitura, sem totens próprios. Um ESP32 mede o calor (DHT22) e o espaço livre na calçada (HC-SR04), e uma câmera olha para a calçada.',
    demo: 'O ESP32 roda simulado no Wokwi, com os mesmos sensores.',
  },
  {
    id: 'captura',
    Icone: IconCamera,
    titulo: 'A câmera fotografa a calçada',
    texto: 'A cada 20 segundos, a câmera do poste (ESP32-CAM) tira uma foto do trecho em frente ao ponto e envia pela internet.',
    demo: '6 fotos já baixadas fazem o papel da câmera (dataset público de buracos e calçadas do Rio, com fonte).',
  },
  {
    id: 'visao',
    Icone: IconEye,
    titulo: 'A IA procura buracos no servidor',
    texto:
      'A foto chega ao servidor da C.E.L.I.A., onde o modelo de buracos treinado pela equipe (YOLO) analisa a imagem. O poste só fotografa: um ESP32 não tem força para rodar a IA.',
    demo: 'A API da equipe em Python (FastAPI) roda o modelo na rota /analisar, igual à versão real.',
  },
  {
    id: 'led',
    Icone: IconBulb,
    titulo: 'O trecho vira "Evite"',
    texto: 'Achou buraco: o LED do poste fica vermelho e o visor (OLED) mostra o motivo. O poste não faz som.',
    demo: 'A API avisa o ESP32 do Wokwi por MQTT, no tópico celia/poste01/camera.',
  },
  {
    id: 'mapa',
    Icone: IconMap2,
    titulo: 'O mapa avisa a próxima pessoa',
    texto:
      'O status vai por Wi-Fi para o ThingSpeak. O app pinta o trecho no mapa e sugere outra rota: quem sai de casa já sabe o caminho melhor.',
    demo: 'O ESP32 envia ao canal público do ThingSpeak com motivo 5 (field6 = 5).',
  },
  {
    id: 'reporte',
    Icone: IconSend,
    titulo: 'O reporte chega sozinho à Prefeitura',
    texto:
      'O Gemini escreve o texto e o reporte é enviado sem revisão humana. Já o reporte do cidadão é revisado por ele antes de sair.',
    demo: 'A rota /assistente/descricao pede o texto ao Gemini e o reporte entra em "Reportes recebidos".',
  },
  {
    id: 'lgpd',
    Icone: IconShieldLock,
    titulo: 'Dados com cuidado (LGPD)',
    texto: 'As fotos das câmeras dos postes ficam guardadas no banco do servidor, para a Prefeitura consultar o histórico. São fotos da calçada, sem cadastro de ninguém. A foto do cidadão vai só como miniatura no reporte e não passa pela IA.',
    demo: 'O banco de capturas (SQLite) ainda está sendo feito na API. O Gemini recebe só texto, nunca a foto.',
  },
]

// Um nó da linha do tempo: abre o card quando entra na tela
function EtapaDaHistoria({ etapa, posicao }) {
  const [ref, visivel] = useAparecerAoRolar()
  const { Icone } = etapa
  // Em telas largas os cards alternam: um à esquerda da linha, o outro à direita
  const lado = posicao % 2 === 0 ? 'esquerda' : 'direita'

  return (
    <li
      ref={ref}
      className={'historia__etapa historia__etapa--' + lado + (visivel ? ' historia__etapa--aberta' : '')}
    >
      <span className="historia__no" aria-hidden="true">
        <Icone size={24} stroke={2} />
      </span>

      <article className="historia__card cartao">
        <span className="historia__passo">Etapa {posicao + 1}</span>
        <h3 className="historia__titulo">{etapa.titulo}</h3>
        <p className="historia__texto">{etapa.texto}</p>
        <p className="historia__demo">
          <IconFlask size={18} aria-hidden="true" />
          <span>
            <strong>Nesta demonstração:</strong> {etapa.demo}
          </span>
        </p>
      </article>
    </li>
  )
}

export default function VersaoReal() {
  return (
    <section className="historia" aria-labelledby="historia-titulo">
      <div className="historia__topo">
        <h2 id="historia-titulo" className="historia__cabeca">
          Como é na versão real
        </h2>
        <p className="apoio">Role a página para acompanhar o caminho de um buraco, da calçada até a Prefeitura.</p>
      </div>

      <ol className="historia__linha">
        {ETAPAS.map((etapa, i) => (
          <EtapaDaHistoria key={etapa.id} etapa={etapa} posicao={i} />
        ))}
      </ol>
    </section>
  )
}
