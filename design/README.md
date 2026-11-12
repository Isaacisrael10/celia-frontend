# Handoff: C.E.L.I.A. — App mobile (Sinalização urbana)

**C.E.L.I.A.** = Caminhos em Liberdade, Inclusão e Acessibilidade. Projeto acadêmico (FIAP, Engenharia de Software, 1º ano). Front-end alvo: **React**.

## Overview
Mapa de calçadas acessíveis no Rio de Janeiro. Um dispositivo com sensores (preso na cadeira de rodas, no andador ou na bengala) mede **largura livre** e **inclinação** de cada trecho. Cada trecho recebe um índice de risco de 0 a 100 e uma faixa: **Normal**, **Atenção**, **Perigo** ou **Sem dados**. O app mostra os trechos no mapa, recomenda a rota mais acessível (que nem sempre é a mais curta), permite reportar problemas e tem um assistente com IA.

Público: cadeirantes, pessoas com mobilidade reduzida, idosos e pessoas cegas (leitor de tela). **Acessibilidade é o centro do projeto.**

## About the Design Files
Os arquivos `.dc.html` deste pacote são **referências de design feitas em HTML**: protótipos que mostram o visual e o comportamento esperados. **Não são código de produção para copiar.** A tarefa é **recriar estes designs em React**, usando os padrões do projeto (se já existir) ou uma stack adequada (sugestão: Vite + React + TypeScript, CSS Modules ou Tailwind com os tokens abaixo, React Router, ícones `@tabler/icons-react`).

Para ver os protótipos, abra os `.dc.html` no navegador, com o `support.js` na mesma pasta.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos, bordas e textos são finais. Recriar fielmente.
Exceção: o **mapa** é uma imagem estática (`mapa_claro_celular.png` / `mapa_escuro_celular.png`). No app real ele vem de uma **API externa de mapas** (ex.: Leaflet/MapLibre + tiles OSM), com os trechos desenhados como camada por cima, seguindo as regras de linha da seção "Semáforo".

---

## Design Tokens

### Cores — modo claro
| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F7F5F0` | Fundo das telas (branco creme) |
| `--card` | `#FFFFFF` | Cards, barra inferior, campos |
| `--ink` | `#1C1F24` | Texto principal, bordas fortes, balão do usuário |
| `--muted` | `#55595F` | Texto secundário (6,6:1 no bg) |
| `--line-soft` | `#D6D1C6` | Divisórias decorativas |
| `--line-strong` | `#1C1F24` | Bordas de componentes (campos, cards) |
| `--primary` | `#2257D6` | Ação principal sólida, destaque de aba, recomendada (6,17:1 com branco) |
| `--on-primary` | `#FFFFFF` | Texto sobre primary |
| `--link` | `#1A44A8` | Links e ações em texto (8,6:1) |
| `--head` | `#1C1F24` | Cabeçalho (grafite) |
| `--on-head` | `#F7F5F0` | Texto do cabeçalho |
| `--focus` | `#1C1F24` | Anel de foco |

### Cores — modo escuro
| Token | Hex |
|---|---|
| `--bg` | `#121316` |
| `--card` | `#1C1F24` |
| `--ink` | `#F2F0EB` |
| `--muted` | `#B4B8BF` |
| `--line-soft` | `#33373E` |
| `--line-strong` | `#8A919C` |
| `--primary` | `#8DB0FF` (7,7:1 no card) |
| `--on-primary` | `#121316` |
| `--link` | `#8DB0FF` |
| `--head` | `#000000` |
| `--on-head` | `#F2F0EB` |
| `--focus` | `#F2F0EB` |

Azul elétrico de marca `#2D6BFF` e azul-gelo `#DCE6FF` vêm da paleta original (opção 6). `#2D6BFF` só passa 4,51:1 no branco, por isso **não** é usado em texto ou botão. Pode aparecer em áreas grandes e decorativas.

### Semáforo (RESERVADO)
Verde, âmbar e vermelho **só** aparecem nos marcadores de faixa (badges, linhas do mapa, barra de risco). Em nenhum outro lugar: erros de formulário, "Excluir" e status de reporte/dispositivo usam apenas grafite e azul.

