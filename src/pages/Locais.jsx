import Cabecalho from '../components/Cabecalho'
import MiniMapa from '../components/MiniMapa'
import CardLocal from '../components/CardLocal'
import Filtros from '../components/Filtros'
import { Vazio } from '../components/Estados'
import { useTema } from '../hooks/useTema'
import { useLocais } from '../hooks/useLocais'
import { FILTROS_LOCAL, CATEGORIAS_LAZER, textoQuantidade } from '../domain/locais'
import { VOCE_PADRAO } from '../domain/mapa'
import './Locais.css'

/*
  Tela Locais acessíveis perto de mim: banheiros acessíveis, pontos de descanso e lazer acessível perto do caminho [HU-12, HU-14].
  A lista e o filtro vêm do hook useLocais; aqui fica só o desenho da tela.
*/
export default function Locais() {
  const { escuro } = useTema()
  const { filtro, mudarFiltro, categoria, mudarCategoria, visiveis, fonte } = useLocais()

  return (
    <>
      <Cabecalho titulo="Locais acessíveis perto de mim" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo locais-tela">
        <p className="intro">Banheiros acessíveis, lugares para descansar e lazer acessível perto do caminho: esporte adaptado, cultura com audiodescrição e Libras e espaços ao ar livre.</p>

        <Filtros rotulo="Filtrar locais" opcoes={FILTROS_LOCAL} valor={filtro} aoMudar={mudarFiltro} />

        {/* No lazer aparece um segundo filtro, com o tipo de lazer */}
        {filtro === 'lazer' && (
          <Filtros rotulo="Tipo de lazer" opcoes={CATEGORIAS_LAZER} valor={categoria} aoMudar={mudarCategoria} />
        )}

        {/* Só para o leitor de tela: avisa quantos locais sobraram depois do filtro */}
        <p className="so-leitor" aria-live="polite">
          {textoQuantidade(visiveis.length)}
        </p>

        {visiveis.length === 0 && <Vazio titulo="Nenhum local deste tipo por perto" />}

        {/* Celular: mini mapa em cima e a lista embaixo. Computador: mapa e lista lado a lado. */}
        <div className="locais__colunas">
          {visiveis.length > 0 && <MiniMapa locais={visiveis} voce={VOCE_PADRAO} escuro={escuro} />}
          <ul className="locais">
            {visiveis.map((local) => (
              <CardLocal key={local.id} local={local} />
            ))}
          </ul>
        </div>

        <p className="apoio">{fonte}</p>
      </main>
    </>
  )
}
