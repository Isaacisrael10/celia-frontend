import { IconMapPin, IconClock, IconDroplet, IconTemperature } from '@tabler/icons-react'
import { nivelDoCalor, textoGraus, horaDoAlerta } from '../domain/prefeitura'
import './CardAlertaCalor.css'

/*
  Card pequeno de um alerta de calor no ponto de ônibus.
  A cor (verde, amarelo ou vermelho) vem do índice de calor medido pelo poste.
  A cor nunca vem sozinha: o nível também aparece escrito, com um ícone (✓ ! ✕).
  - alerta: { poste, local, indiceCalor, temperatura, umidade, horario }
*/
export default function CardAlertaCalor({ alerta }) {
  const nivel = nivelDoCalor(alerta.indiceCalor)

  return (
    <li className={'alerta-calor cartao alerta-calor--' + nivel.id} style={{ '--cor-nivel': nivel.cor }}>
      <div className="alerta-calor__topo">
        <span className="alerta-calor__selo">
          <span className="alerta-calor__icone" aria-hidden="true">
            {nivel.icone}
          </span>
          {nivel.nome}
        </span>
        <span className="alerta-calor__hora">
          <IconClock size={16} aria-hidden="true" />
          <time dateTime={alerta.horario}>{horaDoAlerta(alerta.horario)}</time>
        </span>
      </div>

      <p className="alerta-calor__graus">
        {textoGraus(alerta.indiceCalor)}
        <span className="alerta-calor__rotulo">índice de calor (sensação térmica)</span>
      </p>

      <p className="alerta-calor__local">
        <IconMapPin size={16} aria-hidden="true" />
        <span>
          <strong>{alerta.poste}</strong> · {alerta.local}
        </span>
      </p>

      <p className="alerta-calor__medidas">
        <span>
          <IconTemperature size={16} aria-hidden="true" />
          {textoGraus(alerta.temperatura)}
        </span>
        <span>
          <IconDroplet size={16} aria-hidden="true" />
          {alerta.umidade}% de umidade
        </span>
      </p>

      <p className="alerta-calor__orientacao">{nivel.orientacao}</p>
    </li>
  )
}
