import { IconCamera, IconShieldLock } from '@tabler/icons-react'
import FotoComCaixas from './FotoComCaixas'
import ErroCampo from './ErroCampo'
import './EtapaFoto.css'

/*
  Primeira etapa do novo reporte: a foto da calçada.
  A foto aparece no reporte só para quem enviou e some ao atualizar a página (não vai para a MockAPI). No tipo buraco, a IA de visão (YOLO) confere a
  foto antes do Gemini escrever, e os buracos que ela achou aparecem marcados [HU-05, RF09].
  - foto: o que o useFotoReporte devolve
  - caixas: buracos que o YOLO marcou (lista vazia se não achou ou ainda não conferiu)
  - erro: texto de erro da validação (ex.: falta a foto)

  Aviso de privacidade (LGPD) a cada novo reporte: explica, em linguagem simples e com o
  detalhe técnico num "Saiba mais", onde a foto passa e onde ela NÃO fica [RNF01, RNF04, HU-08].
*/
export default function EtapaFoto({ foto, caixas = [], erro }) {
  const { estado, previa, escolherFoto } = foto

  return (
    <div className="campo">
      <span className="campo__rotulo" id="rotulo-foto">
        Foto da calçada
      </span>
      <span className="campo__dica">A foto aparece só para você. O reporte vai para a lista pública sem a foto.</span>

      <div className="etapa-foto__privacidade" role="note" aria-labelledby="titulo-privacidade">
        <p className="etapa-foto__privacidade-titulo" id="titulo-privacidade">
          <IconShieldLock size={20} aria-hidden="true" />
          Sua foto não fica guardada
        </p>
        <p>
          A IA olha a foto para achar buracos e depois a descarta. Ninguém mais vê a sua foto, e ela some quando
          você atualiza a página.
        </p>
        <details>
          <summary>Saiba mais: como a foto é tratada</summary>
          <ul>
            <li>
              <strong>Análise:</strong> a foto vai por conexão segura (HTTPS) para a API da equipe. Ela é lida só na
              memória do servidor, nunca é gravada em disco ou banco, e é apagada assim que a análise termina.
            </li>
            <li>
              <strong>O que sai da análise:</strong> só o resultado (livre ou buraco) e a posição dos buracos. O aviso
              ao poste leva só a palavra do resultado, sem imagem.
            </li>
            <li>
              <strong>Descrição pela IA:</strong> o Gemini recebe só texto (tipo do problema, rua e o que você
              escreveu). A foto nunca vai para ele.
            </li>
            <li>
              <strong>Lista de reportes:</strong> o reporte salvo tem rua, tipo, descrição, situação e data. A foto não
              vai junto.
            </li>
            <li>
              <strong>No seu aparelho:</strong> uma versão pequena da foto fica só na memória desta página, para o seu
              card. Ela não é salva no navegador e some ao atualizar ou fechar a página.
            </li>
            <li>
              <strong>Sem cadastro:</strong> o app não pede nome, e-mail ou documento. Evite fotos com rostos ou placas
              de carro.
            </li>
          </ul>
        </details>
      </div>

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

      {estado === 'erro' && (
        <p className="campo__erro" role="alert">
          {foto.erro}
        </p>
      )}

      {erro && <ErroCampo texto={erro} />}
    </div>
  )
}
