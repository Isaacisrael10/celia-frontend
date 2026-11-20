<p align="center">
  <img src="assets/celia-logo.png" alt="Logo da C.E.L.I.A.: Caminhos em Liberdade, Inclusão e Acessibilidade" width="420">
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="React Router 7" src="https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white">
  <img alt="MapLibre GL" src="https://img.shields.io/badge/MapLibre%20GL-5-396CB2?logo=maplibre&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-deploy-000000?logo=vercel&logoColor=white">
  <img alt="Gemini via API da equipe" src="https://img.shields.io/badge/Gemini-via%20API%20da%20equipe-8E75B2?logo=googlegemini&logoColor=white">
  <img alt="YOLOv8" src="https://img.shields.io/badge/YOLOv8-modelo%20pr%C3%B3prio-111F68">
</p>

# C.E.L.I.A. · Front-end

**Caminhos em Liberdade, Inclusão e Acessibilidade**
Global Solution 2026.2 (CitizenTech) · FIAP · Engenharia de Software, 1º ano · Rio de Janeiro

> **App publicado:** https://celia-frontend.vercel.app
> **Repositório:** https://github.com/Isaacisrael10/celia-frontend
> **API da equipe (VPS, HTTPS):** https://2-29-156-251.sslip.io · documentação em [/docs](https://2-29-156-251.sslip.io/docs)
> Vídeo de demonstração: _(link em breve)_

### Ficha CitizenTech

| | |
|---|---|
| **Onde** | Rio de Janeiro. Os testes são no bairro do Grajaú. |
| **Para quem** | Pessoas com deficiência física ou mobilidade reduzida que vão ao trabalho a pé e de ônibus. E a Prefeitura, que recebe os reportes e acompanha os postes. |
| **ODS** | 10 (Redução das desigualdades), 11 (Cidades e comunidades sustentáveis) e 8 (Trabalho decente) |
| **Indicador de impacto** | Quantas vezes o trajeto ficou inacessível no horário de ida ao trabalho, medido no histórico do poste. |
| **Disciplinas deste repositório** | Front-end Design (React, custom hooks, CRUD com API externa) e Web Development (interações em JavaScript, modo claro/escuro) |

---

## O problema

Pessoas com deficiência física ou mobilidade reduzida encontram calçadas obstruídas, buracos e calor extremo **no caminho até o trabalho**. Na maioria das vezes, só descobrem o problema quando já estão na rua.

## A solução

A C.E.L.I.A. mostra, **antes de sair de casa**, como estão os trechos do caminho. Postes com sensores (ESP32) nos pontos de ônibus medem a calçada e o calor; o app colore cada trecho com uma faixa, recomenda a rota mais segura e deixa a pessoa reportar problemas com uma foto analisada por IA.

O nome é uma homenagem à Célia, avó de uma integrante da equipe.

### Faixas do semáforo

Cada faixa usa **cor + ícone + nome escrito + tipo de linha no mapa**, para nunca depender só da cor.

| Faixa | Ícone | Linha no mapa |
|---|---|---|
| Acessível | ✓ | contínua |
| Atenção | ! | tracejado longo |
| Evite | ✕ | tracejado curto |
| Sem dados | ? | pontilhada |

O motivo aparece junto: "Evite · calor", "Atenção · calçada estreita". Os nomes são os mesmos no app, na API em Python e no ESP32 (contrato da equipe).

---

## Telas

