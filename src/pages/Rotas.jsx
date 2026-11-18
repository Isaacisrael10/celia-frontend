import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowsExchange } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import CardRota from '../components/CardRota'
import { useRotas } from '../hooks/useRotas'
import './Rotas.css'

/*
  Tela Rotas: compara os caminhos pré-definidos de casa até o trabalho.
  O useRotas ordena da rota mais segura para a menos segura (faixas dos trechos).
  A pessoa pode inverter ida e volta e escolher o "caminho de sempre",
  que o boletim do Mapa passa a acompanhar.
*/
export default function Rotas() {
  const { rotas, recomendada, escolhida, escolher } = useRotas()
  const navigate = useNavigate()
  // Interação Web Dev: inverter origem e destino (ida ↔ volta do trabalho)
  const [volta, setVolta] = useState(false)

  const casa = recomendada.origem
  const trabalho = recomendada.destino
  const saindoDe = volta ? trabalho : casa
  const indoPara = volta ? casa : trabalho

  // Escolher o caminho de sempre: fica salvo no navegador e o boletim do Mapa passa a acompanhar ele
  function escolherRota(id) {
    escolher(id)
    const rota = rotas.find((r) => r.id === id)
    navigate('/mapa', { state: { aviso: 'Caminho de sempre: ' + rota.nome + '.' } })
  }

  return (
    <>
      <Cabecalho titulo="Rotas" />
      <main id="conteudo" tabIndex={-1} className="app__conteudo">
        {/* Saída e chegada: duas bolinhas ligadas por uma linha (o menor grafo possível) */}
        <section className="rotas__percurso cartao" aria-label="Seu percurso">
          <div className="rotas__pontos">
            <p className="rotas__ponto">
              <span className="rotas__bolinha" aria-hidden="true" />
              <span>
                <span className="rotas__rotulo">Saindo de</span>
                {/* key: quando o texto troca, ele entra de novo com um movimento suave */}
                <span key={saindoDe} className="rotas__lugar">
                  {saindoDe}
                </span>
              </span>
            </p>
            <span className="rotas__ligacao" aria-hidden="true" />
            <p className="rotas__ponto">
              <span className="rotas__bolinha rotas__bolinha--destino" aria-hidden="true" />
              <span>
                <span className="rotas__rotulo">Indo para</span>
                <span key={indoPara} className="rotas__lugar">
                  {indoPara}
                </span>
              </span>
            </p>
          </div>
          <button
            className="botao-icone rotas__inverter"
            onClick={() => setVolta(!volta)}
            aria-label="Inverter origem e destino"
          >
            <IconArrowsExchange size={24} aria-hidden="true" />
          </button>
        </section>

        <div className="rotas__titulo">
          <h2>{rotas.length} caminhos</h2>
          <p>do mais seguro ao menos seguro</p>
        </div>

        <ul className="grade grade--igual">
          {rotas.map((rota) => (
            <li key={rota.id}>
              <CardRota
                rota={rota}
                recomendada={rota.id === recomendada.id}
                atual={escolhida && rota.id === escolhida.id}
                volta={volta}
                aoEscolher={escolherRota}
              />
            </li>
          ))}
        </ul>

        <p className="apoio">Rotas de exemplo. O status de cada trecho vem do poste ao vivo e dos dados simulados.</p>
      </main>
    </>
  )
}
