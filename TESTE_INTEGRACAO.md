# Teste de integração: app + API + Wokwi (branch staging-test-integracao)

Roteiro para ver as três partes funcionando juntas na máquina de quem vai demonstrar.

## 1. API da equipe (repositório GS-C.E.L.I.A.-EDGE, pasta visao/api)

```
cd visao/api
.venv\Scripts\activate
uvicorn main:app --port 8000
```

Confira em http://127.0.0.1:8000: precisa mostrar `"modelo_pronto": true` (leva alguns segundos depois de ligar).

## 2. App

```
copy .env.example .env      (VITE_URL_API=http://127.0.0.1:8000)
npm install
npm run dev
```

Abra http://localhost:5173.

## 3. Wokwi

Abra a simulação do poste01 e clique em Play. Ele manda as leituras ao ThingSpeak (canal 3577155) e assina o tópico MQTT `celia/poste01/camera`.

## O que conferir

| Passo | Onde | Esperado |
| --- | --- | --- |
| 1 | Mapa | Trechos com a cor do status lido do ThingSpeak (HU-04) |
| 2 | Reportar, foto com buraco | "Preparando a IA…" (só se a API acabou de ligar), "Analisando a foto…", caixas sobre o buraco (HU-05) |
| 3 | Wokwi | LED vermelho e field6 = 5 no ThingSpeak depois da foto com buraco (HU-07) |
| 4 | Assistente | Resposta citando os trechos; se o Gemini falhar, o motivo e "Tentando de novo (1 de 3)" (HU-21) |
| 5 | Novo reporte, "Sugerir descrição com IA" | Texto no campo, editável antes de enviar (HU-22, RN07) |
| 6 | Trilha | Lições vindas da API (HU-19) |
