import { useEffect, useState } from 'react'
import { IconPlayerPlay, IconPlayerPause, IconRefresh } from '@tabler/icons-react'
import { caixaEmPorcentagem, rotuloDaCaixa } from '../domain/visao'
import './CameraPoste.css'

// Frase da faixa de baixo da câmera, em cada fase (lida também pelo leitor de tela)
function textoDaFase(camera) {
  const { fase, caixas, tentativa } = camera
  if (fase === 'preparando') return 'Ligando a IA do poste… (na primeira vez leva até 1 minuto)'
  if (fase === 'capturando') return 'Capturando imagem da calçada…'
  if (fase === 'analisando') return 'IA procurando buracos…'
  if (fase === 'livre') return 'Calçada livre. Nada a reportar.'
  if (fase === 'escrevendo') {
    const quantos = caixas.length === 1 ? '1 buraco encontrado' : caixas.length + ' buracos encontrados'
    return tentativa > 0
      ? `${quantos}. Gemini ocupado, tentando de novo (${tentativa})…`
      : `${quantos}. Gemini escrevendo o reporte…`
  }
  if (fase === 'enviado') return 'Reporte enviado à Prefeitura automaticamente.'
  if (fase === 'falhou') return 'Buraco encontrado, mas o Gemini não respondeu. O reporte não saiu.'
  return ''
}

// Relógio da câmera (hora:minuto:segundo), atualizado a cada segundo
function useRelogio() {
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return agora.toLocaleTimeString('pt-BR')
}

/*
  Câmera do poste "ao vivo" (SIMULAÇÃO).
  Parece uma transmissão de câmera de segurança: selo AO VIVO, relógio, linhas de vídeo
  e uma varredura enquanto a IA analisa. As caixas do YOLO aparecem sobre a imagem.
  Na versão real, o poste (ESP32-CAM) só tira a foto e envia; a IA roda no servidor (API da equipe).
  - camera: o que o useCameraPoste devolve
  - poste: dados do poste (nome, câmera e local)
*/
export default function CameraPoste({ camera, poste }) {
  const { fase, ligada, quadro, indice, total, caixas } = camera
  const hora = useRelogio()
  const frase = textoDaFase(camera)
  const comBuraco = caixas.length > 0
  const descricao =
    'Imagem da câmera do ' +
    poste.nome +
    (comBuraco ? '. A IA marcou: ' + caixas.map(rotuloDaCaixa).join(', ') + '.' : '.')

  return (
    <section className="camera cartao" aria-labelledby="camera-titulo">
      <div className="camera__topo">
        <div>
          <h2 id="camera-titulo" className="camera__titulo">
            Câmera do {poste.nome}
          </h2>
          <p className="apoio">{poste.local}</p>
        </div>
        <span className="camera__selo-simulacao">Câmera simulada</span>
      </div>

      {/* Deixa claro, antes de ligar, o que é real e o que faz o papel da câmera nesta demonstração */}
      <div className="camera__explica">
        <p>
          <strong>Na rua:</strong> o poste do ponto de ônibus fotografa a calçada a cada 20 segundos. A IA de visão
          procura buracos e, se achar, o reporte vai sozinho para a Prefeitura.
        </p>
        <p>
          <strong>Nesta demonstração:</strong> ainda não temos a câmera do poste (ESP32-CAM). {total} fotos já baixadas
          fazem o papel dela. A IA, o aviso ao poste e o reporte do Gemini funcionam de verdade.
        </p>
        <a href="#historia-titulo" className="acao-texto">
          Ver o caminho completo, do poste até a Prefeitura
        </a>
      </div>

      <div className={'camera__tela camera__tela--' + fase}>
        {/* A imagem fica parada; só os desenhos por cima (caixas, varredura, AO VIVO) mudam */}
        <div className="camera__imagem">
          <img src={quadro.src} alt={descricao} />
          {caixas.map((caixa, i) => {
            const pos = caixaEmPorcentagem(caixa, camera.tamanho.largura, camera.tamanho.altura)
            return (
              <div
                key={i}
                className="camera__caixa"
                style={{ left: pos.left + '%', top: pos.top + '%', width: pos.width + '%', height: pos.height + '%' }}
                aria-hidden="true"
              >
                <span className="camera__caixa-rotulo">{rotuloDaCaixa(caixa)}</span>
              </div>
            )
          })}
        </div>

        {/* Só desenho: linhas de vídeo e a varredura da IA */}
        <span className="camera__linhas" aria-hidden="true" />
        {fase === 'analisando' && <span className="camera__varredura" aria-hidden="true" />}

        <div className="camera__hud" aria-hidden="true">
          <span className={'camera__aovivo' + (ligada ? ' camera__aovivo--ligada' : '')}>
            <span className="camera__ponto" />
            {ligada ? 'AO VIVO' : 'PAUSADA'}
          </span>
          <span className="camera__id">
            {poste.camera} · {hora}
          </span>
        </div>

        <span className="camera__contador" aria-hidden="true">
          Quadro {indice + 1} de {total}
        </span>

        {/* Faixa de status: muda de cor quando acha buraco ou envia o reporte */}
        <p className={'camera__status camera__status--' + fase} aria-live="polite">
          {frase}
        </p>

        {/* Antes de ligar: botão grande no meio da tela */}
        {fase === 'parada' && indice === 0 && (
          <div className="camera__capa">
            <button className="botao botao--primario" onClick={camera.ligar}>
              <IconPlayerPlay size={24} aria-hidden="true" />
              Ligar câmera do poste
            </button>
          </div>
        )}

        {fase === 'fim' && (
          <div className="camera__capa">
            <p className="camera__capa-texto">
              Ronda concluída: {camera.buracos === 1 ? '1 reporte enviado' : camera.buracos + ' reportes enviados'}.
            </p>
            <button className="botao botao--primario" onClick={camera.ligar}>
              <IconRefresh size={22} aria-hidden="true" />
              Ver de novo
            </button>
          </div>
        )}

        {fase === 'indisponivel' && (
          <div className="camera__capa">
            <p className="camera__capa-texto">
              A IA do poste roda na demonstração local (API da equipe ligada). Veja o vídeo no README.
            </p>
            <button className="botao botao--secundario" onClick={camera.ligar}>
              <IconRefresh size={22} aria-hidden="true" />
              Tentar de novo
            </button>
          </div>
        )}
      </div>

      <div className="camera__controles">
        {ligada && (
          <button className="botao botao--secundario botao--pequeno" onClick={camera.pausar}>
            <IconPlayerPause size={20} aria-hidden="true" />
            Pausar
          </button>
        )}
        {fase === 'parada' && indice > 0 && (
          <button className="botao botao--secundario botao--pequeno" onClick={camera.ligar}>
            <IconPlayerPlay size={20} aria-hidden="true" />
            Continuar
          </button>
        )}
        <span className="camera__credito">Imagem: {quadro.credito}</span>
      </div>

    </section>
  )
}
