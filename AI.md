# Uso de IA no front-end da C.E.L.I.A.

Registro dos prompts relevantes e de como a IA ajudou. Todo código gerado foi lido e entendido pela equipe antes de entrar no projeto.

Ferramentas: **Claude Design** (protótipo visual) e **Claude Code** (código).

---

## 1. Identidade visual (Claude Design)

- **Objetivo:** criar a identidade visual do app, com acessibilidade no centro (contraste AA, fonte para baixa visão, semáforo que nunca depende só da cor).
- **Resultado:** protótipo navegável e especificação de tokens e componentes, em `design/`.
- **O que mudamos:** o protótipo foi feito antes de a equipe fechar o conceito dos postes com ESP32. Aproveitamos o visual e os componentes, mas as telas seguem o plano atual (`docs/CELIA_frontend_plano.md`).

## 2. Estrutura inicial do projeto (Claude Code · 12/11/2026)

- **Prompt (resumo):** "Combina o visual do design com as telas do plano atual" e, antes, "Já tem tudo que deve ser feito nessa pasta?"
- **Como a IA ajudou:**
  - criou o projeto React + Vite e a estrutura de pastas (`services`, `hooks`, `domain`, `components`, `pages`);
  - passou os tokens de cor do design para `src/styles/tokens.css`;
  - criou `src/domain/faixas.js`, para os nomes das faixas ficarem num lugar só;
  - criou o custom hook `useTema` (modo claro/escuro salvo no navegador);
  - montou a barra inferior, o cabeçalho e as 5 telas iniciais.
- **Revisão da equipe:** (preencher) o que conferimos e o que mudamos à mão.

## 3. CRUD de reportes, mapa e poste ao vivo (Claude Code · 12/11/2026)

- **Prompt (resumo):** "Vai fazendo as coisas que não dependem de mim."
- **Como a IA ajudou:**
  - **CRUD de reportes:** `services/reportesApi.js` (fetch na MockAPI), `hooks/useReportes.js`, `domain/reportes.js` (tipos, situações, validação) e a tela com lista, filtro por situação, formulário e exclusão com confirmação. Testado com um servidor falso local que imita a MockAPI.
  - **Mapa:** MapLibre com os estilos próprios (`celia-mapa-claro/escuro.json`), trechos desenhados por faixa (contínua, tracejados e pontilhado), selos ! e ✕ que também funcionam pelo teclado, legenda e a alternativa em lista.
  - **Poste ao vivo:** `services/thingspeak.js` + `hooks/useStatusPoste.js` (busca a cada 20 s e aplica a regra dos 10 minutos), widget de calor e detalhe do trecho com as medidas.
- **Problemas encontrados e decisões:**
  - O MapLibre 6 não carregava o "worker" no build de produção; voltamos para o MapLibre 5.
  - Só existe um poste, então os outros trechos usam uma **faixa de exemplo (simulada)** em `src/data/trechos.json`. A tela avisa isso ao abrir o trecho.
- **Revisão da equipe:** (preencher)

## 4. Foto com IA de visão e plano B (Claude Code · 12/11/2026)

- **Prompt (resumo):** seguir com o item 5 do plano (novo reporte com foto, API de visão, caixas e plano B).
- **Como a IA ajudou:**
  - `services/visaoApi.js` manda a foto para `/analisar` (com tempo máximo de 20 s) e `services/miniatura.js` reduz a foto para guardar na MockAPI;
  - `domain/visao.js` converte as caixas da IA em porcentagem da foto, aceitando coordenadas em pixels ou de 0 a 1 (o formato ainda está pendente com o Caio);
  - `hooks/useAnaliseFoto.js` controla os estados (analisando, analisada, plano B);
  - `FotoComCaixas` desenha as caixas sobre a foto; o formulário só envia com foto, tipo e descrição (RN05).
