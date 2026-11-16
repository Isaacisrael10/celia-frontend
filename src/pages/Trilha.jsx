import { IconEye, IconMessageChatbot, IconPencil } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import CardLicao from '../components/CardLicao'
import { Carregando } from '../components/Estados'
import { useTrilha } from '../hooks/useTrilha'
import { resumoDaTrilha } from '../domain/trilha'
import textos from '../data/trilhaTextos.json'
import './Trilha.css'

// Um ícone para cada ligação entre a trilha e o app (na mesma ordem de textos.porque.ligacoes)
const ICONES_LIGACAO = [IconEye, IconMessageChatbot, IconPencil]

/*
  Trilha de IA [HU-19, RF18]: lições curtas para usar inteligência artificial no trabalho.
  As lições vêm da API da equipe (GET /trilha). Sem a API, o app mostra a cópia que vem com ele.
  Os textos da tela (introdução, "por que a trilha existe" e a origem das lições) ficam todos
  em data/trilhaTextos.json, para a equipe revisar num lugar só.
  A tela só desenha: quem busca e decide o plano B é o hook useTrilha.
*/
export default function Trilha() {
  const { trilha, origem, carregando, aberta, alternarLicao } = useTrilha()
  const { porque } = textos

  return (
    <>
      <Cabecalho titulo="Trilha de IA" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo trilha">
        <p className="intro">{textos.intro}</p>

        {/* Por que a trilha existe: liga a capacitação em IA ao problema do projeto */}
        <section className="trilha__porque" aria-labelledby="trilha-porque-titulo">
          <h2 id="trilha-porque-titulo" className="trilha__porque-titulo">
            {porque.titulo}
          </h2>
          {porque.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}

          <h3 className="trilha__ligacoes-titulo">{porque.ligacoes_titulo}</h3>
          <ul className="trilha__ligacoes">
            {porque.ligacoes.map((texto, i) => {
              const Icone = ICONES_LIGACAO[i]
              return (
                <li key={texto} className="trilha__ligacao">
                  <span className="trilha__ligacao-icone" aria-hidden="true">
                    <Icone size={22} />
                  </span>
                  <span>{texto}</span>
                </li>
              )
            })}
          </ul>
        </section>

        {carregando && <Carregando texto="Buscando as lições…" />}

        {!carregando && (
          <>
            <div className="trilha__topo">
              <h2 className="trilha__titulo">{trilha.titulo}</h2>
              <p className="apoio">{resumoDaTrilha(trilha.licoes)}</p>
            </div>

            {/* Interação Web Dev: abrir e fechar cada lição */}
            <ol className="trilha__licoes">
              {trilha.licoes.map((licao, i) => (
                <CardLicao
                  key={licao.id}
                  numero={i + 1}
                  licao={licao}
                  aberta={aberta === licao.id}
                  aoAlternar={() => alternarLicao(licao.id)}
                />
              ))}
            </ol>

            <p className="apoio">{textos.origem[origem]}</p>
          </>
        )}
      </main>
    </>
  )
}
