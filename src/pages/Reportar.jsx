import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconPlus, IconMessageOff } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import CardReporte from '../components/CardReporte'
import FormReporte from '../components/FormReporte'
import Aviso from '../components/Aviso'
import { Carregando, MensagemErro, Vazio } from '../components/Estados'
import { useReportes } from '../hooks/useReportes'
import { useAviso } from '../hooks/useAviso'
import { REPORTE_VAZIO } from '../domain/reportes'

// Opções do filtro (nomes curtos para caber na largura do celular)
const FILTROS = { todos: 'Todos', aberto: 'Abertos', enviado: 'Enviados', resolvido: 'Resolvidos' }

/*
  Tela de reportes: lista (com filtro) e formulário de novo/editar.
  O formulário aparece no lugar da lista, como no design.
*/
export default function Reportar() {
  const { reportes, carregando, erro, carregar, criar, editar, excluir } = useReportes()
  const { aviso, mostrarAviso } = useAviso()
  const [filtro, setFiltro] = useState('todos')
  // Vindo do detalhe do trecho ("Reportar problema aqui"), a rua e o ponto já chegam preenchidos
  const location = useLocation()
  const recebido = location.state && location.state.rua ? location.state : null
  // null = mostrando a lista · objeto = formulário aberto com esses dados
  const [formulario, setFormulario] = useState(
    recebido ? { ...REPORTE_VAZIO, rua: recebido.rua, lat: recebido.lat, lng: recebido.lng } : null,
  )

  // Interação Web Dev: filtrar os reportes pela situação
  const visiveis = filtro === 'todos' ? reportes : reportes.filter((r) => r.status === filtro)

  async function salvar(dados) {
    try {
      if (dados.id) {
        await editar(dados.id, dados)
        mostrarAviso('Reporte atualizado.')
      } else {
        await criar(dados)
        mostrarAviso('Reporte enviado. Obrigado!')
      }
      setFormulario(null)
      return true
    } catch (e) {
      mostrarAviso(e.message)
      return false
    }
  }

  async function apagar(id) {
    try {
      await excluir(id)
      mostrarAviso('Reporte excluído.')
      return true
    } catch (e) {
      mostrarAviso(e.message)
      return false
    }
  }

  // ----- Formulário aberto -----
  if (formulario) {
    return (
      <>
        <Cabecalho titulo="Reportes" voltar aoVoltar={() => setFormulario(null)} />
        <main className="app__conteudo">
          <FormReporte
            inicial={formulario}
            editando={Boolean(formulario.id)}
            aoSalvar={salvar}
            aoCancelar={() => setFormulario(null)}
          />
        </main>
        <Aviso mensagem={aviso} />
      </>
    )
  }

  // ----- Lista -----
  return (
    <>
      <Cabecalho titulo="Reportes" />
      <main className="app__conteudo">
        <button className="botao botao--primario botao--seta" onClick={() => setFormulario(REPORTE_VAZIO)}>
          Reportar problema
          <IconPlus size={24} aria-hidden="true" />
        </button>

        <div className="abas" role="group" aria-label="Filtrar por situação">
          {Object.entries(FILTROS).map(([valor, nome]) => (
            <button
              key={valor}
              className="abas__aba"
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {nome}
            </button>
          ))}
        </div>

        {carregando && <Carregando texto="Buscando os reportes…" />}

        {!carregando && erro && <MensagemErro mensagem={erro} aoTentarDeNovo={carregar} />}

        {!carregando && !erro && (
          <>
            <p style={{ fontSize: 15, color: 'var(--muted)' }} aria-live="polite">
              {visiveis.length === 1 ? '1 reporte' : visiveis.length + ' reportes'}
            </p>

            {reportes.length === 0 && (
              <Vazio
                Icone={IconMessageOff}
                titulo="Nenhum reporte ainda"
                texto="Viu um buraco ou uma calçada bloqueada? Conte para a gente."
              />
            )}

            {reportes.length > 0 && visiveis.length === 0 && (
              <Vazio titulo="Nenhum reporte nesta situação" />
            )}

            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {visiveis.map((reporte) => (
                <CardReporte
                  key={reporte.id}
                  reporte={reporte}
                  aoEditar={(r) => setFormulario(r)}
                  aoExcluir={apagar}
                />
              ))}
            </ul>
          </>
        )}
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
