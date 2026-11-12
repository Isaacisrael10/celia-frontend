import { IconCamera, IconSparkles, IconInfoSquare } from '@tabler/icons-react'
import FotoComCaixas from './FotoComCaixas'
import { RESULTADOS, TEXTO_PLANO_B } from '../domain/visao'
import './EtapaFoto.css'

/*
  Primeira etapa do novo reporte: a foto e o resultado da IA.
  - analise: o que o useAnaliseFoto devolve
  - erro: texto de erro da validação (ex.: falta a foto)
*/
export default function EtapaFoto({ analise, erro }) {
  const { estado, previa, tipo, caixas, escolherFoto } = analise

  return (
    <div className="campo">
      <span className="campo__rotulo" id="rotulo-foto">
        Foto da calçada
      </span>
      <span className="campo__dica">A IA confere se tem buraco ou obstáculo.</span>

      {previa && <FotoComCaixas src={previa} caixas={caixas} />}

      {/* O input de arquivo fica escondido; o label funciona como botão */}
      <label className="botao botao--secundario etapa-foto__botao">
        <IconCamera size={24} aria-hidden="true" />
        {previa ? 'Trocar foto' : 'Tirar ou escolher foto'}
        <input
          type="file"
          accept="image/*"
          className="so-leitor"
          aria-labelledby="rotulo-foto"
          aria-invalid={erro ? 'true' : 'false'}
          onChange={(e) => escolherFoto(e.target.files[0])}
        />
      </label>

      {/* Resultado da análise (anunciado pelo leitor de tela) */}
      <div aria-live="polite">
        {estado === 'analisando' && <p className="etapa-foto__status">Analisando a foto…</p>}

        {estado === 'analisada' && (
          <p className="etapa-foto__resultado">
            <IconSparkles size={22} aria-hidden="true" />
            Resultado da IA: {RESULTADOS[tipo] || 'não reconhecido'}
          </p>
        )}

        {estado === 'planoB' && (
          <p className="etapa-foto__plano-b">
            <IconInfoSquare size={22} aria-hidden="true" />
            <span>
              {TEXTO_PLANO_B} O reporte vai como <strong>Não analisada</strong>.
            </span>
          </p>
        )}

        {estado === 'erro' && (
          <p className="campo__erro" role="alert">
            {analise.erro}
          </p>
        )}
      </div>

      {erro && (
        <span className="campo__erro" role="alert">
          <IconInfoSquare size={22} aria-hidden="true" />
          {erro}
        </span>
      )}
    </div>
  )
}
