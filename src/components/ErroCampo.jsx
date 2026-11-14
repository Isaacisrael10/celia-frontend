import { IconInfoSquareFilled } from '@tabler/icons-react'

/*
  Mensagem de erro de um campo do formulário.
  Sem vermelho (o semáforo é só das faixas): ícone + texto em negrito.
  role="alert" faz o leitor de tela ler o erro assim que ele aparece.
*/
export default function ErroCampo({ texto }) {
  return (
    <span className="campo__erro" role="alert">
      <IconInfoSquareFilled size={22} aria-hidden="true" />
      {texto}
    </span>
  )
}
