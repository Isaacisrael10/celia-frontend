import Cabecalho from '../components/Cabecalho'
import CardLicao from '../components/CardLicao'
import { Carregando } from '../components/Estados'
import { useTrilha } from '../hooks/useTrilha'
import { resumoDaTrilha, TEXTO_ORIGEM } from '../domain/trilha'
import './Trilha.css'

/*
  Trilha de IA [HU-19, RF18]: lições curtas para usar inteligência artificial no trabalho.
  As lições vêm da API da equipe (GET /trilha). Sem a API, o app mostra a cópia que vem com ele.
  A tela só desenha: quem busca e decide o plano B é o hook useTrilha.
*/
export default function Trilha() {
  const { trilha, origem, carregando, aberta, alternarLicao } = useTrilha()

  return (
    <>
      <Cabecalho titulo="Trilha de IA" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo trilha">
        <p className="intro">
          Lições curtas para usar inteligência artificial no trabalho. Leia no seu ritmo, na ordem que quiser.
        </p>

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

            <p className="apoio">{TEXTO_ORIGEM[origem]}</p>
          </>
        )}
      </main>
    </>
  )
}