| Tela | O que faz |
|---|---|
| **Menu (entrada)** | Primeira tela do app. À esquerda, "Para onde vamos?" e o grafo de acessibilidade, em que cada ponto do símbolo abre uma parte do app. À direita, os dois acessos: **Prefeitura** e **Cidadão** [HU-27, RF25]. |
| **Mapa** | Mapa real e livre de ponta a ponta (busca de bairro/rua/lugar e botão "Meu local" com GPS), trechos coloridos, reportes das pessoas como marcadores, legenda e alternativa em lista para leitor de tela. Embaixo, a gaveta do **boletim do caminho de sempre** responde se dá para ir trabalhar hoje pelo caminho de sempre (Acessível, Atenção, Evite ou sem dados), com o calor medido no ponto de ônibus e o alerta de calor escolhido no Perfil. |
| **Detalhe do trecho** | Faixa e motivo, medidas do poste ao vivo (distância livre, índice de calor, temperatura, umidade), últimas leituras e atalho para reportar. |
| **Rotas** | Compara 3 caminhos até o trabalho, recomenda o mais seguro (que nem sempre é o mais curto) e deixa a pessoa escolher o **caminho de sempre** (salvo no navegador, sem login). |
| **Reportar** | CRUD de reportes: lista com filtro, novo reporte com foto (a foto aparece só para quem enviou e some ao atualizar a página; não vai para a MockAPI), tipo do problema e descrição sugerida pela IA que a pessoa revisa antes de enviar, local escolhido num mapa com pino (abre no GPS, arrasta ou busca o endereço), editar e excluir. No buraco, a IA de visão (YOLO) confere a foto primeiro e só então o Gemini escreve; no obstáculo, o Gemini organiza o que a pessoa contou. Se o Gemini falhar, um pop-up mostra o motivo e oferece um texto padrão [RF08, RF09, RF21, RN07]. |
| **Locais acessíveis perto de mim** | Banheiros acessíveis, pontos de descanso e **lazer acessível** perto do caminho: 9 opções de esporte, cultura e ao ar livre (piscina com aulas adaptadas, bocha, cineclube com audiodescrição, roda de samba, pista plana...). Filtro por tipo e, no lazer, por categoria; mini mapa e "Como chegar". Dados simulados. |
| **Trilha IA** | Mini trilha de IA para o trabalho [HU-19, RF18]. Abre explicando por que uma trilha de IA faz parte de um app de calçadas e onde a IA já trabalha dentro da C.E.L.I.A. Depois vêm as lições curtas que abrem e fecham, com exemplo no trabalho e exercício. As lições vêm da API da equipe (`GET /trilha`); sem a API, usa a cópia que vem com o app. |
| **Assistente** | Conversa com o assistente de IA (Gemini, pela API da equipe) sobre o caminho até o trabalho. Responde só com os trechos e locais do app e transforma os citados em links [HU-21, RF20, RN06]. |
| **Perfil** | Cards organizados em grade: Aparência (modo claro e escuro), Alerta de calor no ponto (30, 32 ou 35 °C, ou desligado), Acessibilidade (tamanho do texto, menos animações, mais contraste) e um resumo do projeto. |
| **Sobre o projeto** | Problema, **o problema em números** (dados do IBGE, Mobilize Brasil e Alerta Rio, com link para a fonte), jornada do cidadão em 6 etapas, o que cada parte faz, ODS 8, 10 e 11, indicador de impacto, cuidado com os dados e **perguntas frequentes**. |
| **Prefeitura** | Área do outro usuário do app, aberta pelo botão "Acesso Prefeitura" do Menu [HU-25, HU-26, RF24]. Três abas: **Câmera do poste** (fotos de exemplo fazem o papel da ESP32-CAM e passam pela IA de visão da API; com buraco, o Gemini escreve o reporte e ele chega sozinho), **Reportes recebidos** (dos postes e dos cidadãos, com filtro por origem) e **Alertas de calor** dos pontos de ônibus. |

### Navegação

Cada parte do app é um ponto do símbolo internacional de acessibilidade: Mapa (cabeça), Rotas e Reportar (mãos), Locais e Perfil (pés) e Trilha IA (meio do corpo). No celular é uma barra de vidro embaixo; em telas largas, um trilho lateral com os ícones distribuídos na altura toda, que se recolhe na borda e abre ao passar o mouse, com Assistente e Sobre no pé. O símbolo no topo leva ao Menu, que é também a entrada do app. A área da Prefeitura não aparece na navegação do cidadão.

_(prints das telas em breve)_

---

## O que é real e o que é simulado

