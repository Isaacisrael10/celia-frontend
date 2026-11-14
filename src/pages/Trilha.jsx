import { Link } from 'react-router-dom'
import { IconSchool, IconChevronRight } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import { Carregando, Vazio } from '../components/Estados'
import { useTrilha } from '../hooks/useTrilha'
import { TEXTO_API_LOCAL } from '../services/apiEquipe'
import './Trilha.css'

/*
  Mini trilha de IA (HU-19): lista das lições.
  O texto vem da API da equipe; sem a API, da cópia salva no app.
*/
export default function Trilha() {
  const { trilha, origem, carregando } = useTrilha()

  return (
    <>
      <Cabecalho titulo="Trilha de IA" voltar />
      <main className="app__conteudo">
        {carregando && <Carregando texto="Carregando a trilha…" />}

        {!carregando && trilha.licoes.length === 0 && (
          <Vazio Icone={IconSchool} titulo="Trilha indisponível agora" texto={TEXTO_API_LOCAL} />
        )}

        {!carregando && trilha.licoes.length > 0 && (
          <>
            <div className="trilha__abertura">
              {trilha.titulo && <h2 className="trilha__titulo">{trilha.titulo}</h2>}
              {trilha.observacao && <p className="trilha__observacao">{trilha.observacao}</p>}
            </div>

            {/* Lista numerada: o leitor de tela anuncia "lista, N itens" */}
            <ol className="trilha__lista">
              {trilha.licoes.map((licao, posicao) => (
                <li key={licao.id}>
                  <Link to={'/trilha/' + licao.id} className="trilha__licao">
                    <span className="trilha__numero" aria-hidden="true">
                      {posicao + 1}
                    </span>
                    <span className="trilha__textos">
                      <span className="trilha__nome">{licao.titulo}</span>
                      {licao.duracao_minutos && (
                        <span className="trilha__duracao">{licao.duracao_minutos} min de leitura</span>
                      )}
                    </span>
                    <IconChevronRight size={22} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>

            {origem === 'copia' && <p className="trilha__nota">Texto salvo no app. A versão ao vivo vem da API da equipe.</p>}
          </>
        )}
      </main>
    </>
  )
}