| Faixa | Índice | Claro (fill / ícone) | Escuro (fill / ícone) | Ícone | Linha no mapa |
|---|---|---|---|---|---|
| Normal | 0–39 | `#1E8E3E` / `#FFF` | `#5BD08A` / `#121316` | ✓ `ti-check` | contínua, 6 px, ponta redonda |
| Atenção | 40–69 | `#B26A00` / `#FFF` | `#F2B84B` / `#121316` | ! `ti-exclamation-mark` | traço longo `14 6`, 6 px |
| Perigo | 70–100 | `#C62828` / `#FFF` | `#FF7A7A` / `#121316` | ✕ `ti-x` | traço curto `7 5`, 6 px |
| Sem dados | — | contorno tracejado `#6B717B` | contorno tracejado `#A0A6B0` | ? `ti-question-mark` | pontilhada `0.1 9`, 5 px, redonda |

Regras:
- **Nunca depender só de cor.** Cada faixa sempre tem cor + ícone + nome escrito + tipo de linha.
- No modo claro, verde e âmbar têm ~4,2:1 no branco. Use-os como fill de marcador com ícone branco, nunca como cor de texto.
- Marcador de faixa = quadrado de cantos 2 px (28, 32, 36 ou 56 px), fill sólido e ícone centralizado. "Sem dados" = fundo transparente + borda `2px dashed`.
- Amostra da legenda (SVG 84×34): fundo `#EEF0F4` / `#1A1E26`, faixa de rua branca / `#2B303A` de 12 px, brilho da cor com 20% (claro) ou 28% (escuro) de opacidade e 16 px, linha da faixa, e no centro um círculo r=11 com a cor e anel de 2,5 px na cor do card, com o ícone desenhado.

### Tipografia
- Família: **Atkinson Hyperlegible** (Google Fonts, 400 e 700), feita para baixa visão. Fallback: `system-ui, sans-serif`.
- Nada abaixo de 13 px (rótulos da barra inferior e legenda). Texto de leitura ≥ 16 px.

| Papel | Tamanho / altura de linha | Peso |
|---|---|---|
| Título do cabeçalho | 30 / 1.0, letter-spacing −0,01em | 700 |
| Título da tela "Entre como" | 34 / 1.1 | 700 |
| Número grande (minutos, medidas) | 40–56 / 0.9, letter-spacing −0,02em | 700 |
| Título de seção (h2) | 22–26 | 700 |
| Título de card (h3) | 19–22 | 700 |
| Corpo | 16–18 / 1.45 | 400 |
| Botão | 17–18 | 700 |
| Secundário | 14–15 | 400 |
| Rótulo da barra inferior | 13 / 1.0, sem quebra | 700 |

### Forma e espaçamento
- Raio: **4 px** em botões, cards e campos. **2 px** em marcadores. Círculo só em: microfone, botão flutuante do assistente, campo de mensagem (pílula 24 px), "Você" e radios.
- Bordas: 2 px (componentes), 3 px (card recomendado, modo selecionado, campo com erro).
- Espaçamento: margem lateral da tela 16 px. Gaps de 4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24.
- **Sem sombras, sem gradientes, sem botão 3D.** Pedra portuguesa e ondas foram removidas.
- Frame de referência: 390×844.

### Alvos de toque
Mínimo 44×44. Botões principais têm 56 px de altura, os secundários 48–52, cada aba da barra inferior 78 px de altura, e as linhas de lista 64–96 px.

---

## Componentes

