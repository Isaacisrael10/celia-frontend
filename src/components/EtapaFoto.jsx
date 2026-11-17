import { IconCamera } from '@tabler/icons-react'
import FotoComCaixas from './FotoComCaixas'
import ErroCampo from './ErroCampo'
import './EtapaFoto.css'

/*
  Primeira etapa do novo reporte: a foto da calçada.
  A foto vai junto com o reporte (miniatura). A IA de visão (YOLO) não roda aqui:
  quem procura buracos sozinho são as câmeras dos postes da Prefeitura.
  - foto: o que o useFotoReporte devolve
  - erro: texto de erro da validação (ex.: falta a foto)
*/
export default function EtapaFoto({ foto, erro }) {
  const { estado, previa, escolherFoto } = foto

  return (
    <div className="campo">
      <span className="campo__rotulo" id="rotulo-foto">
        Foto da calçada
      </span>
      <span className="campo__dica">A foto vai junto com o seu reporte para a Prefeitura.</span>

      {previa && <FotoComCaixas src={previa} />}

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

      {estado === 'erro' && (
        <p className="campo__erro" role="alert">
          {foto.erro}
        </p>
      )}

      {erro && <ErroCampo texto={erro} />}
    </div>
  )
}
