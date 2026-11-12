/*
  Endereços das integrações, num lugar só.
  Nenhum deles é senha (ficam visíveis para quem abre o app), então podem ficar no código.
  O arquivo .env é opcional: serve só para trocar um endereço sem mexer aqui (ex.: testes).
*/

// MockAPI: URL do recurso "reportes" (a API externa do CRUD)
export const REPORTES_URL =
  import.meta.env.VITE_REPORTES_URL || 'https://6af6378ee844c7ff741b357c.mockapi.io/api/v1/reportes'

// ThingSpeak: número do canal público do poste01 (o Caio vai passar)
export const THINGSPEAK_CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || ''

// API de visão do Caio (só roda na demonstração local)
export const VISAO_URL = import.meta.env.VITE_VISAO_URL || 'http://localhost:5000/analisar'