**Botão primário** (no máximo 1 por tela): altura 56, raio 4, bg `--primary`, texto `--on-primary` 18/700. Texto à esquerda e ícone de seta à direita (`justify-content:space-between; padding:0 18px`), ou centralizado em grupos.
**Botão secundário**: mesma geometria, `background:transparent; border:2px solid var(--ink); color:var(--ink)`.
**Ação em texto**: sem fundo, `color:var(--link)`, 16–17/700, sublinhado com `text-underline-offset:4px`, altura 44–48.
**Estado "selecionado"** (ex.: rota atual): borda `2px dashed var(--ink)` e ícone ✓.
**Cabeçalho**: altura mínima 76, bg `--head`, padding 14/16. Botão voltar de 48×48 com contorno de 2 px. Espaço da logo de 48×48 com borda tracejada e texto "logo" (**não criar logo**).
**Barra inferior**: 5 colunas `minmax(0,1fr)`, altura 78, `border-top:2px solid var(--ink)`, ícone 26, rótulo 13/700 `nowrap`. A aba ativa usa `color:var(--ink)` e uma barra azul de 5 px no topo (`box-shadow: inset 0 5px 0 var(--primary)`), com `aria-current="page"`. Abas: Mapa, Rotas, Reportes, Dispositivo, Perfil.
**Abas (Mapa/Lista, simulação)**: texto 17/700 com sublinhado de 4 px na cor `--ink` quando ativa, e `--muted` quando inativa. São visualmente diferentes de botão.
**Card**: bg `--card`, `border:2px solid var(--line-strong)`, raio 4, padding 14.
**Campo**: altura 52, raio 4, `border:2px solid var(--line-strong)`, 18/400. Rótulo visível em 17/700 acima e dica em 15/400 `--muted`. **Erro**: borda de 3 px `--ink` + ícone `ti-info-square-filled` + texto em 16/700, com `role="alert"` e `aria-invalid`. Não usar vermelho.
**Radio**: círculo de 26 px com borda de 2 px `--ink` e ponto de 12 px quando marcado. Linha com min-height 52 e divisória de 1 px.
**Switch**: trilho retangular de 56×32 com borda de 2 px e botão quadrado de 22 px. Ligado: trilho `--primary`, botão `--on-primary`. Tem texto "Ligado/Desligado" ao lado.
**Status de reporte** (sem semáforo): quadrado de 14 px + "Situação: X". Aberto = só contorno de 2 px `--ink`; Enviado à prefeitura = fill `--primary`; Resolvido = fill `--ink`.
**Toast**: no rodapé acima da barra (`bottom:90`), bg `--ink`, texto `--bg` 16/700, raio 4, some em 2,8 s. Também é anunciado em uma região `aria-live="polite"`.

---

## Telas

### 1. Entre como
Bloco superior grafite (`--head`, padding 40/20/28) com o espaço da logo (112×112, tracejado), h1 "Calçada boa é calçada para todo mundo" (34) e o texto "Veja onde dá para passar com segurança nas ruas do Rio." (18). Abaixo, h2 "Entre como" e uma lista com `border-top:2px ink`. Cada linha (min-height 96) tem um quadrado azul de 52 com ícone, título 20/700, descrição 16 e seta.
- Pessoa usuária: "Ver o mapa e as rotas acessíveis" → Mapa
- Voluntário: "Mapear trechos com o dispositivo" → Dispositivo
- Prefeitura: "Receber relatórios dos trechos com problema" → Reportes
Não tem cabeçalho nem barra inferior.

### 2. Mapa
1. **Aviso** (`role="alert"`, aparece se a rota atual passa por Perigo): card com borda de 2 px `--ink`, marcador Perigo de 40 px e o texto "Daqui a 2 quarteirões há um trecho em Perigo. Quer desviar?" (18/700). Botões em grid 1fr 1fr: **Desviar →** (primário) e **Seguir assim** (secundário).
2. **Abas** Mapa | Lista.
3. **Mapa**: altura 300 px, borda inferior de 2 px `--ink`. Botão "Centralizar no meu local" de 48×48 no canto inferior direito. Crédito "© OpenStreetMap" (13 px) no canto inferior esquerdo. Cada trecho é clicável e focável (alvo ≥ 44 px), com aria-label "Rua X, nº A a B: Faixa. Ver detalhes" → Detalhe.
4. **Legenda** (`section aria-label="Legenda"`): grid de 4 colunas com divisórias de 2 px. Cada coluna tem a amostra SVG, o nome (15/700) e o intervalo (13: "risco 0–39", "risco 40–69", "risco 70+", "não medido"). Embaixo, a linha de símbolos: Você (ponto azul com halo), Destino (gota azul), Reporte (balão).
5. **Botão flutuante do assistente**: círculo de ≥ 64 px, bg `--primary`, ícone de balão, `aria-label="Abrir assistente"`. Fica no canto inferior direito, acima da barra inferior. Abre o Assistente em tela cheia.
6. **Lista**: uma linha por trecho (min-height 76) com marcador de 36, nome 18/700, "Faixa · nº A a B" e seta.

