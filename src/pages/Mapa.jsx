import Cabecalho from '../components/Cabecalho'
import BadgeFaixa from '../components/BadgeFaixa'
import { FAIXAS } from '../domain/faixas'

export default function Mapa() {
  return (
    <>
      <Cabecalho titulo="Mapa" />
      <main className="app__conteudo">
        <p>O mapa com os trechos entra aqui.</p>

        {/* Prévia da legenda: as 4 faixas do semáforo */}
        <section aria-label="Legenda">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {Object.values(FAIXAS).map((faixa) => (
              <li key={faixa.id}>
                <BadgeFaixa faixa={faixa} tamanho={36} comNome />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
