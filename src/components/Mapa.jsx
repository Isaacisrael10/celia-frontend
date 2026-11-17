import { useEffect, useMemo, useRef } from 'react'
import MapaBase, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IconMessageReport } from '@tabler/icons-react'
import CamadasTrechos from './CamadasTrechos'
import FiguraPessoa from './FiguraPessoa'
import { useSelosDoMapa } from '../hooks/useSelosDoMapa'
import { estiloDoMapa } from '../styles/mapa/estilos'
import { CORES_MAPA, rotuloCompleto } from '../domain/faixas'
import { AREA_INICIAL, CAMADAS_CLICAVEIS } from '../domain/mapa'
import { nomeDoTrecho, meioDoTrecho, trechosEmGeoJson, pontasEmGeoJson } from '../domain/trechos'
import { TIPOS } from '../domain/reportes'
import './Mapa.css'

/*
  Espaço livre nas bordas ao enquadrar, para os trechos não ficarem escondidos atrás das peças de vidro.
  - trilho: largura da navegação lateral. Vem da variável --nav-lado do CSS (0 no celular em pé).
  - computador (960 px ou mais): a busca e o boletim ficam numa coluna à esquerda (424 px).
  - celular e tablet: a busca fica em cima e os botões e o boletim ficam embaixo.
    Em tela baixa (celular deitado) a folga encolhe, senão não sobraria espaço para o mapa.
*/
function folgaDoMapa() {
  const estilo = getComputedStyle(document.documentElement)
  const trilho = parseFloat(estilo.getPropertyValue('--nav-lado')) || 0
  const altura = window.innerHeight

  if (window.innerWidth >= 960) {
    return { top: 48, bottom: 96, left: trilho + 424, right: 72 }
  }
  return {
    top: Math.min(84, altura * 0.2),
    bottom: Math.min(300, altura * 0.42),
    left: trilho + 24,
    right: 64,
  }
}

// Textos do MapLibre em português (o leitor de tela lê estes nomes)
const TEXTOS_MAPA = {
  'Map.Title': 'Mapa dos trechos',
  'NavigationControl.ZoomIn': 'Aproximar',
  'NavigationControl.ZoomOut': 'Afastar',
}

/*
  Mapa real (MapLibre + OpenFreeMap) com os trechos coloridos por faixa.
  - trechos: lista de trechos já com { faixa, motivo } calculados
  - reportes: reportes com lat/lng (viram marcadores)
  - escuro: true usa o estilo escuro
  - satelite: true mostra a foto de satélite no lugar do desenho do mapa
  - voce: { lat, lng } da pessoa
  - alvo: lugar para onde a câmera vai ({ area } ou { lat, lng }); muda quando a pessoa busca
  - destaque: ids dos trechos do caminho de sempre (ganham um contorno azul)
  - aoSelecionar(id): abre o detalhe do trecho
  - aoAbrirReporte(): abre a tela de reportes
  O crédito do mapa fica escrito na tela do Mapa (aqui embaixo ele ficaria escondido).
*/
export default function Mapa({
  trechos,
  reportes = [],
  escuro,
  satelite = false,
  voce,
  alvo,
  destaque = [],
  aoSelecionar,
  aoAbrirReporte,
}) {
  const mapaRef = useRef(null)
  // Em cima da foto de satélite valem as cores do modo escuro, que são mais vivas
  const fundoEscuro = escuro || satelite
  const cores = fundoEscuro ? CORES_MAPA.escuro : CORES_MAPA.claro
  // Selos ! e ✕ que cabem na tela sem ficar um em cima do outro
  const { selos, guardarCamera } = useSelosDoMapa(trechos)

  /*
    O MapLibre coloca "Map marker" como nome de todo marcador.
    Os nossos marcadores já têm um botão com nome em português dentro,
    então tiramos esse nome em inglês para o leitor de tela não ler duas vezes.
    (Sem lista de dependências: roda depois de cada desenho, porque os marcadores mudam.)
  */
  useEffect(() => {
    document.querySelectorAll('.mapa .maplibregl-marker').forEach((marcador) => {
      marcador.removeAttribute('aria-label')
      marcador.setAttribute('role', 'presentation')
    })
  })

  // Quando o alvo muda (busca, GPS ou caminho de sempre), a câmera voa até ele
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || !alvo) return
    if (alvo.area) {
      mapa.fitBounds(alvo.area, { padding: folgaDoMapa(), maxZoom: 17, duration: 1200 })
    } else {
      mapa.flyTo({ center: [alvo.lng, alvo.lat], zoom: 17, duration: 1200 })
    }
  }, [alvo])

  // Os trechos no formato do mapa: só refaz a conversão quando os trechos mudam
  const linhas = useMemo(() => trechosEmGeoJson(trechos), [trechos])
  const pontas = useMemo(() => pontasEmGeoJson(trechos), [trechos])

  // Clique numa linha abre o detalhe do trecho
  function clicarNoMapa(evento) {
    const linha = evento.features && evento.features[0]
    if (linha) aoSelecionar(linha.properties.id)
  }

  // Só os reportes que têm localização viram marcador
  const reportesComLocal = reportes.filter((r) => typeof r.lat === 'number' && typeof r.lng === 'number')

  return (
    <div className="mapa">
      <MapaBase
        ref={mapaRef}
        initialViewState={{ bounds: AREA_INICIAL, fitBoundsOptions: { padding: folgaDoMapa() } }}
        mapStyle={estiloDoMapa(escuro, satelite)}
        attributionControl={false}
        locale={TEXTOS_MAPA}
        onLoad={guardarCamera}
        onMoveEnd={guardarCamera}
        interactiveLayerIds={CAMADAS_CLICAVEIS}
        onClick={clicarNoMapa}
        cursor="pointer"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <CamadasTrechos linhas={linhas} pontas={pontas} cores={cores} destaque={destaque} fundoEscuro={fundoEscuro} />

        {/* Selos ! e ✕ no meio dos trechos em Atenção e Perigo (são botões: funcionam no teclado) */}
        {selos.map((trecho) => {
          const [lng, lat] = meioDoTrecho(trecho)
          return (
            <Marker key={trecho.id} longitude={lng} latitude={lat}>
              <button
                className="mapa__selo"
                style={{ background: trecho.faixa.cor }}
                onClick={() => aoSelecionar(trecho.id)}
                aria-label={nomeDoTrecho(trecho) + ': ' + rotuloCompleto(trecho.faixa, trecho.motivo) + '. Ver detalhes'}
              >
                {trecho.faixa.icone}
              </button>
            </Marker>
          )
        })}

        {/* Reportes feitos pelas pessoas */}
        {reportesComLocal.map((r) => (
          <Marker key={'r' + r.id} longitude={r.lng} latitude={r.lat}>
            <button
              className="mapa__reporte"
              onClick={aoAbrirReporte}
              aria-label={'Reporte: ' + (TIPOS[r.tipo] || 'problema') + ', ' + r.rua + '. Abrir reportes'}
            >
              <IconMessageReport size={20} aria-hidden="true" />
            </button>
          </Marker>
        ))}

        {/* Você */}
        {voce && (
          <Marker longitude={voce.lng} latitude={voce.lat}>
            <span className="mapa__voce">
              <FiguraPessoa tamanho={30} rotulo="Você está aqui" />
            </span>
          </Marker>
        )}
      </MapaBase>
    </div>
  )
}
