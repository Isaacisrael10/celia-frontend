/*
  Endereços das integrações, num lugar só.
  Nenhum deles é senha (ficam visíveis para quem abre o app), então podem ficar no código.
  O arquivo .env é opcional: serve só para trocar um endereço sem mexer aqui (ex.: testes).
*/

// MockAPI: URL do recurso "reportes" (a API externa do CRUD)
export const REPORTES_URL =
  import.meta.env.VITE_REPORTES_URL || 'https://6af6378ee844c7ff741b357c.mockapi.io/api/v1/reportes'

// ThingSpeak: canal público do poste01 (leitura sem chave, contrato em INTEGRACAO.md seção 2)
export const THINGSPEAK_CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '3577155'

// API da equipe (FastAPI do João). Por enquanto só roda no computador, na demonstração.
// Quando ela for para a VPS, só este endereço muda (no .env: VITE_URL_API).
export const URL_API = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000'

// Análise da foto (INTEGRACAO.md seção 4)
export const VISAO_URL = URL_API + '/analisar'