- **Testes:** com uma API de visão falsa (resposta "buraco" com uma caixa) e com a API desligada. Sem a API, aparece "A análise por IA roda na demonstração local. Veja o vídeo no README." e o reporte vai como "Não analisada", sem erro cru.
- **Revisão da equipe:** (preencher)

## 5. Rotas, alerta, Locais, histórico e documentação (Claude Code · 12/11/2026)

- **Prompt (resumo):** "Para de perguntar as coisas e faz logo" (seguir o plano até o fim).
- **Como a IA ajudou:**
  - **Rotas:** `data/rotas.json` (3 rotas de exemplo), `domain/rotas.js` (a recomendada é a de pior trecho menos grave, depois menos problemas, depois menos minutos) e `hooks/useRotas.js`;
  - **Alerta (RF03):** se a rota escolhida passa por Perigo, aparece um aviso no mapa com "Ver rotas" e "Seguir assim". Como o poste é lido ao vivo, o aviso surge sozinho se o trecho mudar;
  - **Locais:** lista com filtro Banheiros/Descanso, dados simulados com a fonte real prevista;
  - **Mini histórico:** últimas leituras do poste no detalhe do trecho;
  - **Perfil:** interruptor do modo chuva (comportamento ainda em definição) e "Sobre";
  - rascunho do **README.md** e modelo do **Integrantes.md**.
- **Revisão da equipe:** (preencher)

## 6. Mapa livre e bairro Grajaú (Claude Code · 12/11/2026)

- **Prompt (resumo):** "O mapa tem que estar completão, poder escolher a região que quiser. As fotos da IA são do Grajaú e os testes vão ser no Grajaú."
- **Como a IA ajudou:**
  - baixou o traçado de 11 ruas reais do Grajaú (OpenStreetMap, pelo Nominatim, uma busca por segundo) e gerou 39 trechos em `src/data/trechos.json`; rotas e locais de exemplo foram para o Grajaú;
  - busca de lugar (`services/geocodificacao.js` + `hooks/useBuscaLugar.js`): o mapa voa até qualquer bairro, rua ou lugar;
  - botão "Meu local" com o GPS (`hooks/useLocalizacao.js`), com aviso se a permissão for negada;
  - reportes com localização: vêm do trecho ou do endereço digitado, e aparecem no mapa como marcadores.
- **Revisão da equipe:** (preencher)

## 7. Local do reporte pelo mapa (Claude Code · 12/11/2026)

- **Prompt (resumo):** "No reporte, a pessoa poder escolher o endereço pelo mapa. Por padrão aparecer onde ela está, mas poder arrastar ou digitar o endereço e o mapa ir até lá."
- **Como a IA ajudou:** criou o `SeletorLocal` (mapa pequeno com pino fixo no centro, estilo aplicativo de transporte), o hook `useLocalDoReporte` (GPS ao abrir, busca do endereço, e busca reversa que preenche o endereço quando a pessoa arrasta) e a função `enderecoDoPonto` no serviço de geocodificação.
- **Problema encontrado:** depois de arrastar, o mapa desliza por inércia e o evento final não indica que foi a pessoa; a solução foi marcar o arrasto no início do movimento.
- **Revisão da equipe:** (preencher)

## 8. Redesenho em grafo (Claude Code · 14/11/2026 · PROPOSTA, experimento local do João)

> Ainda não aprovado pelo Isaac. Feito num clone local para testar a ideia, sem PR e sem merge.

