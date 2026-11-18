import { useEffect, useRef } from 'react'
import { IconAlertTriangle, IconFileText, IconRefresh, IconPencil } from '@tabler/icons-react'
import './PopupErroIa.css'

/*
  Pop-up de quando a IA não consegue escrever a descrição do reporte [HU-22, RF21, RN07].
  Aparece quando os 3 modelos do Gemini falham (ou a API está fora). Mostra o MOTIVO
  e o plano B, para a pessoa não ficar travada:
  - "Usar texto padrão": um texto pronto do próprio app vai para "O que você viu?" (ela revisa)
  - "Tentar de novo": pede de novo ao Gemini
  - "Escrever eu mesmo": fecha e leva o cursor para o campo da descrição

  Usa o <dialog> do próprio HTML: showModal() abre por cima da tela, prende o foco
  dentro do pop-up (bom para teclado e leitor de tela) e a tecla Esc fecha.
  - aberto, motivo, aoUsarPadrao, aoTentarDeNovo, aoFechar: vêm do useFormReporte (popupIa)
*/
export default function PopupErroIa({ aberto, motivo, aoUsarPadrao, aoTentarDeNovo, aoFechar }) {
  const dialogo = useRef(null)

  // Abre e fecha o <dialog> de verdade quando "aberto" muda
  useEffect(() => {
    const elemento = dialogo.current
    if (!elemento) return
    if (aberto && !elemento.open) elemento.showModal()
    if (!aberto && elemento.open) elemento.close()
  }, [aberto])

  function escreverEuMesmo() {
    aoFechar()
    document.getElementById('campo-descricao')?.focus()
  }

  return (
    <dialog
      ref={dialogo}
      className="popup-ia"
      aria-labelledby="popup-ia-titulo"
      aria-describedby="popup-ia-motivo"
      onClose={aoFechar}
    >
      <h3 className="popup-ia__titulo" id="popup-ia-titulo">
        <IconAlertTriangle size={24} aria-hidden="true" />A IA não conseguiu escrever a descrição
      </h3>
      <p className="popup-ia__motivo" id="popup-ia-motivo">
        <strong>Motivo:</strong> {motivo || 'A IA não respondeu agora.'}
      </p>
      <p className="popup-ia__texto">
        Seu reporte não se perdeu. Use um texto padrão e ajuste se precisar, ou escreva com suas palavras.
      </p>

      <div className="popup-ia__acoes">
        <button type="button" className="botao botao--primario" onClick={aoUsarPadrao}>
          <IconFileText size={20} aria-hidden="true" />
          Usar texto padrão
        </button>
        <button type="button" className="botao botao--secundario" onClick={aoTentarDeNovo}>
          <IconRefresh size={20} aria-hidden="true" />
          Tentar de novo
        </button>
        <button type="button" className="acao-texto popup-ia__escrever" onClick={escreverEuMesmo}>
          <IconPencil size={18} aria-hidden="true" />
          Escrever eu mesmo
        </button>
      </div>
    </dialog>
  )
}
