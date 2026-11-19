import { IconSearch } from '@tabler/icons-react'
import { TIPOS, TIPOS_CIDADAO, SITUACOES } from '../domain/reportes'
import { useFormReporte } from '../hooks/useFormReporte'
import { useTema } from '../hooks/useTema'
import EtapaFoto from './EtapaFoto'
import AvisoPrivacidadeFoto from './AvisoPrivacidadeFoto'
import CardDescricaoIa from './CardDescricaoIa'
import PopupErroIa from './PopupErroIa'
import SeletorLocal from './SeletorLocal'
import ErroCampo from './ErroCampo'
import logoCelia from '../assets/celia-logo.png'
import './FormReporte.css'

// Texto do botão principal, conforme o momento
function textoDoBotao(enviando, editando) {
  if (enviando) return 'Enviando…'
  return editando ? 'Salvar alterações' : 'Enviar reporte'
}

/*
  Formulário de novo reporte e de edição (só a parte visual).
  Os dados, a validação e o envio ficam no custom hook useFormReporte.
  - inicial: os dados que começam preenchidos
  - editando: true muda o título e o texto do botão
  - aoSalvar(dados): função que manda para a API (devolve true se deu certo)
  - aoCancelar: volta para a lista
*/
export default function FormReporte({ inicial, editando, aoSalvar, aoCancelar }) {
  const { dados, erros, enviando, tipoAtual, foto, caixasIa, local, descricaoIa, popupIa, mudar, mudarTipo, enviar } =
    useFormReporte(inicial, editando, aoSalvar)
  // No reporte novo o cidadão só escolhe buraco ou obstáculo; na edição aparecem todos (reportes antigos)
  const tiposDoCampo = editando ? TIPOS : TIPOS_CIDADAO
  const { escuro } = useTema()

  // Enter no endereço busca no mapa (em vez de enviar o formulário)
  function buscarComEnter(evento) {
    if (evento.key === 'Enter') {
      evento.preventDefault()
      local.buscarEndereco(dados.rua)
    }
  }

  return (
    <form className="form-reporte" onSubmit={enviar} noValidate>
      <h2 className="form-reporte__titulo">{editando ? 'Editar reporte' : 'Reportar problema'}</h2>

      {/* Duas colunas no computador: "onde e o quê" de um lado, a descrição do outro */}
      <div className="form-reporte__colunas">
        <div className="form-reporte__coluna cartao">
          {/* O erro "falta a foto" some assim que a foto é escolhida */}
          {!editando && <EtapaFoto foto={foto} caixas={caixasIa} erro={foto.miniatura ? '' : erros.foto} />}

          <div className="campo">
            <label className="campo__rotulo" htmlFor="campo-rua">
              Local do problema
            </label>
            <span className="campo__dica" id="dica-rua">
              Arraste o mapa até o pino ficar em cima do problema, ou digite a rua e o número e aperte Buscar.
            </span>
            <div className="form-reporte__busca">
              <input
                id="campo-rua"
                className="campo__entrada"
                value={dados.rua}
                onChange={(e) => mudar('rua', e.target.value)}
                onKeyDown={buscarComEnter}
                aria-invalid={erros.rua ? 'true' : 'false'}
                aria-describedby="dica-rua"
                autoComplete="street-address"
              />
              <button
                type="button"
                className="botao botao--secundario"
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
        </div>

        <div className="form-reporte__coluna cartao">
          <label className="campo">
            <span className="campo__rotulo">Tipo de problema</span>
            {!editando && <span className="campo__dica">O que você encontrou na calçada?</span>}
            <select className="campo__entrada" value={tipoAtual} onChange={(e) => mudarTipo(e.target.value)}>
              {Object.entries(tiposDoCampo).map(([valor, nome]) => (
                <option key={valor} value={valor}>
                  {nome}
                </option>
              ))}
            </select>
          </label>

          {/* Depois da foto: a descrição que a IA escreveu para a Prefeitura (o cidadão revisa) */}
          {!editando && (
            <div aria-live="polite">
              <CardDescricaoIa ia={descricaoIa} />
            </div>
          )}

          {/* Os 3 modelos do Gemini falharam: motivo + plano B, sem travar o reporte */}
          {!editando && (
            <PopupErroIa
              aberto={popupIa.aberto}
              motivo={popupIa.motivo}
              aoUsarPadrao={popupIa.usarPadrao}
              aoTentarDeNovo={popupIa.tentarDeNovo}
              aoFechar={popupIa.fechar}
            />
          )}

          <label className="campo">
            <span className="campo__rotulo">O que você viu?</span>
            <textarea
              id="campo-descricao"
              className="campo__entrada"
              rows={3}
              value={dados.descricao}
              onChange={(e) => mudar('descricao', e.target.value)}
              aria-invalid={erros.descricao ? 'true' : 'false'}
            />
            {erros.descricao && <ErroCampo texto={erros.descricao} />}
          </label>

          <fieldset className="form-reporte__situacao">
            <legend className="campo__rotulo">Situação</legend>
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

          <div className="form-reporte__acoes">
            <button type="submit" className="botao botao--primario" disabled={enviando}>
              {textoDoBotao(enviando, editando)}
            </button>
            <button type="button" className="acao-texto" onClick={aoCancelar}>
              Cancelar
            </button>
          </div>

          {/* Como a foto é tratada (LGPD): só no reporte novo, que é quando há foto */}
          {!editando && <AvisoPrivacidadeFoto />}

          {/* Rodapé do card: no computador as duas colunas têm a mesma altura e a logo fica
              no fim da coluna, centralizada. Os botões continuam logo abaixo da Situação.
              No celular a logo não aparece. */}
          <div className="form-reporte__logo" aria-hidden="true">
            <img src={logoCelia} alt="" width="407" height="121" />
          </div>
        </div>
      </div>
    </form>
  )
}