- **Prompt (resumo):** "Não gostei do design, não está responsivo nem muito acessível. Busque ideias de conexão como se fosse um grafo: cada função seria uma bolinha do símbolo de acessibilidade da ONU. Mantenha as cores. Quero acessível, responsivo, atual, com vidro desfocado e animações suaves. Teste até ficar bom."
- **Ideia:** o símbolo de acessibilidade tem 5 bolinhas (cabeça, duas mãos e dois pés) e o app tem 5 partes. Cada parte virou uma bolinha: Mapa (cabeça), Rotas e Reportar (mãos), Locais e Perfil (pés). A lista fica em `src/domain/navegacao.js`.
- **Como a IA ajudou:**
  - **Navegação em grafo** (`NavGrafo`, no lugar da `BarraInferior`): barra de vidro embaixo no celular e trilho lateral em telas largas, com uma linha ligando as bolinhas e uma bolinha azul que desliza até a tela atual;
  - **Menu em forma do símbolo** (`MenuGrafo`): o símbolo desenhado grande, com cada bolinha como link. Usa a tag `<dialog>`, que já prende o foco e fecha com Esc;
  - **Responsivo de verdade:** antes o app era uma coluna de 480 px no meio da tela. Agora o mapa ocupa a tela toda, as rotas ficam em 3 colunas e os formulários em 2 no computador. Testado de 320 px a 1440 px e com o celular deitado;
  - **Vidro e fundo** (`FundoGrafo`): peças translúcidas com desfoque e, atrás, o próprio símbolo bem grande e suave. As cores dos tokens não mudaram;
  - **Acessibilidade:** textos em `rem` (respeitam a fonte do navegador), link "Pular para o conteúdo", foco no título ao trocar de tela, título da aba por tela, alvos de toque de 44 px ou mais, e a seção nova **Acessibilidade** no Perfil (tamanho do texto, menos animações e mais contraste), com o hook `useAcessibilidade`;
  - novos custom hooks: `useConsultaDeTela`, `useTituloDaPagina` e `useAcessibilidade`.
- **Testes:** script com Playwright e axe-core fora do repositório. Sem estouro horizontal em 6 larguras, nenhum alvo de toque abaixo de 44 px, nenhuma violação do axe nos dois temas, e contraste medido pixel a pixel em cerca de 1.200 textos (pior caso 4,68:1, acima do mínimo AA de 4,5:1).
- **Problemas encontrados e decisões:**
  - o axe não consegue medir contraste em cima de vidro, então a medição foi feita pela foto da tela;
  - no celular deitado o mapa abria afastado demais, porque as folgas do enquadramento não cabiam na altura; a folga passou a depender da altura da tela;
  - muitas peças com desfoque pesam no celular: só as peças que flutuam usam desfoque, os cards de lista são translúcidos sem desfoque;
  - **navegação em glassmorfismo** (pedido seguinte: "deixe a nav bar em aspecto glassmorphism, mantendo o design"): fundo bem mais transparente, desfoque forte, borda clara, reflexo de luz e bolinhas foscas (variáveis `--nav-*` em `tokens.css`). Um teste de estresse com o pior fundo possível atrás da barra (foto branca no tema escuro, preto no claro) mostrou os nomes caindo para 3,9:1 no escuro; o vidro escuro ficou mais cheio e o pior caso passou a 5,56:1.
- **Revisão da equipe:** (preencher)

## 9. Ajustes de design, Trilha IA, Sobre, satélite e refatoração (Claude Code · 14/11/2026 · PROPOSTA do João)

> Continuação do item 8. Ainda precisa da revisão do Isaac (dono do front). Vai como PR, sem merge.

