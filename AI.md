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

## 8. Boletim do caminho de sempre (Claude Code + Gemini · 13/11/2026)

- **Prompt (resumo):** discussão de produto com o Gemini sobre o que a pessoa precisa ver ao abrir o app, seguida de "Pode implementar" com a proposta final.
- **Como a IA ajudou:** mapa de ponta a ponta com a gaveta do **boletim do caminho de sempre** (`domain/boletim.js`, `components/BoletimCaminho.jsx`), escolha do caminho de sempre nas Rotas, alerta de calor no Perfil (`hooks/useLimiteCalor.js`) e selos do mapa que nunca ficam um em cima do outro.
- **Revisão da equipe:** (preencher)

## 9. Integração com o contrato da equipe (Claude Code · 13/11/2026)

- **Prompt (resumo):** o Isaac anexou o `INTEGRACAO.md` e pediu para alinhar o app a ele.
- **Como a IA ajudou:** canal 3577155 como padrão, nomes Acessível/Atenção/Evite, motivo 4 removido, descarte de valores absurdos do ThingSpeak, níveis de calor (32 e 41 °C), endereço da API em `VITE_URL_API` e conversão das caixas dos buracos de pixels para frações da foto.
- **Revisão da equipe:** (preencher)

## 10. Trilha de IA, assistente e descrição sugerida (Claude Code · 14/11/2026)

- **Prompt (resumo):** "Pode ir fazendo o que você consegue aí" (itens do contrato que dependem só do front).
- **Como a IA ajudou:**
  - serviço comum `services/apiEquipe.js` (tempo máximo, mensagem em português do campo `detail`, e um erro próprio para quando a API não está no ar) e o hook `useChamadaApi`;
  - **trilha** (HU-19): telas `Trilha` e `Licao`, com cópia em `src/data/trilha.json` como plano B (vazia até a equipe colar o arquivo da API);
  - **assistente** (HU-21, RN06): `domain/assistente.js` monta a situação dos trechos do caminho de sempre e a lista de locais; a tela mostra a conversa e transforma os ids citados em links;
  - **descrição sugerida** (HU-22, RN07): botão no novo reporte; o texto vai para o campo editável e só é enviado quando a pessoa envia o reporte.
- **Como foi testado:** com uma API falsa local que imita o contrato (respostas, lição inexistente e API desligada). O teste com a API real da equipe ainda falta.
- **Problema encontrado:** o recurso "horário" dos locais não tem nome e virava uma vírgula sobrando no texto enviado à IA; foi filtrado.
- **Revisão da equipe:** (preencher)

## 11. Versão para computador (Claude Code · 14/11/2026)

- **Prompt (resumo):** "Deixe o design responsivo para desktop também."
- **Como a IA ajudou:** criou `src/styles/responsivo.css` com dois degraus (600 px e 960 px): menu lateral no lugar da barra de baixo, conteúdo em coluna de leitura alinhada com o cabeçalho, boletim do Mapa como cartão flutuante, rotas lado a lado para comparar, Locais com o mini mapa fixo ao lado da lista e reportes em duas colunas. O celular continua igual.
- **Problemas encontrados:** o menu lateral herdou o `box-sizing` da barra do celular e ficou mais largo e mais alto que a tela; e no Perfil a linha do fieldset atravessava o título "Alerta de calor no ponto" (também no celular), corrigido com `float` no legend.
- **Revisão da equipe:** (preencher)


## 12. Integração com a API real: espera da IA e novas tentativas (Claude Code · 14/11/2026, branch staging-test-integracao, pedido do João)

- **Prompt (resumo):** "Coloque um card de loading, seguindo as regras de design, até a IA carregar de verdade. No assistente, tela de carregamento e, se der erro 5xx, mostrar o motivo e tentar de novo."
- **Como a IA ajudou:**
  - `CardCarregando` em `components/Estados.jsx`: card com círculo girando (parado para quem pede menos movimento) e `role="status"` para o leitor de tela;
  - foto (HU-05, RF08): `modeloPronto()` em `services/visaoApi.js` consulta `GET /` da API; o `useAnaliseFoto` mostra "Preparando a IA…" até `modelo_pronto` ser `true` e depois "Analisando a foto…";
  - assistente e descrição sugerida (HU-21, HU-22): o `useChamadaApi` tenta de novo sozinho até 3 vezes quando a API responde 5xx (espera 3, 6 e 12 s), mostrando o motivo; depois aparece "Tentar de novo". Não tenta sem parar para não estourar a cota grátis do Gemini;
  - tempo máximo do assistente subiu para 65 s, porque a API agora tenta 3 modelos do Gemini (até 20 s cada).
- **Como foi testado:** API real rodando local (`GET /` com `modelo_pronto`, `/analisar` em 0,3 s depois do aquecimento) e `npm run build`. Falta o teste clicando nas telas.
- **Revisão da equipe:** (preencher)