### 3. Detalhe do trecho
Cabeçalho "Trecho" com botão voltar. Mostra o h2 com o nome da rua (28), "nº A a B · Tijuca", uma faixa entre bordas de 2 px `--ink` com marcador de 56 e "Faixa" + nome (28/700), e uma explicação (18).
Explicações:
- Normal: "Calçada larga e plana. Boa para cadeira de rodas, andador e bengala."
- Atenção: "Dá para passar, mas com cuidado. Tem partes estreitas ou inclinadas."
- Perigo: "Calçada estreita e muito inclinada. Prefira outro caminho."
- Sem dados: "Ninguém mediu este trecho ainda. Você pode ajudar como voluntário." (neste caso, os cards de medida ficam ocultos)

Cards de 2 colunas: **Largura livre** (`ti-arrows-horizontal`, número 40 + "cm") e **Inclinação** (`ti-angle`, número 40 + "°"). Card **Índice de risco**: "78 de 100", uma barra segmentada 40/30/30 nas cores do semáforo com um marcador `--ink` de 8 px, a escala "0 Normal · 40 Atenção · 70 Perigo" e o texto "Medido N vezes por voluntários. Última medição em 04/11/2026."
Ações: primária **Evitar este trecho nas rotas** (alterna para "Este trecho será evitado" ✓) e secundária **Reportar problema aqui** (abre o formulário já com o endereço preenchido).

### 4. Rotas
Origem/destino em grid com marcadores A/B (quadrados `--ink` de 32 com letra) ligados por uma barra de 4 px. Botão de inverter de 48×48. Título "2 caminhos" + "do mais seguro ao mais curto", com `border-top:2px ink`.
- **Mais acessível** (recomendada): borda de 3 px `--primary`, faixa superior sólida `--primary` com "★ RECOMENDADA" (16/700, maiúsculas, letter-spacing .04em). Mostra 15 min (48), "1,1 km · risco médio 21", a sequência "Trechos no caminho" (marcadores de 32 de altura, `flex:1`), "4 Normal · 1 Atenção · 0 Perigo", a nota e o botão primário.
- **Mais curta**: borda de 2 px `--line-strong`. Mostra 12 min, "0,9 km · risco médio 44" e "2 Atenção · 1 Sem dados · 1 Perigo", com um alerta (marcador Perigo + "**Passa por 1 trecho em Perigo.** …"). Botão secundário.
- Escolher uma rota volta ao Mapa e mostra um toast. A rota atual mostra "Rota atual ✓" com borda tracejada. Se a rota for a mais curta, o aviso de Perigo aparece no Mapa.

### 5. Reportes
Lista: no topo, o botão primário **Novo reporte +** e o contador "N reportes". Cada item tem um ícone do tipo (quadrado de 44 com contorno), o tipo (19/700), o endereço e a data, o status "Situação: X" e as ações em texto **Editar** (link) e **Excluir**. Ao excluir, aparece uma confirmação embutida (`role="alertdialog"`): "Excluir este reporte? Não dá para desfazer." com **Sim, excluir** (fill `--ink`) e **Cancelar**.
Lista vazia: um ícone tracejado + "Nenhum reporte ainda" + "Viu um buraco ou uma rampa quebrada? Conte para a gente."
Formulário (Novo/Editar, o cabeçalho ganha o botão voltar):
- **Endereço do problema** (obrigatório, dica "Rua e número.", erro "Escreva a rua e o número.")
- **Tipo de problema** (select): Buraco na calçada, Rampa quebrada, Obstáculo na calçada, Calçada estreita, Piso solto ou irregular
- **O que você viu?** (textarea, obrigatório ao criar, erro "Escreva pelo menos uma frase.")
- **Situação** (radios): Aberto, Enviado à prefeitura, Resolvido
- Botões: primário **Enviar reporte** / **Salvar alterações**, e ação em texto **Cancelar**. Toasts: "Reporte enviado. Obrigado!", "Reporte atualizado.", "Reporte excluído."

