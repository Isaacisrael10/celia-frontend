import { useState } from 'react'
import { IconInfoSquareFilled } from '@tabler/icons-react'
import { TIPOS, SITUACOES, validarReporte } from '../domain/reportes'

/*
  Formulário de novo reporte e de edição.
  - inicial: os dados que começam preenchidos
  - editando: true muda o título e o texto do botão
  - aoSalvar(dados): função que manda para a API (devolve true se deu certo)
  - aoCancelar: volta para a lista
*/
export default function FormReporte({ inicial, editando, aoSalvar, aoCancelar }) {
  const [dados, setDados] = useState(inicial)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  // Atualiza um campo do formulário. Ex.: mudar('rua', 'Rua X, 10')
  function mudar(campo, valor) {
    setDados({ ...dados, [campo]: valor })
  }

  async function enviar(evento) {
    evento.preventDefault() // não deixa o navegador recarregar a página
    const encontrados = validarReporte(dados)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    const deuCerto = await aoSalvar(dados)
    if (!deuCerto) setEnviando(false)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 26 }}>{editando ? 'Editar reporte' : 'Novo reporte'}</h2>

      <label className="campo">
        <span className="campo__rotulo">Endereço do problema</span>
        <span className="campo__dica" id="dica-rua">
          Rua e número.
        </span>
        <input
          className="campo__entrada"
          value={dados.rua}
          onChange={(e) => mudar('rua', e.target.value)}
          aria-invalid={erros.rua ? 'true' : 'false'}
          aria-describedby="dica-rua"
          autoComplete="street-address"
        />
        {erros.rua && <ErroCampo texto={erros.rua} />}
      </label>

      <label className="campo">
        <span className="campo__rotulo">Tipo de problema</span>
        <select className="campo__entrada" value={dados.tipo} onChange={(e) => mudar('tipo', e.target.value)}>
          {Object.entries(TIPOS).map(([valor, nome]) => (
            <option key={valor} value={valor}>
              {nome}
            </option>
          ))}
        </select>
      </label>

      <label className="campo">
        <span className="campo__rotulo">O que você viu?</span>
        <textarea
          className="campo__entrada"
          rows={3}
          value={dados.descricao}
          onChange={(e) => mudar('descricao', e.target.value)}
          aria-invalid={erros.descricao ? 'true' : 'false'}
        />
        {erros.descricao && <ErroCampo texto={erros.descricao} />}
      </label>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="campo__rotulo" style={{ padding: 0, marginBottom: 8 }}>
          Situação
        </legend>
        {Object.entries(SITUACOES).map(([valor, nome]) => (
          <label key={valor} className="radio">
            <input
              type="radio"
              name="situacao"
              value={valor}
              checked={dados.status === valor}
              onChange={() => mudar('status', valor)}
            />
            <span className="radio__bolinha" aria-hidden="true" />
            {nome}
          </label>
        ))}
      </fieldset>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button type="submit" className="botao botao--primario" disabled={enviando}>
          {enviando ? 'Enviando…' : editando ? 'Salvar alterações' : 'Enviar reporte'}
        </button>
        <button type="button" className="acao-texto" style={{ alignSelf: 'center' }} onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

function ErroCampo({ texto }) {
  return (
    <span className="campo__erro" role="alert">
      <IconInfoSquareFilled size={22} aria-hidden="true" />
      {texto}
    </span>
  )
}