| Parte | Situação |
|---|---|
| Poste `poste01` (ThingSpeak) | **Real**, lido ao vivo a cada 20 s e mostrado no boletim do caminho de sempre. Sem leitura há mais de 10 min, vira "Sem dados". O ponto de ônibus do poste no mapa ainda vai ser definido pela equipe. |
| Outros trechos do mapa | **Simulados** (faixa de exemplo em `src/data/trechos.json`). Só existe um poste. A tela do trecho avisa isso. |
| Reportes | **Reais** na MockAPI (API externa do CRUD). |
| Câmera do poste (Prefeitura) | **Simulada**: ainda não há ESP32-CAM, então fotos públicas de exemplo fazem o papel da câmera. A análise delas é **real** (modelo próprio de buracos na API FastAPI da equipe, `POST /analisar`), e o reporte é escrito de verdade pelo Gemini. Sem a API, a tela explica e mostra o plano B. |
| Assistente e descrição do reporte | **Reais** com a API da equipe (Gemini Flash, chave só no servidor). Sem a API, o app mostra uma mensagem amigável e o reporte pode ser escrito à mão. |
| Reportes recebidos e alertas de calor (Prefeitura) | **Simulados** (`src/data/prefeitura.json`), avisados na tela. Os reportes que a câmera envia na demonstração entram no topo da lista. |
| Trilha de IA | **Real** (`GET /trilha` na API da equipe, publicada na VPS). Sem a API, o app usa a cópia em `src/data/trilha.json` (plano B). |
| Rotas | **Simuladas** (3 rotas pré-definidas em `src/data/rotas.json`); o status de cada trecho vem do poste e dos dados simulados. |
| Locais | **Simulados** (`src/data/locais.json`), com a fonte real prevista indicada na tela. |
| Mapa e ruas | **Reais** (OpenStreetMap). Modo satélite com imagens da Esri (World Imagery), escolhido pelo botão no canto de baixo do mapa. O mapa abre no **Grajaú**, bairro dos testes e das fotos usadas para treinar a IA, mas vai para qualquer lugar pela busca ou pelo GPS. Os trechos coloridos são 39 trechos de 11 ruas reais do Grajaú. |
| Localização dos reportes | **Real**: vem do trecho de onde a pessoa reportou ou do endereço digitado (busca no Nominatim/OpenStreetMap). |

Nenhum dado pessoal real é usado.

## Dados e fontes

Os números da tela **Sobre o projeto** (seção "O problema em números") vêm de fontes públicas, com o link também no app:

