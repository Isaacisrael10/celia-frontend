import {
  IconMap,
  IconRoute,
  IconMessageReport,
  IconMapPin,
  IconSchool,
  IconUserCircle,
  IconInfoCircle,
  IconMessageChatbot,
  IconBuildingBank,
} from '@tabler/icons-react'

// Ícone de cada ponto do grafo de navegação (os ids vêm de src/domain/navegacao.js)
const ICONES = {
  mapa: IconMap,
  rotas: IconRoute,
  reportar: IconMessageReport,
  locais: IconMapPin,
  trilha: IconSchool,
  perfil: IconUserCircle,
  sobre: IconInfoCircle,
  assistente: IconMessageChatbot,
  prefeitura: IconBuildingBank,
}

/*
  - id: 'mapa', 'rotas', 'reportar', 'locais', 'trilha', 'perfil', 'sobre', 'assistente' ou 'prefeitura'
  - tamanho: em px
  O ícone é só desenho: o nome da tela sempre aparece escrito ao lado.
*/
export default function IconeNo({ id, tamanho = 24 }) {
  const Icone = ICONES[id]
  return <Icone size={tamanho} stroke={2} aria-hidden="true" />
}
