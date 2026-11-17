import { IconChevronDown, IconBriefcase, IconPencil } from '@tabler/icons-react'
import './CardLicao.css'
import { comNomeCelia } from './comNomeCelia'

/*
  Uma lição da mini trilha de IA [HU-19, RF18].
  Fechada mostra só o título e a duração; aberta mostra o texto, um exemplo no trabalho e um exercício.
  O título é um botão dentro de um cabeçalho: o leitor de tela anuncia "lição tal, recolhido/expandido"
  e dá para abrir com Enter ou Espaço (RNF08).
  - numero: posição da lição na trilha (1, 2, 3...)
  - licao: { id, titulo, duracao_minutos, paragrafos, exemplo_no_trabalho, pratique }
  - aberta: true ou false
  - aoAlternar(): abre ou fecha
*/
export default function CardLicao({ numero, licao, aberta, aoAlternar }) {
  // Liga o botão ao painel que ele abre (para o leitor de tela)
  const idPainel = 'licao-' + licao.id

  return (
    <li className={'licao' + (aberta ? ' licao--aberta' : '')}>
      {/* A bolinha com o número é só desenho: o número também está escrito no card */}
      <span className="licao__numero" aria-hidden="true">
        {numero}
      </span>

      <div className="licao__cartao cartao">
        <h3 className="licao__titulo">
          <button className="licao__botao" onClick={aoAlternar} aria-expanded={aberta} aria-controls={idPainel}>
            <span>
              <span className="licao__nome">{licao.titulo}</span>
              <span className="licao__duracao">
                Lição {numero} · {licao.duracao_minutos} min de leitura
              </span>
            </span>
            <IconChevronDown size={24} aria-hidden="true" className="licao__seta" />
          </button>
        </h3>

        {/* hidden: fechada, a lição some da tela, do teclado e do leitor de tela */}
        <div id={idPainel} className="licao__corpo" hidden={!aberta}>
          {licao.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}

          {licao.exemplo_no_trabalho && (
            <div className="licao__bloco">
              <h4 className="licao__bloco-titulo">
                <IconBriefcase size={20} aria-hidden="true" />
                No trabalho
              </h4>
              <p>{comNomeCelia(licao.exemplo_no_trabalho)}</p>
            </div>
          )}

          {licao.pratique && (
            <div className="licao__bloco">
              <h4 className="licao__bloco-titulo">
                <IconPencil size={20} aria-hidden="true" />
                Pratique
              </h4>
              <p>{licao.pratique}</p>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
