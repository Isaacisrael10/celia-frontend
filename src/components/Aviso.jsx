import { IconInfoSquare } from '@tabler/icons-react'
import './Aviso.css'

/*
  Toast no rodapé, acima da barra inferior.
  A região aria-live fica sempre na página, para o leitor de tela anunciar a mensagem.
*/
export default function Aviso({ mensagem }) {
  return (
    <>
      <div className="so-leitor" aria-live="polite">
        {mensagem}
      </div>
      {mensagem && (
        <div className="aviso" aria-hidden="true">
          <IconInfoSquare size={22} />
          {mensagem}
        </div>
      )}
    </>
  )
}
