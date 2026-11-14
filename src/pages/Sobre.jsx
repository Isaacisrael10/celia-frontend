import { IconCpu, IconEye, IconCode, IconDeviceMobile, IconSchool, IconChartLine, IconShieldLock } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import FiguraPessoa from '../components/FiguraPessoa'
import PassosLigados from '../components/PassosLigados'
import sobre from '../data/sobre.json'
import './Sobre.css'

// Ícone de cada parte do projeto (os ids vêm de src/data/sobre.json)
const ICONES_PARTE = {
  poste: IconCpu,
  visao: IconEye,
  python: IconCode,
  app: IconDeviceMobile,
  trilha: IconSchool,
}

/*
  Sobre o projeto: o problema, para quem é, como a solução ajuda, o que cada parte faz,
  os ODS e o cuidado com os dados. Os textos ficam em src/data/sobre.json;
  esta tela só desenha.
*/
export default function Sobre() {
  return (
    <>
      <Cabecalho titulo="Sobre o projeto" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo sobre">
        {/* Apresentação: o símbolo, o nome e o problema em uma frase */}
        <section className="cartao sobre__apresentacao" aria-labelledby="sobre-nome">
          <FiguraPessoa tamanho={104} />
          <div className="sobre__textos">
            <h2 id="sobre-nome" className="sobre__nome">
              C.E.L.I.A.
            </h2>
            <p className="sobre__lema">{sobre.lema}</p>
            <p className="sobre__problema">{sobre.problema}</p>
            <p>{sobre.solucao}</p>
            <p className="apoio">{sobre.homenagem}</p>
          </div>
        </section>

        {/* Ficha rápida: onde, para quem e qual é o desafio */}
        <dl className="sobre__ficha">
          {sobre.ficha.map((item) => (
            <div key={item.rotulo} className="cartao sobre__ficha-item">
              <dt>{item.rotulo}</dt>
              <dd>{item.texto}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="sobre-jornada" className="sobre__secao">
          <h2 id="sobre-jornada" className="sobre__titulo">
            Como ajuda no dia a dia
          </h2>
          <PassosLigados passos={sobre.jornada} />
        </section>

        <section aria-labelledby="sobre-partes" className="sobre__secao">
          <h2 id="sobre-partes" className="sobre__titulo">
            O que cada parte faz
          </h2>
          <ul className="grade grade--igual">
            {sobre.partes.map((parte) => {
              const Icone = ICONES_PARTE[parte.id]
              return (
                <li key={parte.id} className="cartao sobre__parte">
                  <span className="sobre__bolinha" aria-hidden="true">
                    <Icone size={24} />
                  </span>
                  <h3 className="sobre__subtitulo">{parte.titulo}</h3>
                  <p>{parte.texto}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="sobre-ods" className="sobre__secao">
          <h2 id="sobre-ods" className="sobre__titulo">
            Objetivos de Desenvolvimento Sustentável da ONU
          </h2>
          <ul className="grade grade--igual">
            {sobre.ods.map((ods) => (
              <li key={ods.numero} className="cartao sobre__parte">
                <span className="sobre__bolinha sobre__bolinha--numero" aria-hidden="true">
                  {ods.numero}
                </span>
                <h3 className="sobre__subtitulo">
                  <span className="so-leitor">ODS {ods.numero}: </span>
                  {ods.titulo}
                </h3>
                <p>{ods.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Lado a lado em telas largas: como medir o resultado e o cuidado com os dados */}
        <div className="sobre__dupla">
          <section className="cartao sobre__parte" aria-labelledby="sobre-impacto">
            <h2 id="sobre-impacto" className="sobre__subtitulo sobre__subtitulo--icone">
              <IconChartLine size={24} aria-hidden="true" />
              Como medir o resultado
            </h2>
            <p>{sobre.impacto}</p>
          </section>

          <section className="cartao sobre__parte" aria-labelledby="sobre-dados">
            <h2 id="sobre-dados" className="sobre__subtitulo sobre__subtitulo--icone">
              <IconShieldLock size={24} aria-hidden="true" />
              Cuidado com os dados
            </h2>
            <ul className="sobre__lista">
              {sobre.dados.map((frase) => (
                <li key={frase}>{frase}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}
