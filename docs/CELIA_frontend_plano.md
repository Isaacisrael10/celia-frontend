# C.E.L.I.A. · Plano do Front-end

> Caminhos em Liberdade, Inclusão e Acessibilidade
> Global Solution 2026.2 · FIAP · Engenharia de Software 1º ano · Rio de Janeiro
> Entrega: **19/11/2026, 23h55** · Responsável pelo front-end: Isaac

Este documento reúne tudo o que o front-end precisa ter: telas, dados, integrações, regras de design e o que cada professor avalia. Serve de base para o Claude Design (estrutura visual) e para o código.

---

## 1. O produto em uma frase

Pessoas com deficiência física ou mobilidade reduzida enfrentam calçadas obstruídas, buracos e calor extremo **no caminho até o trabalho**. A C.E.L.I.A. mostra, antes de sair de casa, o status dos trechos monitorados por postes com sensores nos pontos de ônibus, recomenda a rota mais acessível e deixa a pessoa reportar problemas com foto analisada por IA.

**Heroína:** uma trabalhadora com deficiência física que vai ao trabalho a pé e de ônibus.

---

## 2. O que as disciplinas cobram do front-end

O front-end atende **duas disciplinas**, entregues **no mesmo repositório**.

### Front-end Design · prof. Fábio Alencar · "Aplicação Web Funcional"
- Adequação ao tema da GS
- Funcionalidades implementadas e **integração com API externa para CRUD**
- **React, Hooks e Custom Hooks** usados corretamente
- **Separação** entre lógica de negócio, acesso a dados e apresentação
- Componentização, organização e qualidade do código
- **Histórico de commits** mostrando a evolução
- Clareza do **README.md** e do **AI.md**
- Entregáveis: repositório GitHub, ZIP, README.md, AI.md, Integrantes.md (detalhes no Teams)

### Web Development · prof. Igor Araujo · "Interatividade e Funcionalidades Dinâmicas"
- Pelo menos **duas interações funcionais** com JavaScript (funções, DOM, operadores, condicionais)
- **Modo claro e escuro**
- Saber explicar o código
- Mesmos entregáveis, no mesmo repositório

---

## 3. Telas

Barra inferior com 5 abas: **Mapa · Rotas · Reportar · Locais · Perfil**.

### 3.1 Mapa (tela inicial) · RF02, RF03, RF04, RF12
- Mapa real (MapLibre + OpenFreeMap) com os estilos próprios da C.E.L.I.A. (`celia-mapa-claro.json` e `celia-mapa-escuro.json`).
- Trechos coloridos por faixa (ver seção 5). O trecho do **poste01** é **ao vivo** (ThingSpeak). Os outros vêm dos reportes ou aparecem como "Sem dados".
- Marcadores: "Você", reportes de usuários.
- **Widget de calor** no topo: índice de calor do poste, com faixa e texto ("Calor: Atenção · 34 °C").
- **Alerta de trecho que mudou** (RF03): faixa no topo, por exemplo "O trecho da Rua X ficou em Perigo por calor. Ver outra rota".
- Alternador **Mapa / Lista** (a lista serve para quem usa leitor de tela).
- Legenda das faixas.

### 3.2 Detalhe do trecho / poste · RF02
- Nome do trecho, badge da faixa (cor + ícone + nome).
- **Motivo** em texto: "Calçada estreita", "Calor", "Calçada e calor", "Veículo bloqueando", "Buraco".
- Dados: distância livre (cm), temperatura, umidade, índice de calor.
- "Atualizado há X min". Se passar de 10 min: "Sem dados recentes".
- Mini histórico (últimas leituras) se der tempo.

### 3.3 Rotas · RF01
- Campos "Saindo de" e "Indo para".
- **Duas ou três rotas pré-definidas** comparadas em cards: tempo, pior trecho (badge), motivo.
- A recomendada em destaque ("Recomendada"), com botão "Ver no mapa".
- O status de cada rota vem dos trechos (poste ao vivo + reportes).

### 3.4 Reportar · RF08, RF11, RF12 · **CRUD (Fábio)**
**Lista de reportes**
- Cada item: tipo do problema, rua, data, foto (miniatura), classificação da IA, **status** (Aberto · Enviado à prefeitura · Resolvido).
- Ações: **Editar** (status e descrição) e **Excluir**, com rótulo de texto.
- Filtro por status (interação Web Dev).

**Novo reporte**
1. Enviar ou tirar foto da calçada.
2. App envia para a API de visão e mostra o resultado: **Livre / Obstáculo / Buraco**, com as **caixas desenhadas sobre a foto**.
3. Pessoa escreve a descrição e escolhe a rua.
4. Enviar → cria o reporte na API externa (MockAPI) e ele aparece no mapa.

**Regra:** só envia com foto, classificação e descrição (RN05).

