import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconPlus, IconMessageOff } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import CardReporte from '../components/CardReporte'
import FormReporte from '../components/FormReporte'
import Filtros from '../components/Filtros'
import Aviso from '../components/Aviso'
import { Carregando, MensagemErro, Vazio } from '../components/Estados'
import { useReportes } from '../hooks/useReportes'
import { useAviso } from '../hooks/useAviso'
import { REPORTE_VAZIO, FILTROS_REPORTE, filtrarReportes, textoQuantidade } from '../domain/reportes'
import './Reportar.css'

/*
  Tela de reportes (o CRUD do projeto): lista com filtro e formulário de novo/editar.
  O formulário aparece no lugar da lista.
  A tela só cuida do que aparece: quem fala com a API é o hook useReportes.
*/
export default function Reportar() {
  const { reportes, carregando, erro, carregar, criar, editar, excluir } = useReportes()
  const { aviso, mostrarAviso } = useAviso()
  // Interação Web Dev: filtrar os reportes pela situação
  const [filtro, setFiltro] = useState('todos')
  // Vindo do detalhe do trecho ("Reportar problema aqui"), a rua e o ponto já chegam preenchidos
  const location = useLocation()
  const recebido = location.state && location.state.rua ? location.state : null
  // null = mostrando a lista · objeto = formulário aberto com esses dados
  const [formulario, setFormulario] = useState(
    recebido ? { ...REPORTE_VAZIO, rua: recebido.rua, lat: recebido.lat, lng: recebido.lng } : null,
  )

  const visiveis = filtrarReportes(reportes, filtro)

  // Criar (reporte sem id) ou editar (reporte com id). Devolve true se deu certo.
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
        <main id="conteudo" tabIndex={-1} className="app__conteudo">
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
      <main id="conteudo" tabIndex={-1} className="app__conteudo">
        <button className="botao botao--primario botao--seta reportar__novo" onClick={() => setFormulario(REPORTE_VAZIO)}>
          Reportar problema
          <IconPlus size={24} aria-hidden="true" />
        </button>

        <Filtros rotulo="Filtrar por situação" opcoes={FILTROS_REPORTE} valor={filtro} aoMudar={setFiltro} />

        {carregando && <Carregando texto="Buscando os reportes…" />}

        {!carregando && erro && <MensagemErro mensagem={erro} aoTentarDeNovo={carregar} />}

        {!carregando && !erro && (
          <>
            <p className="apoio" aria-live="polite">
              {textoQuantidade(visiveis.length)}
            </p>

            {reportes.length === 0 && (
              <Vazio
                Icone={IconMessageOff}
                titulo="Nenhum reporte ainda"
                texto="Viu um buraco ou uma calçada bloqueada? Conte para a gente."
              />
            )}

            {reportes.length > 0 && visiveis.length === 0 && <Vazio titulo="Nenhum reporte nesta situação" />}

            <ul className="grade">
              {visiveis.map((reporte) => (
                <CardReporte key={reporte.id} reporte={reporte} aoEditar={setFormulario} aoExcluir={apagar} />
              ))}
            </ul>
          </>
        )}
      </main>
      <Aviso mensagem={aviso} />
    </>
  )
}
