import { Link } from 'react-router-dom'
import {
  IconMoon,
  IconCloudRain,
  IconTemperature,
  IconTextSize,
  IconPlayerPause,
  IconContrast2,
  IconPalette,
  IconAccessible,
  IconArrowRight,
} from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import Interruptor from '../components/Interruptor'
import Opcoes from '../components/Opcoes'
import FiguraPessoa from '../components/FiguraPessoa'
import { useTema } from '../hooks/useTema'
import { usePreferencia } from '../hooks/usePreferencia'
import { useLimiteCalor } from '../hooks/useLimiteCalor'
import { useAcessibilidade, TAMANHOS_TEXTO } from '../hooks/useAcessibilidade'
import { LIMITES_CALOR, textoDoLimite } from '../domain/boletim'
import { SOBRE } from '../domain/navegacao'
import './Perfil.css'

// As opções no formato que o componente Opcoes espera: { valor, rotulo }
const OPCOES_CALOR = LIMITES_CALOR.map((graus) => ({ valor: graus, rotulo: textoDoLimite(graus) }))
const OPCOES_TEXTO = Object.entries(TAMANHOS_TEXTO).map(([valor, rotulo]) => ({ valor, rotulo }))

/*
  Perfil: os ajustes de quem usa. Cada grupo de ajustes é um card.
  - Celular: um card embaixo do outro.
  - Tela larga: duas colunas da mesma altura (Aparência + Alerta de calor de um lado,
    Acessibilidade do outro) e o "Sobre" numa faixa embaixo, de ponta a ponta (ver Perfil.css).
*/
export default function Perfil() {
  const { escuro, alternarTema } = useTema()
  // Modo chuva: o comportamento ainda está sendo definido pela equipe
  const [chuva, alternarChuva] = usePreferencia('celia-chuva')
  // Alerta de calor: a partir de quantos graus o boletim do Mapa avisa
  const [limiteCalor, setLimiteCalor] = useLimiteCalor()
  // Ajustes de acessibilidade: tamanho do texto, menos animações e mais contraste
  const { ajustes, mudar } = useAcessibilidade()

  return (
    <>
      <Cabecalho titulo="Perfil" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo">
        <div className="perfil">
          <section className="cartao perfil__secao perfil__secao--aparencia" aria-labelledby="titulo-aparencia">
            <h2 id="titulo-aparencia" className="perfil__titulo">
              <IconPalette size={24} aria-hidden="true" />
              Aparência
            </h2>
            {/* Interação Web Dev nº 1: alternar modo claro/escuro (Light/Dark) */}
            <Interruptor Icone={IconMoon} rotulo="Modo escuro" ligado={escuro} aoAlternar={alternarTema} />
            <Interruptor Icone={IconCloudRain} rotulo="Modo chuva" ligado={chuva} aoAlternar={alternarChuva} />
            <p className="apoio">O modo chuva ainda está em construção.</p>
          </section>

          {/* Interação Web Dev: escolher o alerta de calor (usa o índice de calor medido pelo poste) */}
          <section className="cartao perfil__secao perfil__secao--calor">
            <fieldset className="perfil__grupo">
              <legend className="perfil__titulo">
                <IconTemperature size={24} aria-hidden="true" />
                Alerta de calor no ponto
              </legend>
              <p className="apoio">
                O boletim do Mapa avisa quando o poste do ponto de ônibus medir esta temperatura ou mais.
              </p>
              <Opcoes nome="limite-calor" opcoes={OPCOES_CALOR} valor={limiteCalor} aoMudar={setLimiteCalor} />
            </fieldset>
          </section>

          {/* Proposta do redesenho: ajustes para quem precisa de letra maior, menos movimento ou mais contraste */}
          <section className="cartao perfil__secao perfil__secao--acessibilidade" aria-labelledby="titulo-acessibilidade">
            <h2 id="titulo-acessibilidade" className="perfil__titulo">
              <IconAccessible size={24} aria-hidden="true" />
              Acessibilidade
            </h2>

            <fieldset className="perfil__grupo">
              <legend className="perfil__legenda">
                <IconTextSize size={22} aria-hidden="true" />
                Tamanho do texto
              </legend>
              <Opcoes
                nome="tamanho-texto"
                opcoes={OPCOES_TEXTO}
                valor={ajustes.texto}
                aoMudar={(valor) => mudar('texto', valor)}
              />
            </fieldset>

            <Interruptor
              Icone={IconPlayerPause}
              rotulo="Menos animações"
              ligado={ajustes.menosMovimento}
              aoAlternar={() => mudar('menosMovimento', !ajustes.menosMovimento)}
            />
            <Interruptor
              Icone={IconContrast2}
              rotulo="Mais contraste"
              ligado={ajustes.maisContraste}
              aoAlternar={() => mudar('maisContraste', !ajustes.maisContraste)}
            />
            <p className="apoio">Mais contraste tira a transparência e reforça as bordas.</p>
          </section>

          {/* Faixa de ponta a ponta: o símbolo, um resumo e o caminho para a página Sobre */}
          <section className="cartao perfil__secao perfil__secao--sobre" aria-labelledby="titulo-sobre">
            <FiguraPessoa tamanho={72} />
            <div className="perfil__sobre-textos">
              <h2 id="titulo-sobre" className="perfil__titulo">
                Sobre a C.E.L.I.A.
              </h2>
              <p>
                <strong>Caminhos em Liberdade, Inclusão e Acessibilidade.</strong> Mostra, antes de sair de casa, como
                estão as calçadas no caminho até o trabalho, medidas por postes com sensores nos pontos de ônibus.
              </p>
              <p className="apoio">
                Projeto da Global Solution 2026 · FIAP · Engenharia de Software. Os dados de exemplo são simulados; o
                poste do ponto de ônibus é lido ao vivo.
              </p>
            </div>
            <Link to={SOBRE.caminho} className="botao botao--secundario botao--pequeno botao--seta perfil__sobre-botao">
              Conhecer o projeto
              <IconArrowRight size={20} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}
