/*
  Endereços das integrações, num lugar só.
  Os valores vêm do arquivo .env (veja .env.example). Nenhum deles é senha:
  a MockAPI e o canal do ThingSpeak são de leitura pública.
*/

// MockAPI: URL do recurso "reportes". Ex.: https://xxxx.mockapi.io/api/v1/reportes
export const REPORTES_URL = import.meta.env.VITE_REPORTES_URL || ''

// ThingSpeak: número do canal público do poste01 (o Caio vai passar)
export const THINGSPEAK_CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || ''

// API de visão do Caio (só roda na demonstração local)
export const VISAO_URL = import.meta.env.VITE_VISAO_URL || 'http://localhost:5000/analisar'
