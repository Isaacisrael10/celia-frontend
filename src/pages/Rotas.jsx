import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowsSort } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import CardRota from '../components/CardRota'
import { useRotas } from '../hooks/useRotas'
import './Rotas.css'

export default function Rotas() {
  const { rotas, recomendada, escolhida, escolher } = useRotas()
  const navigate = useNavigate()
  // Interação Web Dev: inverter origem e destino (ida ↔ volta do trabalho)
  const [volta, setVolta] = useState(false)

  const casa = recomendada.origem
  const trabalho = recomendada.destino
  const saindoDe = volta ? trabalho : casa
  const indoPara = volta ? casa : trabalho

  // Escolher uma rota volta para o mapa com um aviso
  function escolherRota(id) {
    escolher(id)
    const rota = rotas.find((r) => r.id === id)
    navigate('/', { state: { aviso: 'Rota escolhida: ' + rota.nome + ', ' + rota.minutos + ' min.' } })
  }

  return (
    <>
      <Cabecalho titulo="Rotas" />
      <main className="app__conteudo">
        <div className="rotas__percurso">
          <div className="rotas__pontos">
            <p className="rotas__ponto">
              <span className="rotas__letra" aria-hidden="true">
                A
              </span>
              <span>
                <span className="rotas__rotulo">Saindo de</span>
                {saindoDe}
              </span>
            </p>
            <span className="rotas__ligacao" aria-hidden="true" />
            <p className="rotas__ponto">
              <span className="rotas__letra" aria-hidden="true">
                B
              </span>
              <span>
                <span className="rotas__rotulo">Indo para</span>
                {indoPara}
              </span>
            </p>
          </div>
          <button className="rotas__inverter" onClick={() => setVolta(!volta)} aria-label="Inverter origem e destino">
            <IconArrowsSort size={26} aria-hidden="true" />
          </button>
        </div>

        <div className="rotas__titulo">
          <h2>{rotas.length} caminhos</h2>
          <p>do mais seguro ao menos seguro</p>
        </div>

        {rotas.map((rota) => (
          <CardRota
            key={rota.id}
            rota={rota}
            recomendada={rota.id === recomendada.id}
            atual={escolhida && rota.id === escolhida.id}
            aoEscolher={escolherRota}
          />
        ))}

        <p style={{ fontSize: 15, color: 'var(--muted)' }}>
          Rotas de exemplo. O status de cada trecho vem do poste ao vivo e dos dados simulados.
        </p>
      </main>
    </>
  )
}
