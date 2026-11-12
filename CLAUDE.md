# C.E.L.I.A. · Front-end (contexto para o Claude Code)

> Caminhos em Liberdade, Inclusão e Acessibilidade
> FIAP Global Solution 2026.2 (CitizenTech) · Engenharia de Software 1º ano · Rio de Janeiro
> **Entrega: 19/11/2026, 23h55.** Responsável pelo front-end: Isaac.

Leia também, nesta ordem:
1. `docs/CELIA_frontend_plano.md`: plano completo (telas, dados, integrações, prioridades, checklist). **É a fonte principal.**
2. `docs/CELIA_design_system.md`: tokens e componentes. **Atenção às correções da seção "Decisões de design" abaixo, que valem mais que esse arquivo.**
3. `mapa/`: estilos próprios do mapa e código de referência.

Responda e comente o código em **português**. O código precisa ser simples e explicável por um aluno do 1º ano: "código que a equipe não sabe explicar não pontua".

---

## O projeto

Pessoas com deficiência física ou mobilidade reduzida enfrentam calçadas obstruídas, buracos e calor extremo **no caminho até o trabalho**. A C.E.L.I.A. mostra, antes de sair de casa, o status dos trechos monitorados por **postes com ESP32 nos pontos de ônibus**, recomenda a rota mais acessível e deixa a pessoa reportar problemas com foto analisada por IA.

- O projeto juntou a ideia original (calçadas acessíveis, em homenagem à Célia, avó de uma integrante) com a ideia do João (pessoas com deficiência no mercado de trabalho). O fio que liga as duas: **a barreira começa no caminho até o trabalho**.
- Heroína do pitch: uma trabalhadora com deficiência física que vai ao trabalho a pé e de ônibus.

### Equipe e partes
- **Caio:** Edge (ESP32 no Wokwi com DHT22 + HC-SR04 + OLED + LED RGB, envio ao ThingSpeak) e visão computacional (YOLOv8 + modelo próprio de buracos, API Flask `/analisar`, MQTT para o ESP32).
- **João:** outras partes do grupo.
- **Isaac:** front-end = disciplinas **Front-end Design** (prof. Fábio Alencar) e **Web Development** (prof. Igor Araujo), **no mesmo repositório**.

---

## O que os professores avaliam

**Front-end Design (Fábio):** React + Hooks + **Custom Hooks**; **CRUD com API externa**; separação entre lógica de negócio, acesso a dados e apresentação; componentização; **histórico de commits**; README.md e AI.md claros. Entregáveis: repositório GitHub, ZIP, README.md, AI.md, Integrantes.md.

**Web Development (Igor):** no mínimo **2 interações** em JavaScript (funções, DOM, operadores, condicionais) + **modo claro/escuro**. Mesmos entregáveis, mesmo repositório.

Regras gerais da GS: nada de dados pessoais reais (dados simulados ou públicos, com fonte); registrar o uso de IA (AI.md / prompts); repositório público; todo mundo sabe explicar o código.

---

## Integrações (contratos)

### ThingSpeak (status do poste, leitura pública sem chave)
`GET https://api.thingspeak.com/channels/{CHANNEL_ID}/feeds.json?results=20`
- field1 temperatura · field2 umidade · field3 índice de calor · field4 distância livre (cm)
- field5 **status**: 0 verde · 1 amarelo · 2 vermelho
- field6 **motivo**: 0 nenhum · 1 calçada · 2 calor · 3 ambos · 4 veículo · 5 buraco
- ESP32 envia a cada 20 s → app busca a cada 20 s.
- **Sem leitura há mais de 10 min → "Sem dados" (cinza).**
- Só existe um poste (`poste01`): só um trecho do mapa é ao vivo.
- **Pendente:** CHANNEL_ID (Caio).

### API de visão (Flask, só na demonstração local)
- `POST http://localhost:5000/analisar` com a foto (multipart).
- Resposta esperada (a confirmar): `{ "resultado": "livre|obstaculo|buraco", "caixas": [{ "x1","y1","x2","y2","classe","confianca" }] }`
- **Pendentes com o Caio:** formato final, coordenadas em pixels ou normalizadas, nome do campo do arquivo, CORS liberado.
- O professor de Edge aceitou a demonstração rodando no computador. **Plano B obrigatório:** se a API não responder (versão publicada, avaliada pelos professores de Front e Web), mostrar mensagem amigável ("A análise por IA roda na demonstração local. Veja o vídeo no README.") e permitir criar o reporte como "Não analisada". Nunca erro cru.

### MockAPI (CRUD de reportes = a "API externa" do Fábio)
Recurso `reportes`: id, rua, tipo (buraco/obstaculo/livre/nao_analisada), descricao, status (aberto/enviado/resolvido), fotoUrl, lat, lng, criadoEm.
**Pendente:** confirmar com o prof. Fábio que MockAPI vale como API externa.

### Dados fixos no projeto
`trechos.json`, `rotas.json` (2 ou 3 rotas pré-definidas), `locais.json` (banheiros e descanso, com fonte).

---

## Telas

Barra inferior: **Mapa · Rotas · Reportar · Locais · Perfil**. Detalhes em `docs/CELIA_frontend_plano.md`, seção 3.

---

## Decisões de design (valem mais que o design system antigo)

