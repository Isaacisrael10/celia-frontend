import { useState } from 'react'
import { IconToiletPaper, IconArmchair } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import { Vazio } from '../components/Estados'
import dados from '../data/locais.json'
import './Locais.css'

const FILTROS = { todos: 'Todos', banheiro: 'Banheiros', descanso: 'Descanso' }
const ICONES = { banheiro: IconToiletPaper, descanso: IconArmchair }
const NOMES_TIPO = { banheiro: 'Banheiro acessível', descanso: 'Ponto de descanso' }

export default function Locais() {
  // Interação Web Dev: filtrar por tipo de local
  const [filtro, setFiltro] = useState('todos')

  // Mais perto primeiro
  const visiveis = dados.locais
    .filter((local) => filtro === 'todos' || local.tipo === filtro)
    .sort((a, b) => a.metros - b.metros)

  return (
    <>
      <Cabecalho titulo="Locais" />
      <main className="app__conteudo">
        <p style={{ fontSize: 17 }}>Banheiros acessíveis e lugares para descansar perto do caminho.</p>

        <div className="abas" role="group" aria-label="Filtrar locais">
          {Object.entries(FILTROS).map(([valor, nome]) => (
            <button key={valor} className="abas__aba" aria-pressed={filtro === valor} onClick={() => setFiltro(valor)}>
              {nome}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 15, color: 'var(--muted)' }} aria-live="polite">
          {visiveis.length === 1 ? '1 local' : visiveis.length + ' locais'}
        </p>

        {visiveis.length === 0 && <Vazio titulo="Nenhum local deste tipo por perto" />}

        <ul className="locais">
          {visiveis.map((local) => {
            const Icone = ICONES[local.tipo]
            return (
              <li key={local.id} className="locais__item">
                <span className="locais__icone" aria-hidden="true">
                  <Icone size={26} />
                </span>
                <span className="locais__textos">
                  <span className="locais__tipo">{NOMES_TIPO[local.tipo]}</span>
                  <span className="locais__nome">{local.nome}</span>
                  <span>{local.endereco}</span>
                  <span className="locais__detalhe">{local.detalhe}</span>
                </span>
                <span className="locais__distancia">
                  {local.metros} m<span className="so-leitor"> daqui</span>
                </span>
              </li>
            )
          })}
        </ul>

        <p className="locais__fonte">{dados.fonte}</p>
      </main>
    </>
  )
}
