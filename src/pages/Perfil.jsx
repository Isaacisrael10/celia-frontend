import { IconMoon, IconCloudRain } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import Interruptor from '../components/Interruptor'
import { useTema } from '../hooks/useTema'
import { usePreferencia } from '../hooks/usePreferencia'
import './Perfil.css'

export default function Perfil() {
  const { escuro, alternarTema } = useTema()
  // Modo chuva: o comportamento ainda está sendo definido pela equipe
  const [chuva, alternarChuva] = usePreferencia('celia-chuva')

  return (
    <>
      <Cabecalho titulo="Perfil" />
      <main className="app__conteudo">
        <section aria-labelledby="titulo-ajustes">
          <h2 id="titulo-ajustes" className="perfil__titulo">
            Ajustes
          </h2>
          {/* Interação Web Dev nº 1: alternar modo claro/escuro */}
          <Interruptor Icone={IconMoon} rotulo="Modo escuro" ligado={escuro} aoAlternar={alternarTema} />
          <Interruptor Icone={IconCloudRain} rotulo="Modo chuva" ligado={chuva} aoAlternar={alternarChuva} />
          <p className="perfil__dica">O modo chuva ainda está em construção.</p>
        </section>

        <section aria-labelledby="titulo-sobre" className="perfil__sobre">
          <h2 id="titulo-sobre" className="perfil__titulo">
            Sobre a C.E.L.I.A.
          </h2>
          <p>
            <strong>Caminhos em Liberdade, Inclusão e Acessibilidade.</strong> Mostra, antes de sair de casa, como estão
            as calçadas no caminho até o trabalho, medidas por postes com sensores nos pontos de ônibus.
          </p>
          <p>
            O nome é uma homenagem à Célia, avó de uma integrante da equipe.
          </p>
          <p className="perfil__dica">
            Projeto da Global Solution 2026 · FIAP · Engenharia de Software. Os dados de exemplo são simulados; o poste
            do ponto de ônibus é lido ao vivo.
          </p>
        </section>
      </main>
    </>
  )
}