### 6. Dispositivo
Bloco de status no topo (`role="status"`), ocupando a largura toda:
- **Gravando**: bg `--primary`, texto `--on-primary`, ponto pulsando (`celiaPulse` 1,4 s), texto "Medindo a largura e a inclinação da calçada agora."
- **Dados enviados**: bg `--card`, borda de 2 px `--ink`, ponto azul, "Último envio às 14:32. Tudo certo."
- **Sem sinal**: bg `--bg`, borda tracejada, ponto só com contorno tracejado, "Guardando as medidas para enviar depois."
Também mostra "CELIA-S1 · nº 0427" e "Bateria 82%". Botão primário **Pausar gravação** / **Começar a gravar**.
"Onde o dispositivo está preso?" é um radiogroup com 2 cards (min-height 88):
- **Cadeira ou andador**: "Mede a largura livre e a inclinação da calçada."
- **Bengala**: "Avisa obstáculos com vibração e som."
O selecionado tem borda de 3 px `--primary` e ícone com fill azul.
(O protótipo tem as abas "Demonstração: simular estado" só para a apresentação. Remover em produção.)

### 7. Perfil
Avatar quadrado azul de 64 com as iniciais, o nome "Marina Couto" (26) e "Voluntária desde março". Abaixo, o número "38" (56) com "trechos mapeados este mês" e uma barra de progresso de 16 px (`role="progressbar"`, 38/50) com marcas em 10 e 25 e o texto "Meta 50", seguido de "Faltam 12 para a meta do mês."
Ajustes (switches): **Modo escuro**, **Avisos por voz**. Botão secundário **Trocar perfil** → Entre como.

### 8. Assistente (IA) — `CELIA Assistente.dc.html`
Abre em tela cheia pelo botão flutuante do Mapa. **Não é uma aba.** O cabeçalho tem o botão voltar ("Voltar para o mapa") e o título "Assistente". Abaixo dele vem uma faixa discreta (14 px `--muted`, ícone `ti-sparkles`): "Respostas geradas por IA. Confira informações importantes."
A conversa fica em `main role="log" aria-live="polite"`, e cada nova mensagem é anunciada.
- **Mensagem do usuário**: alinhada à direita, max-width 82%, rótulo "Você" (14/700 `--muted`) acima. Balão bg `--ink`, texto `--bg` 17/1.4, raio `4 4 0 4`.
- **Mensagem do assistente**: largura total e alinhada à esquerda, **sem balão**, em `article aria-label="Assistente"`. Cabeçalho com um quadrado azul de 24 (`ti-message-chatbot`) + "Assistente". Texto 17/1.45. Depois de cada resposta vem a ação em texto **Ouvir resposta** (`ti-volume`).
- Tipos de resposta:
  - **Rota**: card com "Mais acessível", 15 min (40), "1,1 km · risco médio 21", "Pior trecho:" + marcador Atenção, e o botão secundário **Ver no mapa**.
  - **Trecho**: card com "Rua Conde de Bonfim", "nº 300 a 380", marcador de faixa, e "Largura livre 118 cm" e "Inclinação 3,1°" em 2 colunas.
  - **Direitos**: texto curto + divisória + "Fonte: Prefeitura do Rio" + link **Saiba mais** (`ti-external-link`).
  - **Sem dados**: caixa com borda `2px dashed` cinza "Sem dados" e o texto "Ainda não tenho dados sobre esse trecho. Quer reportar um problema?", com o botão secundário **Reportar**.
