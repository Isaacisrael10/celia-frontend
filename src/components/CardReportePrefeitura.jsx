import { IconDeviceCctv, IconUser, IconMapPin, IconClock, IconStairsDown, IconBarrierBlock } from '@tabler/icons-react'
import { TIPOS } from '../domain/reportes'
import { ORIGENS, SITUACOES_PREFEITURA, formatarDataHora } from '../domain/prefeitura'
import './CardReportePrefeitura.css'

const ICONES_TIPO = { buraco: IconStairsDown, obstaculo: IconBarrierBlock }

// Endereço do ponto no OpenStreetMap (abre em outra aba)
function linkDoMapa(reporte) {
  return `https://www.openstreetmap.org/?mlat=${reporte.lat}&mlon=${reporte.lng}#map=18/${reporte.lat}/${reporte.lng}`
}

/*
  Um reporte na caixa de entrada da Prefeitura.
  Mostra de onde veio (poste automático ou cidadão), o local, a data e a hora, o texto e a situação.
  - reporte: item de src/data/prefeitura.json ou enviado pela câmera do poste
*/
export default function CardReportePrefeitura({ reporte }) {
  const doPoste = reporte.origem === 'poste'
  const IconeOrigem = doPoste ? IconDeviceCctv : IconUser
  const IconeTipo = ICONES_TIPO[reporte.tipo] || IconStairsDown

  return (
    <li className={'reporte-pref cartao' + (reporte.novo ? ' reporte-pref--novo' : '')}>
      <div className="reporte-pref__topo">
        {reporte.fotoUrl ? (
          <img className="reporte-pref__foto" src={reporte.fotoUrl} alt="" />
        ) : (
          <span className="reporte-pref__icone" aria-hidden="true">
            <IconeTipo size={24} />
          </span>
        )}
        <span className="reporte-pref__textos">
          <span className={'reporte-pref__origem' + (doPoste ? ' reporte-pref__origem--poste' : '')}>
            <IconeOrigem size={16} aria-hidden="true" />
            {ORIGENS[reporte.origem]}
            {doPoste && reporte.poste ? ' · ' + reporte.poste : ''}
          </span>
          <span className="reporte-pref__tipo">
            {TIPOS[reporte.tipo] || 'Reporte'}
            {reporte.novo && <span className="reporte-pref__novo">Novo</span>}
          </span>
        </span>
      </div>

      <p className="reporte-pref__descricao">{reporte.descricao}</p>

      <dl className="reporte-pref__dados">
        <div>
          <dt>
            <IconMapPin size={18} aria-hidden="true" />
            <span className="so-leitor">Local</span>
          </dt>
          <dd>
            {reporte.rua}, {reporte.bairro}
          </dd>
        </div>
        <div>
          <dt>
            <IconClock size={18} aria-hidden="true" />
            <span className="so-leitor">Data</span>
          </dt>
          <dd>
            <time dateTime={reporte.criadoEm}>{formatarDataHora(reporte.criadoEm)}</time>
          </dd>
        </div>
      </dl>

      <div className="reporte-pref__rodape">
        <span className="reporte-pref__situacao">Situação: {SITUACOES_PREFEITURA[reporte.situacao]}</span>
        <a className="acao-texto" href={linkDoMapa(reporte)} target="_blank" rel="noreferrer">
          Ver no mapa<span className="so-leitor"> (abre em outra aba)</span>
        </a>
      </div>

      <p className="reporte-pref__regra">
        {doPoste ? 'Enviado sozinho pelo poste, sem revisão humana.' : 'Texto revisado pelo cidadão antes do envio.'}
      </p>
    </li>
  )
}