**Plano B:** se a API de visão não responder (versão publicada, sem o computador do Caio), mostrar mensagem amigável: "A análise por IA roda na demonstração local. Veja o vídeo no README." O reporte pode ser criado com a classificação "Não analisada".

### 3.5 Locais · RF06, RF07
- Banheiros acessíveis e pontos de descanso perto da rota.
- Lista (e marcadores no mapa, se der tempo), com filtro Banheiro / Descanso.
- Dados fixos em `locais.json`, com fonte citada.

### 3.6 Perfil e ajustes
- **Modo claro/escuro** (Web Dev).
- **Modo chuva** (RF05): comportamento **ainda a definir pela equipe**. Deixar só o interruptor no design.
- Sobre o projeto, integrantes, link do vídeo.

### Fora do escopo do front-end (por enquanto)
- Camada para pessoas com TEA (cortada em 11/11).
- Assistente/chatbot (não está no backlog atual).
- Login de usuário.

---

## 4. Dados e integrações

### 4.1 ThingSpeak · status do poste (leitura, sem chave)
`GET https://api.thingspeak.com/channels/{CHANNEL_ID}/feeds.json?results=20`

| Campo | Conteúdo |
|---|---|
| field1 | temperatura (°C) |
| field2 | umidade (%) |
| field3 | índice de calor (°C) |
| field4 | distância livre (cm) |
| field5 | status: 0 verde · 1 amarelo · 2 vermelho |
| field6 | motivo: 0 nenhum · 1 calçada · 2 calor · 3 ambos · 4 veículo · 5 buraco |

- O ESP32 envia a cada 20 s → o app busca a cada **20 s**.
- **Sem leitura há mais de 10 min → "Sem dados" (cinza).**
- Pendente: **CHANNEL_ID** (Caio).

### 4.2 API de visão · Flask `/analisar` (demonstração local)
- `POST http://localhost:5000/analisar` com a foto (multipart).
- Resposta esperada (a confirmar com o Caio):
```json
{
  "resultado": "buraco",
  "caixas": [
    { "x1": 120, "y1": 300, "x2": 260, "y2": 410, "classe": "buraco", "confianca": 0.87 }
  ]
}
```
- Pendentes com o Caio: formato final, **coordenadas em pixels ou normalizadas**, nome do campo do arquivo, **CORS liberado** (`flask-cors`).

### 4.3 MockAPI · reportes (CRUD)
Recurso `reportes`:

| Campo | Tipo | Exemplo |
|---|---|---|
| id | gerado | "7" |
| rua | texto | "Rua Conde de Bonfim, 200" |
| tipo | texto | "buraco" · "obstaculo" · "livre" · "nao_analisada" |
| descricao | texto | "Buraco grande na frente do ponto" |
| status | texto | "aberto" · "enviado" · "resolvido" |
| fotoUrl | texto | miniatura (ou vazio) |
| lat, lng | número | -22.9245, -43.2310 |
| criadoEm | data | 2026-11-14T10:20:00Z |

Operações: listar (GET), criar (POST), editar status/descrição (PUT), excluir (DELETE).
Pendente: confirmar com o prof. Fábio que o MockAPI vale como "API externa".

### 4.4 Dados fixos no projeto
- `trechos.json`: trechos do bairro (coordenadas, nome, qual é o poste ao vivo).
- `rotas.json`: 2 ou 3 rotas pré-definidas (lista de trechos e tempo).
- `locais.json`: banheiros e pontos de descanso (com fonte).
- Opcional: `historico.json` e `relatorio.csv` gerados pelo Python, para o mini histórico.

---

## 5. Regras de design

### Faixas do semáforo
| Status | Nome (**a definir: igual ao Python e ao Edge**) | Cor claro | Cor escuro | Ícone | Linha no mapa |
|---|---|---|---|---|---|
| 0 | Normal / Acessível | `#1E8E3E` | `#5BD08A` | ✓ | contínua |
| 1 | Atenção | `#B26A00` | `#F2B84B` | ! | tracejado longo |
| 2 | Perigo / Evite | `#C62828` | `#FF7A7A` | ✕ | tracejado curto |
| — | Sem dados | `#8A8F98` | `#8A93A3` | ? | pontilhado |

- **Nunca só cor:** sempre cor + ícone + nome (+ tipo de linha no mapa).
- Verde, amarelo e vermelho **só** nas faixas. Nada mais da interface usa essas cores.
- O **motivo** aparece sempre junto do status ("Perigo · calor").

### Acessibilidade
- Contraste AA (4,5:1 texto, 3:1 ícones) nos dois modos.
- Texto do corpo com no mínimo 16 px, nada abaixo de 13 px.
- Área de toque mínima de 48 px.
- Compatível com leitor de tela: rótulos em todos os botões de ícone, ordem de leitura lógica, alternativa em lista para o mapa.
- Linguagem simples.

