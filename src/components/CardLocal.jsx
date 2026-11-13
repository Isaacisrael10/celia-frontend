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
} from '@tabler/icons-react'
import { TIPOS_LOCAL, RECURSOS, linkComoChegar } from '../domain/locais'
import './CardLocal.css'

const ICONES_TIPO = { banheiro: IconToiletPaper, descanso: IconArmchair }

// Ícone de cada recurso de acessibilidade
const ICONES_RECURSO = {
  'porta-larga': IconWheelchair,
  barras: IconAccessible,
  sombra: IconTree,
  banco: IconArmchair,
  bebedouro: IconDroplet,
  cobertura: IconUmbrella,
}

/*
  Card de um local: tipo, nome, endereço, distância, selos de acessibilidade
  e o botão "Como chegar" (abre o Google Maps com o caminho a pé).
*/
export default function CardLocal({ local }) {
  const IconeTipo = ICONES_TIPO[local.tipo]

  return (
    <li className="card-local">
      <div className="card-local__topo">
        <span className="card-local__icone" aria-hidden="true">
          <IconeTipo size={24} />
        </span>
        <div className="card-local__textos">
          <p className="card-local__tipo">{TIPOS_LOCAL[local.tipo]}</p>
          <h3 className="card-local__nome">{local.nome}</h3>
          <p className="card-local__endereco">{local.endereco}</p>
        </div>
        <p className="card-local__distancia">
          {local.metros} m<span className="so-leitor"> daqui</span>
        </p>
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
    </li>
  )
}