- **Handoff do Claude Design em `design/` (12/11).** Decisão do Isaac: usar **100% do visual e dos componentes** de `design/README.md` (tokens, tipografia, botões, campos, cards, barra inferior, toast), mas montar **as telas deste plano**. O design foi feito para um conceito antigo (sensor na cadeira, largura + inclinação, aba Dispositivo, Assistente com IA, tela "Entre como"): **ignorar essas telas**. Adaptações: Detalhe do trecho mostra distância livre + calor; widget de calor e alerta de trecho seguem o padrão "Aviso" do design; Novo reporte usa os campos do design + etapa da foto; aba Dispositivo vira Locais.
- **Paleta:** resolvida pelo design. `--primary` `#2257D6` (claro) / `#8DB0FF` (escuro), tokens em `src/styles/tokens.css`. O azul `#2D6BFF` da opção 6 só em áreas decorativas grandes (não passa contraste em texto).
- **Direção visual:** direta e legível, estilo sinalização urbana. **Sem gradientes, sem botão 3D, sem o estilo do NeuroLar** (o design system antigo cita o NeuroLar como referência e a fonte Nunito; isso foi descartado).
- **Fonte:** Atkinson Hyperlegible (Google Fonts), criada para baixa visão.
- **Sem o padrão de ondas da pedra portuguesa.** Foi testado e reprovado.
- **Semáforo:** verde, amarelo e vermelho **só** nas faixas. Sempre cor + ícone (✓ ! ✕ ?) + nome escrito + tipo de linha no mapa (contínua, tracejado longo, tracejado curto, pontilhado). O **motivo** aparece junto ("Perigo · calor").
  - Claro: `#1E8E3E` · `#B26A00` · `#C62828` · sem dados `#6B717B` (contorno tracejado)
  - Escuro: `#5BD08A` · `#F2B84B` · `#FF7A7A` · sem dados `#A0A6B0` (contorno tracejado)
- **Nomes das faixas: pendentes.** O Edge usa "acessível / atenção / evite"; o design usava "Normal / Atenção / Perigo". Precisa ser igual no app, no Python e no Edge. Centralizar em `src/domain/faixas.js` para trocar num lugar só.
- **Acessibilidade:** contraste AA nos dois modos; corpo ≥ 16 px, nada < 13 px; toque ≥ 48 px; leitor de tela (rótulos em botões de ícone, ordem lógica, alternativa em lista para o mapa); linguagem simples.

### Mapa
- **MapLibre GL** (`maplibre-gl` + `react-map-gl`) com tiles do **OpenFreeMap** (gratuito, sem chave).
- Usar os estilos próprios `mapa/celia-mapa-claro.json` e `mapa/celia-mapa-escuro.json` como `mapStyle`.
- `mapa/mapa_referencia.html` mostra como desenhar os trechos (linha 5,5 px com brilho da própria cor, tracejados por faixa, camadas abaixo de `highway-name-minor` para os nomes ficarem por cima), selos ! e ✕ no meio dos trechos em Atenção/Perigo, e os marcadores "Você", destino e reporte.
- `mapa/ruas.json`: ruas de exemplo da Tijuca (bairro real ainda não escolhido).
- **Não usar CARTO** (passou a exigir chave). Manter o crédito "OpenFreeMap © OpenMapTiles Data from OpenStreetMap".

---

## Arquitetura

```
src/
  services/   thingspeak.js · reportesApi.js · visaoApi.js        (acesso a dados, sem React)
  hooks/      useStatusPoste · useReportes · useAnaliseFoto · useTema · useRotas   (custom hooks)
  domain/     faixas.js (nomes, cores, ícones, textos de motivo)  (regras puras)
  components/ BadgeFaixa · CardTrecho · CardRota · CardReporte · WidgetCalor · AlertaTrecho · Mapa · FotoComCaixas · BarraInferior
  pages/      Mapa · Rotas · Reportar · NovoReporte · Locais · Perfil
  data/       trechos.json · rotas.json · locais.json
  styles/     tokens claro/escuro + estilos do mapa
```
Stack: React + Vite, React Router, maplibre-gl/react-map-gl.

---

## Prioridade (linha de corte)

1. Projeto, repositório público, estrutura, tema claro/escuro
2. CRUD de reportes (MockAPI)
3. Mapa com estilos próprios e trechos
4. Poste ao vivo (ThingSpeak) + widget de calor + regra dos 10 min
5. Novo reporte com foto + API de visão + caixas + plano B
6. Rotas (comparação pré-definida)
7. Alerta de trecho que mudou
— linha de corte —
8. Locais · 9. Modo chuva (comportamento ainda não definido) · 10. Mini histórico do poste
Por último: README, AI.md, Integrantes.md, ZIP.

---

## Forma de trabalhar

- **Commits pequenos e frequentes**, com mensagens claras em português (o histórico vale nota).
- Registrar prompts relevantes no **AI.md**.
- Nenhuma chave no repositório.
- Não mexer nas partes dos colegas; integração só pelo que foi combinado (contratos acima).
- Fora do escopo: camada TEA (cortada em 11/11), chatbot (não está no backlog), login.
- Em dúvida sobre algo pendente (cor da opção 6, nomes das faixas, bairro, modo chuva, ODS), **perguntar ao Isaac** em vez de inventar.
