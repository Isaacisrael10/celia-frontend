import { useState } from 'react'
import { IconInfoSquareFilled, IconSearch, IconSparkles } from '@tabler/icons-react'
import { TIPOS, SITUACOES, validarReporte } from '../domain/reportes'
import { useAnaliseFoto } from '../hooks/useAnaliseFoto'
import { useLocalDoReporte } from '../hooks/useLocalDoReporte'
import { useTema } from '../hooks/useTema'
import { useChamadaApi } from '../hooks/useChamadaApi'
import { sugerirDescricao } from '../services/assistenteApi'
import EtapaFoto from './EtapaFoto'
import SeletorLocal from './SeletorLocal'

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
  // Foto + IA de visão (só no novo reporte)
  const analise = useAnaliseFoto()
  // Tipo escolhido à mão; enquanto for null, vale o que a IA disse
  const [tipoManual, setTipoManual] = useState(null)

  // Local do problema: mapa com pino, GPS e busca de endereço
  const { escuro } = useTema()
  const local = useLocalDoReporte({ lat: inicial.lat, lng: inicial.lng }, (texto) =>
    // O mapa achou o endereço do pino: preenche o campo
    setDados((atual) => ({ ...atual, rua: texto })),
  )

  // Descrição assistida por IA (HU-22): a IA sugere, a pessoa revisa e só então envia (RN07)
  const sugestao = useChamadaApi()
  const [sugerida, setSugerida] = useState(false)

  const tipoAtual = editando ? dados.tipo : tipoManual || analise.tipo
  const analisando = analise.estado === 'analisando'

  // Atualiza um campo do formulário. Ex.: mudar('rua', 'Rua X, 10')
  function mudar(campo, valor) {
    setDados({ ...dados, [campo]: valor })
  }

  function mudarTipo(valor) {
    if (editando) mudar('tipo', valor)
    else setTipoManual(valor)
  }

  async function pedirSugestao() {
    // A API nunca recebe a foto: só o resultado da análise, o local e o que a pessoa escreveu
    const r = await sugestao.executar(() => sugerirDescricao(tipoAtual, dados.rua, dados.descricao))
    if (!r) return
    mudar('descricao', r.descricao_sugerida)
    setSugerida(true)
  }

  async function enviar(evento) {
    evento.preventDefault() // não deixa o navegador recarregar a página
    if (analisando) return

    // Junta o local do pino; no novo reporte, também a miniatura da foto e o tipo
    const comLocal = { ...dados, lat: local.coordenadas.lat, lng: local.coordenadas.lng }
    const reporte = editando ? comLocal : { ...comLocal, tipo: tipoAtual, fotoUrl: analise.miniatura }
    const encontrados = validarReporte(reporte, !editando)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    const deuCerto = await aoSalvar(reporte)
    if (!deuCerto) setEnviando(false)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 22 }}>{editando ? 'Editar reporte' : 'Reportar problema'}</h2>

      {/* O erro "falta a foto" some assim que a foto é escolhida */}
      {!editando && <EtapaFoto analise={analise} erro={analise.miniatura ? '' : erros.foto} />}

      <div className="campo">
        <label className="campo__rotulo" htmlFor="campo-rua">
          Local do problema
        </label>
        <span className="campo__dica" id="dica-rua">
          Arraste o mapa até o pino ficar em cima do problema, ou digite a rua e o número e aperte Buscar.
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="campo-rua"
            className="campo__entrada"
            style={{ flex: 1, minWidth: 0 }}
            value={dados.rua}
            onChange={(e) => mudar('rua', e.target.value)}
            onKeyDown={(e) => {
              // Enter no endereço busca no mapa (em vez de enviar o formulário)
              if (e.key === 'Enter') {
                e.preventDefault()
                local.buscarEndereco(dados.rua)
              }
            }}
            aria-invalid={erros.rua ? 'true' : 'false'}
            aria-describedby="dica-rua"
            autoComplete="street-address"
          />
          <button
            type="button"
            className="botao botao--secundario"
            style={{ minHeight: 52 }}
            onClick={() => local.buscarEndereco(dados.rua)}
            disabled={local.buscando}
          >
            <IconSearch size={20} aria-hidden="true" />
            Buscar
          </button>
        </div>
        {erros.rua && <ErroCampo texto={erros.rua} />}

        <SeletorLocal ponto={local.ponto} alvo={local.alvo} escuro={escuro} aoMover={local.aoMoverMapa} />

        <p className="campo__dica" aria-live="polite">
          {local.buscando ? 'Buscando o endereço…' : local.aviso}
        </p>
      </div>

      <label className="campo">
        <span className="campo__rotulo">Tipo de problema</span>
        {!editando && <span className="campo__dica">Vem da análise da foto. Corrija se precisar.</span>}
        <select className="campo__entrada" value={tipoAtual} onChange={(e) => mudarTipo(e.target.value)}>
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
          aria-describedby={editando ? undefined : 'dica-sugestao'}
        />
        {erros.descricao && <ErroCampo texto={erros.descricao} />}
      </label>

      {!editando && (
        <div className="campo" style={{ marginTop: -10 }}>
          <button
            type="button"
            className="botao botao--secundario botao--pequeno"
            style={{ alignSelf: 'flex-start' }}
            onClick={pedirSugestao}
            disabled={sugestao.carregando}
          >
            <IconSparkles size={20} aria-hidden="true" />
            {sugestao.carregando ? 'Escrevendo…' : 'Sugerir descrição com IA'}
          </button>
          <span className="campo__dica" id="dica-sugestao" aria-live="polite">
            {sugestao.indisponivel
              ? 'A sugestão por IA roda na demonstração local. Escreva com suas palavras.'
              : sugestao.erro
                ? sugestao.erro
                : sugerida
                  ? 'Texto sugerido pela IA. Revise e corrija antes de enviar.'
                  : 'A IA escreve um texto claro a partir da foto e do local. Você revisa antes de enviar.'}
          </span>
        </div>
      )}

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
        <button type="submit" className="botao botao--primario" disabled={enviando || analisando}>
          {enviando ? 'Enviando…' : analisando ? 'Aguarde a análise…' : editando ? 'Salvar alterações' : 'Enviar reporte'}
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