### Visual
- Paleta: **opção 6** (definida no Claude Design). Cor principal em botões, links e aba ativa.
- Fonte sugerida: **Atkinson Hyperlegible** (criada para baixa visão).
- Visual direto, sem gradientes nem botão 3D. Sem padrão de ondas.
- Mapa com os estilos próprios (`celia-mapa-*.json`), sem redesenhar ruas.
- Crédito obrigatório no mapa: "OpenFreeMap © OpenMapTiles Data from OpenStreetMap".

### Estados que toda tela precisa ter
Carregando · Erro (com ação "Tentar de novo") · Vazio ("Nenhum reporte ainda") · Sem dados do poste · Plano B da IA.

---

## 6. Arquitetura do código

```
src/
  services/        acesso a dados (sem React)
    thingspeak.js     buscar leituras do poste
    reportesApi.js    CRUD no MockAPI
    visaoApi.js       enviar foto para /analisar
  hooks/           custom hooks (lógica + estado)
    useStatusPoste.js   lê o ThingSpeak a cada 20 s, aplica regra dos 10 min, traduz status/motivo
    useReportes.js      listar, criar, editar, excluir
    useAnaliseFoto.js   envia a foto, trata erro e plano B
    useTema.js          claro/escuro (salvo no navegador)
    useRotas.js         calcula a recomendada a partir dos trechos
  domain/          regras de negócio puras
    faixas.js         nomes, cores, ícones e textos de motivo
  components/      peças reutilizáveis
    BadgeFaixa, CardTrecho, CardRota, CardReporte, WidgetCalor,
    AlertaTrecho, Mapa, FotoComCaixas, BarraInferior, ...
  pages/           telas
    Mapa, Rotas, Reportar, NovoReporte, Locais, Perfil
  data/            trechos.json, rotas.json, locais.json
  styles/          tokens claro/escuro, mapa (celia-mapa-*.json)
```

Bibliotecas: React + Vite, `maplibre-gl` (com `react-map-gl`), React Router.

### Interações para Web Dev (mínimo 2, previstas 4+)
1. Alternar modo claro/escuro.
2. Filtrar reportes por status.
3. Alternar Mapa / Lista.
4. Selecionar trecho e abrir o detalhe.
5. Comparar rotas e escolher a recomendada.

---

## 7. Prioridade e linha de corte

| # | Item | Até |
|---|---|---|
| 1 | Projeto criado, repositório público, estrutura de pastas, tema claro/escuro | 13/11 |
| 2 | CRUD de reportes com MockAPI (lista, criar, editar, excluir) | 14/11 |
| 3 | Mapa com estilos próprios e trechos | 14/11 |
| 4 | Poste ao vivo (ThingSpeak) + widget de calor + regra dos 10 min | 15/11 |
| 5 | Novo reporte com foto + API de visão + caixas + plano B | 16/11 |
| 6 | Rotas (comparação pré-definida) | 16/11 |
| 7 | Alerta de trecho que mudou | 17/11 |
| — | **Linha de corte: o que vier abaixo só entra se sobrar tempo** | |
| 8 | Locais (banheiros e descanso) | 17/11 |
| 9 | Modo chuva (depende da definição da equipe) | 18/11 |
| 10 | Mini histórico do poste | 18/11 |
| — | README, AI.md, Integrantes.md, ZIP, revisão final | 18–19/11 |

---

## 8. Pendências

- [ ] **Caio:** CHANNEL_ID público do ThingSpeak
- [ ] **Caio:** formato da resposta do `/analisar` (coordenadas das caixas), nome do campo do arquivo, CORS
- [ ] **Equipe:** nomes finais das faixas (iguais em Python, Edge e app)
- [ ] **Equipe:** conjunto único de ODS
- [ ] **Equipe:** bairro e trechos reais (coordenadas)
- [ ] **Equipe:** comportamento do modo chuva
- [ ] **Equipe:** funcionalidades vindas da ideia do João (trabalho) que ainda não estão no backlog
- [ ] **Prof. Fábio:** MockAPI vale como API externa?
- [ ] **Teams:** conferir detalhes extras de entrega de Front-end e Web Dev

---

## 9. Checklist de entrega (Front-end Design e Web Development)

- [ ] Repositório público no GitHub, com commits frequentes de todos
- [ ] ZIP do projeto
- [ ] README.md: problema, solução, como rodar, telas (prints), o que é real e o que é simulado, link do vídeo
- [ ] AI.md: prompts usados e como a IA ajudou
- [ ] Integrantes.md: nome completo e RM
- [ ] CRUD funcionando com API externa
- [ ] Modo claro/escuro funcionando
- [ ] Pelo menos 2 interações JS funcionando
- [ ] Todo mundo sabe explicar o código
- [ ] Enviado no Teams por um integrante até 19/11, 23h55