- **Campo de mensagem** (estilo WhatsApp, compacto): uma linha com padding 8/10 e `border-top:2px ink`. Pílula de 48 px de altura e raio 24, borda de 2 px, com o input 16 px (placeholder e aria-label "Escreva ou fale sua pergunta") e o botão enviar de 44×44 (`ti-send`) dentro. Ao lado, o **microfone**: círculo de 52 px, bg `--primary`, ícone 26, `aria-label="Falar sua pergunta"`. O microfone é sempre o botão mais forte da área.
- **Estados ainda por desenhar** (seguir o mesmo sistema):
  - *Primeiro acesso*: saudação "Oi! Posso te ajudar a encontrar um caminho mais acessível." e 3 sugestões em botões grandes (secundários, largura total, min-height 56): "Qual o caminho mais acessível até o posto de saúde?", "Como está a calçada da Rua Conde de Bonfim?", "Tenho direito a passagem gratuita?"
  - *Ouvindo por voz*: tela focada no microfone (círculo grande `--primary` com pulso), "Ouvindo…" (`aria-live`), transcrição em tempo real em texto grande (≥ 24 px) e o botão primário **Parar** com largura total.
  - Modo escuro de todos os estados, com os tokens do modo escuro.
- Back-end: um LLM com acesso aos dados do app (trechos, faixas, rotas, reportes). Ele não é um chat genérico e responde em frases curtas e simples. Leitura em voz alta: Web Speech API (`speechSynthesis`, pt-BR). Ditado: `SpeechRecognition` pt-BR.

---

## Interações e estado
Estado global sugerido (Context ou Zustand):
- `theme: 'light' | 'dark'` (o switch do Perfil e o `prefers-color-scheme` como padrão)
- `route: 'acessivel' | 'curta'`, `avisoVisivel: boolean`
- `avoidedSegments: Set<id>`
- `reports: {id, tipo, endereco, descricao, data, status}[]` (CRUD)
- `device: {status: 'gravando'|'enviado'|'semsinal', mode: 'cadeira'|'bengala', bateria}`
- `vozAtiva: boolean`
- `chat: {role:'user'|'assistant', kind:'text'|'route'|'segment'|'rights'|'nodata', payload}[]`, `listening: boolean`, `transcript: string`

Navegação: entrar → (mapa | dispositivo | reportes). Pela barra inferior: mapa, rotas, reportes, dispositivo, perfil. Do mapa ou da lista se abre o trecho (voltar retorna à origem). Do trecho se abre "reportar" (vai para o formulário preenchido). No mapa, o botão flutuante abre o assistente.

Animações: só `celiaIn` (opacity 0→1 e translateY 6→0, 0,2–0,25 s) em avisos e toasts, e `celiaPulse` no "Gravando". Respeitar `prefers-reduced-motion` desligando todas.

## Acessibilidade (obrigatório)
- Contraste AA: 4,5:1 para texto e 3:1 para ícones e bordas, nos dois modos. Já está verificado nos tokens acima.
- Foco visível em tudo: `outline:3px solid var(--focus); outline-offset:2px`.
- Ordem de leitura: cabeçalho → aviso → conteúdo → barra inferior. Usar landmarks (`header`, `main`, `nav`) e `h1` por tela.
- Ícones decorativos com `aria-hidden="true"`. Botões só com ícone sempre têm `aria-label`.
- Mapa: a aba **Lista** é a alternativa completa para o leitor de tela. Os trechos no mapa são focáveis por teclado (Enter ou Espaço).
- Linguagem simples, em frases curtas.

## Assets
- `uploads/mapa_claro_celular.png`, `uploads/mapa_escuro_celular.png`: mapa estático de referência, com dados de © OpenStreetMap. No app, substituir pela API de mapas.
- Ícones: Tabler Icons (webfont 3.19 no protótipo, `@tabler/icons-react` em React).
- Fonte: Atkinson Hyperlegible (Google Fonts).
- Logo: ainda não existe. Manter o espaço reservado.

## Files
- `CELIA App v2.dc.html`: **protótipo navegável principal**, com todas as telas, claro e escuro e o seletor de tema ao lado.
- `CELIA Assistente.dc.html`: tela do Assistente (conversa em andamento, modo claro).
- `CELIA Sinalizacao.dc.html`: telas de Mapa e Rotas em claro e escuro lado a lado (aprovação da direção visual).
- `support.js`: runtime necessário para abrir os `.dc.html` no navegador.
- `uploads/`: imagens do mapa.