- **Prompt (resumo):** "Centralizar o título do menu e levar o X para o canto. Na nav bar lateral, 80% está em branco: distribuir os ícones com proporção. Colocar um SOBRE o projeto embaixo. Organizar os cards do Perfil. Modo satélite com botão de troca no canto inferior direito. Acrescentar a aba Trilha IA. Depois, refatorar o código conforme os requisitos de Front-end Design e Web Development, mantendo as regras de negócio."
- **Como a IA ajudou:**
  - **Menu:** título e apoio centralizados; botão de fechar preso no canto da tela (não rola junto); link "Sobre o projeto" no fim;
  - **Nav bar:** no trilho lateral as casas dividem a altura em partes iguais (CSS grid com `--total`), então os ícones se espalham na altura toda; "Sobre" preso embaixo; frase de apoio sob cada nome quando há altura;
  - **Trilha IA** [HU-19, RF18]: novo ponto do símbolo (meio do corpo), tela `Trilha`, `CardLicao`, `useTrilha`, `services/trilhaApi.js` e `domain/trilha.js`. Lições da API (`GET /trilha`) com cópia local como plano B;
  - **Sobre o projeto:** página com problema, jornada, partes, ODS, indicador e LGPD (textos em `src/data/sobre.json`);
  - **Satélite:** `styles/mapa/estilos.js` monta um estilo com as imagens Esri e só as camadas de texto por cima; `BotaoVisaoMapa` troca e `usePreferencia('celia-satelite')` lembra a escolha;
  - **Perfil:** grade com áreas nomeadas (duas colunas de mesma altura e o Sobre de ponta a ponta);
  - **Refatoração (separação lógica, dados e apresentação):** `localStorage` só em `services/armazenamento.js`; regras que estavam em componentes foram para `domain/` (filtros, ordenações, GeoJSON dos trechos, textos de quantidade, área da rota); novos hooks `useFormReporte`, `useLocais`, `useSelosDoMapa`, `useFocoNoTitulo`; componentes reutilizáveis `Filtros`, `Opcoes`, `Medida`, `ErroCampo`, `CamadasTrechos`, `PassosLigados`;
  - **Integração:** canal ThingSpeak `3577155` como padrão e API de visão no contrato atual (FastAPI, `caixas_buracos`, só buraco).
- **Testes:** `npm run lint` sem avisos em `src/` e `npm run build` ok. A conferência visual no navegador ficou pendente (extensão desconectada nesta sessão).
- **Revisão da equipe:** (preencher)

## 10. Assistente, descrição para a Prefeitura e espera da IA na versão em grafo (Claude Code · 14/11/2026 · pedido do João)

- **Contexto:** esta branch saiu antes de o assistente entrar na main. Em vez de juntar as duas (27 conflitos), foi portado só o que faltava, mantendo o visual em grafo.
- **Prompt (resumo):** "Aplique no front certo as mudanças de integração. Além das caixas na foto, mostre um card com a descrição gerada pela IA depois da análise do YOLO, com animação de loading e o texto Gerando sua descrição para a Prefeitura."
- **Como a IA ajudou:**
  - **assistente** (HU-21, RF20, RN06): tela `/assistente` trazida da main; na navegação ele fica fora do símbolo, junto do Sobre (trilho lateral e menu), porque os 6 pontos já são as partes do corpo;
  - **descrição para a Prefeitura** (HU-22, RF21, RN05, RN07): quando o YOLO termina, o `useFormReporte` já pede o texto ao Gemini. O `CardDescricaoIa` mostra "Gerando sua descrição para a Prefeitura…" (bolinhas ligadas + linhas de texto se formando) e depois o texto, com "Usar esta descrição" e "Gerar outra". O texto só vai para o reporte quando a pessoa escolhe usar, e ela ainda pode corrigir;
  - **espera da IA** (HU-05, RF08): `CardCarregando` com as bolinhas do grafo; "Preparando a IA…" enquanto a API aquece o modelo (`GET /`, `modelo_pronto`) e "Analisando a foto…";
  - **novas tentativas:** `useChamadaApi` tenta de novo sozinho até 3 vezes quando a API responde 5xx (3, 6 e 12 s), mostrando o motivo; depois aparece "Tentar de novo".
- **Problema encontrado:** a sugestão de descrição dava erro 422, porque o app manda `obstaculo` e `nao_analisada` e a API só aceitava `livre` e `buraco`. Corrigido na API.
- **Como foi testado:** API real local (descrição com os 4 tipos), `oxlint` e `npm run build`. Falta o teste clicando nas telas.
- **Revisão da equipe:** (preencher)