| Dado | Fonte |
|---|---|
| 14,4 milhões de pessoas com deficiência no Brasil (7,3% da população com 2 anos ou mais) | IBGE, Censo 2022, divulgado em maio de 2025 ([notícia](https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/43463-censo-2022-brasil-tem-14-4-milhoes-de-pessoas-com-deficiencia)) |
| 26,6% das pessoas com deficiência em idade de trabalhar estão ocupadas, contra 60,7% de quem não tem deficiência | IBGE, PNAD Contínua 2022 ([notícia](https://agenciadenoticias.ibge.gov.br/pt/agencia-noticias/37317-pessoas-com-deficiencia-tem-menor-acesso-a-educacao-ao-trabalho-e-a-renda.html)) |
| Rendimento médio de R$ 1.860 de quem trabalha e tem deficiência, contra R$ 2.690 | IBGE, PNAD Contínua 2022 (mesma notícia) |
| Nenhuma das 27 capitais chegou à nota mínima aceitável (8) de calçada; a melhor média ficou abaixo de 7 | Mobilize Brasil, Campanha Calçadas do Brasil 2019 ([relatório](https://www.mobilize.org.br/Midias/Campanhas/Calcadas-2019/relatorio-final.pdf)) |
| 62,3 °C de sensação térmica em Guaratiba (Rio), em 17/03/2024, recorde da série | Sistema Alerta Rio, Prefeitura do Rio ([notícia](https://www.cnnbrasil.com.br/nacional/calor-sufocante-com-623oc-rio-renova-recorde-de-sensacao-termica/)) |

Outros dados usados no app:

| Dado | Fonte |
|---|---|
| Níveis de calor do poste (Atenção a partir de 32 °C, Perigo a partir de 41 °C de índice de calor) | Faixas do índice de calor do serviço meteorológico dos EUA, NOAA/NWS ([tabela](https://www.weather.gov/ama/heatindex)) |
| Traçado das 39 ruas do Grajaú no mapa | OpenStreetMap, pela busca do Nominatim. A cor dos trechos sem poste é simulada |
| Mapa e satélite | OpenFreeMap (© OpenMapTiles, dados do OpenStreetMap) e Esri World Imagery |
| Fotos da câmera simulada do poste | Wikimedia Commons (domínio público) e Pothole Dataset (KugaN, Roboflow Universe, CC BY 4.0); o crédito de cada foto aparece na tela e está em `src/data/prefeitura.json` |
| Banheiros, descanso e lazer | Simulados pela equipe. Fonte real prevista: Prefeitura do Rio (data.rio) e Guia de Rodas |

---

## Como rodar

Precisa do [Node.js](https://nodejs.org/) 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Não precisa configurar nada: os endereços das integrações já estão em `src/services/config.js` (nenhum deles é senha).

### Trocar um endereço (opcional)

Para testar com outro endereço sem mexer no código, copie `.env.example` para `.env` e preencha:

| Variável | Para quê |
|---|---|
| `VITE_REPORTES_URL` | URL do recurso `reportes` na MockAPI |
| `VITE_THINGSPEAK_CHANNEL_ID` | Número do canal público do poste (padrão `3577155`) |
| `VITE_URL_API` | API da equipe em Python (padrão `https://2-29-156-251.sslip.io`, a VPS da equipe; use `http://127.0.0.1:8000` para testar com a API no seu computador): foto, Gemini e trilha |

---

## Integrações

- **ThingSpeak** (leitura pública): `GET https://api.thingspeak.com/channels/{ID}/feeds.json?results=20`. Campos: temperatura, umidade, índice de calor, distância livre, status (0 verde, 1 amarelo, 2 vermelho) e motivo.
- **MockAPI** (CRUD): `GET`, `POST`, `PUT` e `DELETE` em `/reportes`.
- **API da equipe** (FastAPI em Python, publicada numa **VPS com HTTPS** em `https://2-29-156-251.sslip.io`, por isso funciona também no app publicado; endereço trocável em `VITE_URL_API`). Rotas usadas: `POST /analisar` com a foto da câmera do poste (campo `foto`), que devolve `resultado` (`livre` ou `buraco`) e `caixas_buracos`, desenhadas sobre a foto; `POST /assistente/trajeto` e `POST /assistente/descricao` (Gemini); `GET /trilha` com as lições. O app nunca fala direto com o Gemini nem guarda chave. Se a API sair do ar, o app mostra uma mensagem amigável e segue no plano B.
- **Satélite**: imagens Esri World Imagery (sem chave), com os nomes das ruas do OpenFreeMap por cima.
- **Mapa**: MapLibre GL + tiles do OpenFreeMap (gratuito, sem chave), com estilos próprios claro e escuro.
- **Busca de lugares** (Nominatim/OpenStreetMap, sem chave): leva o mapa a qualquer endereço e acha as coordenadas dos reportes. Só busca quando a pessoa confirma, como pede a regra de uso do serviço.
- **GPS do navegador** (Geolocation API): botão "Meu local".

---

## Como o código está organizado

A lógica de negócio, o acesso a dados e a apresentação ficam separados:

```
src/
  services/    acesso a dados, sem React
               reportesApi.js · thingspeak.js · apiEquipe.js · visaoApi.js · assistenteApi.js
               trilhaApi.js · posteApi.js · posteSimulado.js · geocodificacao.js
               miniatura.js · armazenamento.js (localStorage) · lerJson.js · config.js
  domain/      regras de negócio puras (sem React, sem fetch)
               faixas.js · reportes.js · poste.js · trechos.js · rotas.js · boletim.js · visao.js
               locais.js · mapa.js · navegacao.js · trilha.js · assistente.js · prefeitura.js
  hooks/       custom hooks: juntam serviços, regras e estado
  components/  peças visuais reutilizáveis
  pages/       as telas
  data/        dados fixos (trechos, rotas, locais, trilha, prefeitura, sobre)
  styles/      tokens de cor claro/escuro, componentes e estilos do mapa
```

### Custom hooks

| Hook | O que faz |
|---|---|
| `useReportes` | Lista, cria, edita e exclui reportes na MockAPI |
| `useStatusPoste` | Lê o ThingSpeak a cada 20 s e aplica a regra dos 10 minutos |
| `useTrechos` | Junta os trechos com o poste ao vivo e calcula a faixa de cada um |
| `useRotas` | Ordena as rotas da mais segura para a menos segura e guarda o caminho de sempre |
| `useLimiteCalor` | Temperatura do alerta de calor, escolhida no Perfil e salva no navegador |
| `useTema` | Modo claro/escuro, salvo no navegador |
| `usePreferencia` | Preferência liga/desliga salva no navegador (ex.: mapa em modo satélite) |
| `useAviso` | Mensagem rápida no rodapé que some sozinha |
| `useBuscaLugar` | Busca de bairro, rua ou lugar para levar o mapa até lá |
| `useLocalizacao` | Pede o GPS do celular para o botão "Meu local" |
| `useLocalDoReporte` | Local do reporte: GPS ao abrir, pino no mapa que preenche o endereço, e busca do endereço digitado |
| `useFormReporte` | Campos, validação (RN05) e envio do formulário de reporte; a tela só desenha |
| `useTrilha` | Busca a trilha na API e cai na cópia local se a API não responder; controla a lição aberta |
| `useLocais` | Filtro e ordenação dos locais |
| `useSelosDoMapa` | Escolhe os selos ! e ✕ que cabem na tela sem sobrepor |
| `useAcessibilidade` | Tamanho do texto, menos animações e mais contraste, aplicados no app inteiro |
| `useConsultaDeTela` | Responde se a tela é larga (mesma sintaxe das media queries) |
| `useTituloDaPagina` | Troca o título da aba conforme a tela |
| `useFocoNoTitulo` | Leva o foco ao título ao trocar de tela (leitor de tela) |
| `useAssistente` | Conversa do Assistente: monta o contexto (trechos e locais), chama a API e transforma os ids citados em links; a tela só desenha |
| `useChamadaApi` | Qualquer chamada à API da equipe: guarda carregando e erro, tenta de novo quando o Gemini falha e marca quando a API está fora do ar (plano B) |
| `useDescricaoIa` | Descrição do reporte por IA: no buraco, o YOLO confere a foto antes do Gemini; no obstáculo, espera o texto do cidadão; abre o pop-up de erro com o plano B |
| `useCronometro` | Conta os segundos enquanto a IA trabalha, para a pessoa ver que o app não travou |
| `useFotoReporte` | Foto do reporte do cidadão: mostra a foto e gera a miniatura que fica só na memória do navegador (não vai para a MockAPI) |
| `useCameraPoste` | Câmera simulada do poste: passa pelas fotos, manda cada uma para a IA de visão e, com buraco, pede o reporte ao Gemini e envia sozinho |
| `useCameraReal` | Câmera real do poste: a cada 5 s pergunta à API pela última foto da ESP32-CAM e pelos reportes automáticos; sem foto recente, a tela fica com a simulação |
| `useReportesPrefeitura` | Caixa de entrada da Prefeitura: reportes de exemplo, os que a câmera envia e o filtro por origem |
| `useAparecerAoRolar` | Avisa quando um elemento entra na tela ao rolar (abre os cards da linha do tempo) |

### Interações em JavaScript (Web Development)

1. Alternar **modo claro/escuro** (Perfil)
2. **Filtrar reportes** por situação
3. Alternar **Mapa / Lista**
4. **Filtrar locais** por tipo (banheiros, descanso e lazer) e, no lazer, por categoria (esporte, cultura, ao ar livre)
5. **Inverter** origem e destino nas rotas
6. **Escolher o caminho de sempre** e ver o boletim no mapa (muda sozinho se um trecho mudar de faixa)
7. **Confirmar exclusão** de um reporte dentro do próprio card
8. **Validação** do formulário de reporte, com mensagens de erro acessíveis
9. **Buscar um lugar** e o mapa voar até ele
10. **Meu local**: centralizar o mapa no GPS
11. **Escolher o local do reporte** arrastando o mapa (o endereço se preenche sozinho)
12. **Abrir e fechar a gaveta** do boletim com os detalhes do caminho
13. **Alerta de calor**: escolher a temperatura no Perfil e o boletim avisar quando o ponto passar dela
14. **Mapa / Satélite**: trocar o jeito de ver o mapa pelo botão do canto de baixo (fica salvo no navegador)
15. **Abrir e fechar lições** da Trilha IA
16. **Menu em forma de símbolo**: cada ponto do grafo abre uma parte do app, e o Menu marca "Você está aqui"
17. **Ajustes de acessibilidade** no Perfil (tamanho do texto, menos animações, mais contraste)
18. **Conversar com o assistente**: a pergunta vira balão na hora e a resposta entra embaixo
19. **Câmera do poste**: ligar, pausar e continuar a ronda; os reportes chegam na caixa de entrada
20. **Abas da Prefeitura** (também pelas setas do teclado) e **filtros** por origem e por nível de calor
21. **Perguntas frequentes** do Sobre, que abrem e fecham

#### Onde estão os conceitos de JavaScript pedidos

| Conceito | Exemplo no código |
|---|---|
| **Funções** | `src/domain/poste.js`: `minutosDesde`, `leituraRecente` (regra dos 10 min), `faixaDoCalor` |
| **Condicionais** | `faixaDoCalor` (`if` por nível de calor) e `textoAtualizado` (`if` por minutos) em `src/domain/poste.js` |
| **Operadores** | comparação (`>=`, `===`), lógicos (`&&`, `\|\|`) e ternário em `src/hooks/useTema.js` (`tema === 'escuro' ? 'claro' : 'escuro'`) |
| **DOM** | `useTema` coloca `data-tema` no `<html>`; `useAcessibilidade` muda `data-texto`/`data-movimento`; `useTituloDaPagina` troca `document.title`; `useFocoNoTitulo` leva o foco ao `<h1>` |
| **Eventos** | `onClick`, `onSubmit` e `onChange` nos filtros, no formulário de reporte e no Assistente |
| **Modo claro/escuro** | botão no Perfil → `useTema` → `data-tema` no `<html>` → tokens de cor em `src/styles/tokens.css`. Abre no tema do sistema e guarda a escolha no navegador |

### Requisitos de Front-end Design

| Requisito | Onde está |
|---|---|
| React + Hooks | `useState`, `useEffect`, `useRef`, `useMemo` nas telas e hooks |
| Custom Hooks | 28 hooks em `src/hooks/` (tabela acima) |
| CRUD com API externa | MockAPI `/reportes`: `src/services/reportesApi.js` → `useReportes` → tela Reportar (criar, listar, editar, excluir) |
| Separação de camadas | `services/` (dados) · `domain/` (regras) · `hooks/` (estado) · `pages/` e `components/` (apresentação). Nenhuma tela chama `fetch` |
| Componentização | `src/components/` (cards, badges, mapa, barra de navegação, estados de carregando e erro) |
| Tratamento de erros | Sem rede, API fora ou resposta estranha viram mensagem em português (`services/` e `lerJson.js`) ou plano B; se uma tela quebrar, `ErroDaTela` mostra um aviso só nela e o resto do app continua |

---

## Acessibilidade

- Fonte **Lexend**, criada para facilitar a leitura; tamanhos em `rem` (respeitam a fonte do navegador)
- Contraste AA nos dois modos; texto do corpo com 16 px ou mais
- Áreas de toque com 48 px ou mais
- Foco visível em tudo; navegação completa pelo teclado
- Rótulos para leitor de tela em botões de ícone e nos selos do mapa (sem o "Map marker" em inglês do MapLibre)
- Selos do mapa nunca ficam um em cima do outro: quando não cabem, aparece o mais grave
- **Lista** como alternativa completa ao mapa
- Animações desligadas para quem pediu menos movimento no sistema
- Verde, amarelo e vermelho reservados para as faixas; erros e status usam grafite e azul

---

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, custom hooks, CSS com tokens de design (temas claro e escuro), Tabler Icons |
| Build e qualidade | Vite 8 (com @vitejs/plugin-react), Oxlint |
| Navegação | React Router 7 |
| Mapa | MapLibre GL 5 com react-map-gl, tiles do OpenFreeMap, imagens de satélite Esri World Imagery |
| Dados e CRUD | MockAPI (`/reportes`), ThingSpeak (leitura pública do poste), Nominatim/OpenStreetMap (busca de lugares), Geolocation API do navegador |
| Inteligência artificial | API da equipe em Python (FastAPI): modelo YOLOv8 de buracos treinado pela equipe e assistente com o Google Gemini. O app nunca fala direto com o Gemini nem guarda chave |
| Publicação | Vercel (app) e VPS da equipe com HTTPS (API em Python) |

---

## Equipe

Veja [Integrantes.md](Integrantes.md). O uso de IA está registrado em [AI.md](AI.md).
