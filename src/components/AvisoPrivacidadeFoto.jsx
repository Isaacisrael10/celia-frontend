import { IconShieldLock } from '@tabler/icons-react'
import './AvisoPrivacidadeFoto.css'

/*
  Aviso de privacidade (LGPD) a cada novo reporte, embaixo dos botões do formulário.
  Explica em linguagem simples e, num "Saiba mais", o caminho técnico da foto:
  onde ela passa e onde ela NÃO fica [RNF01, RNF04, RNF05, HU-08].
*/
export default function AvisoPrivacidadeFoto() {
  return (
    <div className="aviso-privacidade" role="note" aria-labelledby="titulo-privacidade">
      <p className="aviso-privacidade__titulo" id="titulo-privacidade">
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
  )
}
