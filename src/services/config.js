/*
  Endereços das integrações, num lugar só.
  Nenhum deles é senha (ficam visíveis para quem abre o app), então podem ficar no código.
  O arquivo .env é opcional: serve só para trocar um endereço sem mexer aqui (ex.: testes).
*/

// MockAPI: URL do recurso "reportes" (a API externa do CRUD)
export const REPORTES_URL =
  import.meta.env.VITE_REPORTES_URL || 'https://6af6378ee844c7ff741b357c.mockapi.io/api/v1/reportes'

// ThingSpeak: número do canal público do poste01 (canal "GS-EDGE-C.E.L.I.A.")
export const THINGSPEAK_CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '3577155'

/*
  API da equipe em Python (FastAPI): analisa a foto (/analisar) e serve a mini trilha de IA (/trilha).
  Ela roda no servidor da equipe (VPS, com HTTPS), então funciona também no app publicado.
  Para testar com a API rodando no próprio computador, coloque VITE_URL_API=http://127.0.0.1:8000 no .env.
*/
export const API_URL = import.meta.env.VITE_URL_API || 'https://2-29-156-251.sslip.io'

// Rota da análise de foto [HU-05, RF08]
export const VISAO_URL = import.meta.env.VITE_VISAO_URL || API_URL + '/analisar'

// Rota da mini trilha de IA [HU-19, RF18]
export const TRILHA_URL = API_URL + '/trilha'

// Endereços que só existem dentro do próprio computador
const ENDERECOS_LOCAIS = ['localhost', '127.0.0.1']

/*
  A API está ao alcance deste app?
  Se o app está publicado na internet e a API ainda mora em "localhost", não adianta chamar:
  ela só existe no computador da demonstração. Nesse caso o app vai direto para o plano B.
  Ex.: app em localhost:5173 + API em 127.0.0.1:8000 → true
       app publicado       + API em 127.0.0.1:8000 → false
*/
export function apiAoAlcance(url) {
  try {
    const apiLocal = ENDERECOS_LOCAIS.includes(new URL(url).hostname)
    const appLocal = ENDERECOS_LOCAIS.includes(window.location.hostname)
    return !apiLocal || appLocal
  } catch {
    // endereço escrito de um jeito que o navegador não entende: deixa a chamada tentar
    return true
  }
}
