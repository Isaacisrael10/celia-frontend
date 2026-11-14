import { Link, useNavigate, useParams } from 'react-router-dom'
import { IconBriefcase, IconPencil } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import { Carregando, Vazio } from '../components/Estados'
import { useLicao, useTrilha } from '../hooks/useTrilha'
import './Trilha.css'

/*
  Uma lição da mini trilha de IA.
  Títulos como cabeçalhos (h2, h3) para quem navega pelo leitor de tela (RNF08).
*/
export default function Licao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { licao, estado } = useLicao(id)
  const { trilha } = useTrilha()

  // Próxima lição, para seguir sem voltar para a lista
  let proxima = null
  if (trilha && licao) {
    const posicao = trilha.licoes.findIndex((l) => String(l.id) === String(licao.id))
    if (posicao >= 0) proxima = trilha.licoes[posicao + 1] || null
  }

  return (
    <>
      <Cabecalho titulo="Lição" voltar aoVoltar={() => navigate('/trilha')} />
      <main className="app__conteudo">
        {estado === 'carregando' && <Carregando texto="Carregando a lição…" />}

        {estado === 'naoExiste' && (
          <>
            <Vazio titulo="Lição não encontrada" texto="Ela pode ter mudado de lugar na trilha." />
            <Link to="/trilha" className="botao botao--secundario">
              Ver todas as lições
            </Link>
          </>
        )}

        {estado === 'pronta' && (
          <article className="licao">
            <header>
              <h2 className="licao__titulo">{licao.titulo}</h2>
              {licao.duracao_minutos && <p className="licao__duracao">{licao.duracao_minutos} min de leitura</p>}
            </header>

            {(licao.paragrafos || []).map((texto, i) => (
              <p key={i} className="licao__paragrafo">
                {texto}
              </p>
            ))}

            {licao.exemplo_no_trabalho && (
              <section className="licao__bloco" aria-labelledby="licao-trabalho">
                <h3 id="licao-trabalho" className="licao__subtitulo">
                  <IconBriefcase size={22} aria-hidden="true" />
                  No trabalho
                </h3>
                <p>{licao.exemplo_no_trabalho}</p>
              </section>
            )}

            {licao.pratique && (
              <section className="licao__bloco" aria-labelledby="licao-pratique">
                <h3 id="licao-pratique" className="licao__subtitulo">
                  <IconPencil size={22} aria-hidden="true" />
                  Pratique
                </h3>
                <p>{licao.pratique}</p>
              </section>
            )}

            {proxima ? (
              <Link to={'/trilha/' + proxima.id} className="botao botao--primario">
                Próxima: {proxima.titulo}
              </Link>
            ) : (
              <Link to="/trilha" className="botao botao--secundario">
                Voltar para a trilha
              </Link>
            )}
          </article>
        )}
      </main>
    </>
  )
}
