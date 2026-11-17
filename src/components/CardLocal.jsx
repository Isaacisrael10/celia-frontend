import {
  IconToiletPaper,
  IconArmchair,
  IconTree,
  IconUmbrella,
  IconDroplet,
  IconWheelchair,
  IconAccessible,
  IconClock,
  IconArrowRight,
  IconTrees,
  IconDisabled,
  IconRoad,
  IconBallBasketball,
  IconMasksTheater,
  IconHanger,
  IconEar,
  IconHandFinger,
  IconWalk,
} from '@tabler/icons-react'
import { RECURSOS, nomeDoTipo, linkComoChegar } from '../domain/locais'
import './CardLocal.css'

const ICONES_TIPO = { banheiro: IconToiletPaper, descanso: IconArmchair, lazer: IconTrees }

// No lazer o ícone mostra a categoria (esporte, cultura ou ao ar livre)
const ICONES_CATEGORIA = { esporte: IconBallBasketball, cultura: IconMasksTheater, 'ar-livre': IconTrees }

// Ícone de cada recurso de acessibilidade
const ICONES_RECURSO = {
  'porta-larga': IconWheelchair,
  barras: IconAccessible,
  sombra: IconTree,
  banco: IconArmchair,
  bebedouro: IconDroplet,
  cobertura: IconUmbrella,
  rampa: IconDisabled,
  'piso-tatil': IconRoad,
  'banheiro-acessivel': IconToiletPaper,
  vestiario: IconHanger,
  audiodescricao: IconEar,
  libras: IconHandFinger,
  'area-reservada': IconWheelchair,
  'caminho-plano': IconWalk,
}

/*
  Card de um local: tipo (no lazer, com a categoria), nome, endereço, distância, selos de acessibilidade
  e o botão "Como chegar" (abre o Google Maps com o caminho a pé).
*/
export default function CardLocal({ local }) {
  const IconeTipo = ICONES_CATEGORIA[local.categoria] || ICONES_TIPO[local.tipo]

  return (
    <li className="card-local cartao">
      {/* Ícone e tipo na mesma linha; o nome e o endereço ficam embaixo, com a largura toda do card */}
      <div className="card-local__topo">
        <p className="card-local__tipo">
          <span className="card-local__icone" aria-hidden="true">
            <IconeTipo size={20} />
          </span>
          {nomeDoTipo(local)}
        </p>
        <h2 className="card-local__nome">{local.nome}</h2>
        <p className="card-local__endereco">{local.endereco}</p>
      </div>

      {/* Selos de acessibilidade */}
      <ul className="card-local__recursos" aria-label="Acessibilidade do local">
        {local.recursos
          .filter((r) => RECURSOS[r])
          .map((r) => {
            const Icone = ICONES_RECURSO[r]
            return (
              <li key={r} className="card-local__recurso">
                <Icone size={16} aria-hidden="true" />
                {RECURSOS[r]}
              </li>
            )
          })}
        {local.horario && (
          <li className="card-local__recurso">
            <IconClock size={16} aria-hidden="true" />
            {local.horario}
          </li>
        )}
      </ul>

      {/* Rodapé: a distância à esquerda e o "Como chegar" à direita.
          A distância fica aqui (e não ao lado do nome) para o nome e o endereço usarem a largura toda. */}
      <div className="card-local__rodape">
        <p className="card-local__distancia">
          {local.metros} m <span className="card-local__daqui">daqui</span>
        </p>
        <a
          className="botao botao--secundario botao--pequeno card-local__chegar"
          href={linkComoChegar(local)}
          target="_blank"
          rel="noreferrer"
        >
          Como chegar
          <IconArrowRight size={18} aria-hidden="true" />
          <span className="so-leitor"> (abre o Google Maps em outra aba)</span>
        </a>
      </div>
    </li>
  )
}
