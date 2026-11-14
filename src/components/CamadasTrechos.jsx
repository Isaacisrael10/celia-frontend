import { Source, Layer } from 'react-map-gl/maplibre'

// As linhas ficam abaixo desta camada do estilo, para os nomes das ruas ficarem por cima
const ABAIXO_DE = 'highway-name-minor'

// Ponta redonda (linha contínua e pontilhada) ou reta (tracejados)
const PONTA_REDONDA = { 'line-cap': 'round', 'line-join': 'round' }
const PONTA_RETA = { 'line-cap': 'butt', 'line-join': 'round' }

/*
  Os trechos desenhados no mapa. Cada faixa tem cor E tipo de linha (nunca só a cor):
  Normal contínua · Atenção tracejado longo · Perigo tracejado curto · Sem dados pontilhada.
  Precisa ficar DENTRO do componente do mapa (react-map-gl).
  Os ids das quatro camadas "linha-..." estão em CAMADAS_CLICAVEIS (src/domain/mapa.js):
  é por eles que o mapa sabe em quais linhas o clique abre o detalhe do trecho.

  - linhas: os trechos em GeoJSON (trechosEmGeoJson)
  - pontas: as pontas dos trechos em GeoJSON (pontasEmGeoJson)
  - cores: { normal, atencao, perigo, semDados } em código de cor
  - destaque: ids dos trechos do caminho de sempre (ganham um contorno azul)
  - fundoEscuro: true quando o mapa é escuro ou de satélite
*/
export default function CamadasTrechos({ linhas, pontas, cores, destaque, fundoEscuro }) {
  // Expressão do MapLibre: escolhe a cor conforme a propriedade "faixa" de cada linha
  const corPorFaixa = [
    'match',
    ['get', 'faixa'],
    'normal',
    cores.normal,
    'atencao',
    cores.atencao,
    'perigo',
    cores.perigo,
    cores.semDados,
  ]

  return (
    <>
      <Source id="trechos" type="geojson" data={linhas}>
        {/* Caminho de sempre: contorno azul largo por baixo das linhas */}
        <Layer
          id="caminho-de-sempre"
          type="line"
          beforeId={ABAIXO_DE}
          filter={['in', ['get', 'id'], ['literal', destaque]]}
          layout={PONTA_REDONDA}
          paint={{ 'line-color': fundoEscuro ? '#49C8F5' : '#0A72A8', 'line-width': 14, 'line-opacity': 0.35 }}
        />
        {/* Brilho da própria cor por trás da linha */}
        <Layer
          id="brilho"
          type="line"
          beforeId={ABAIXO_DE}
          filter={['!=', ['get', 'faixa'], 'semDados']}
          layout={PONTA_REDONDA}
          paint={{ 'line-color': corPorFaixa, 'line-width': 16, 'line-opacity': fundoEscuro ? 0.22 : 0.16, 'line-blur': 1 }}
        />
        {/* Normal: linha contínua */}
        <Layer
          id="linha-normal"
          type="line"
          beforeId={ABAIXO_DE}
          filter={['==', ['get', 'faixa'], 'normal']}
          layout={PONTA_REDONDA}
          paint={{ 'line-color': cores.normal, 'line-width': 5.5 }}
        />
        {/* Atenção: tracejado longo */}
        <Layer
          id="linha-atencao"
          type="line"
          beforeId={ABAIXO_DE}
          filter={['==', ['get', 'faixa'], 'atencao']}
          layout={PONTA_RETA}
          paint={{ 'line-color': cores.atencao, 'line-width': 5.5, 'line-dasharray': [2.6, 1.1] }}
        />
        {/* Perigo: tracejado curto */}
        <Layer
          id="linha-perigo"
          type="line"
          beforeId={ABAIXO_DE}
          filter={['==', ['get', 'faixa'], 'perigo']}
          layout={PONTA_RETA}
          paint={{ 'line-color': cores.perigo, 'line-width': 5.5, 'line-dasharray': [1.1, 1.1] }}
        />
        {/* Sem dados: pontilhado */}
        <Layer
          id="linha-sem-dados"
          type="line"
          beforeId={ABAIXO_DE}
          filter={['==', ['get', 'faixa'], 'semDados']}
          layout={PONTA_REDONDA}
          paint={{ 'line-color': cores.semDados, 'line-width': 4, 'line-dasharray': [0.01, 2.2] }}
        />
      </Source>

      {/* Bolinhas com contorno da cor da faixa nas pontas dos trechos */}
      <Source id="pontas" type="geojson" data={pontas}>
        <Layer
          id="pontas"
          type="circle"
          beforeId={ABAIXO_DE}
          paint={{
            'circle-radius': 4.5,
            'circle-color': fundoEscuro ? '#13204a' : '#ffffff',
            'circle-stroke-width': 2.5,
            'circle-stroke-color': corPorFaixa,
          }}
        />
      </Source>
    </>
  )
}
