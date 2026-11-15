# Uso de IA no front-end da C.E.L.I.A.

Registro de como a equipe usou IA para construir o front-end: o que foi pedido, o que a IA produziu, como o resultado foi testado e o que a equipe revisou. Todo código gerado foi lido e entendido pela equipe antes de entrar no projeto.

---

## Panorama geral

### Ferramentas

| Ferramenta | Uso |
| --- | --- |
| **Claude Design** | Protótipo visual e especificação de tokens e componentes (`design/`) |
| **Claude Code** | Implementação, testes e documentação, dentro do repositório |
| **Gemini** | Discussão de produto antes de implementar o boletim do caminho de sempre (item 8) |

### Como trabalhamos com a IA

1. **Contexto fixo:** o `CLAUDE.md` do repositório reúne os contratos da equipe (ThingSpeak, API de visão, MockAPI), as decisões de design e a arquitetura. A IA lê esse arquivo antes de cada tarefa, então os pedidos não precisam repetir as regras.
2. **Pedidos por entrega:** cada pedido corresponde a um item do plano (`docs/CELIA_frontend_plano.md`) ou do contrato da equipe (`docs/INTEGRACAO.md`), com as histórias de usuário (HU) e os requisitos (RF, RN, RNF) daquele item.
3. **Arquitetura obrigatória:** acesso a dados em `services/` (sem React), regras puras em `domain/` (sem React e sem fetch), estado e efeitos em custom hooks (`hooks/`), e telas e componentes só com a apresentação.
4. **Teste antes de entrar:** lint e build a cada entrega; servidores falsos locais que imitam a MockAPI e a API da equipe; conferência das telas no navegador, no celular e no computador.
5. **Commits pequenos**, um por mudança, com mensagem em português.

### Regras que valem para todo pedido

- Nenhuma chave no repositório e nenhum dado pessoal real. Os dados de exemplo são simulados e a tela avisa isso.
- O app nunca fala direto com o Gemini: o assistente passa sempre pela API da equipe.
- **Plano B:** se a API da equipe não responder, a tela mostra uma mensagem amigável e segue funcionando. Nunca aparece erro cru.
- Acessibilidade: contraste AA nos dois temas, alvos de toque de 48 px, rótulos para leitor de tela e semáforo que nunca depende só da cor.

### Resumo das entregas

| # | Entrega | Requisitos |
| --- | --- | --- |
| 1 | Identidade visual | RNF de acessibilidade |
| 2 | Estrutura do projeto e tema claro/escuro | Web Dev (modo claro/escuro) |
| 3 | CRUD de reportes, mapa e poste ao vivo | CRUD com API externa, RF do mapa |
| 4 | Foto com IA de visão e plano B | HU-05, RF08, RN05 |
| 5 | Rotas, alerta de trecho, Locais e histórico | RF03, HU-12, HU-14 |
| 6 | Mapa livre e bairro Grajaú | Busca de lugar e GPS |
| 7 | Local do reporte pelo mapa | Seletor com pino e busca reversa |
| 8 | Boletim do caminho de sempre | Tela inicial do Mapa |
| 9 | Integração com o contrato da equipe | `docs/INTEGRACAO.md` |
| 10 | Trilha de IA, assistente e descrição sugerida | HU-19, HU-21, HU-22, RN06, RN07 |
| 11 | Versão para computador | Layout responsivo |

---

## 1. Identidade visual (Claude Design)

- **Pedido (resumo técnico):** identidade visual de um app de mobilidade urbana acessível, com contraste AA nos modos claro e escuro, fonte pensada para baixa visão, semáforo de três faixas que nunca depende só da cor (cor, ícone, nome e tipo de linha) e componentes reutilizáveis (botões, campos, cards, barra de navegação, avisos).
- **Resultado:** protótipo navegável e especificação de tokens e componentes, em `design/`.
- **O que mudamos:** o protótipo foi feito antes de a equipe fechar o conceito dos postes com ESP32. Aproveitamos o visual e os componentes, e as telas seguem o plano atual (`docs/CELIA_frontend_plano.md`).

## 2. Estrutura inicial do projeto (Claude Code · 12/11/2026)

- **Pedido (resumo técnico):** criar o projeto em React + Vite com React Router, aplicar os tokens e componentes do Claude Design às telas do plano atual (Mapa, Rotas, Reportar, Locais e Perfil) e separar o código em camadas (`services`, `hooks`, `domain`, `components`, `pages`). Antes disso, conferir se a pasta tinha tudo o que a entrega exige.
- **Como a IA ajudou:**
  - criou o projeto e a estrutura de pastas;
  - passou os tokens de cor do design para `src/styles/tokens.css`;
  - criou `src/domain/faixas.js`, para os nomes das faixas ficarem num lugar só;
  - criou o custom hook `useTema` (modo claro/escuro salvo no navegador);
  - montou a barra inferior, o cabeçalho e as 5 telas iniciais.
- **Revisão da equipe:** (preencher) o que conferimos e o que mudamos à mão.

## 3. CRUD de reportes, mapa e poste ao vivo (Claude Code · 12/11/2026)

- **Pedido (resumo técnico):** implementar os itens 2, 3 e 4 da lista de prioridades, que não dependem dos colegas:
  - CRUD completo de reportes na MockAPI (listar, criar, editar e excluir);
  - mapa MapLibre com os estilos próprios e os trechos desenhados por faixa;
  - leitura do poste no ThingSpeak a cada 20 s, com a regra "sem leitura há mais de 10 min = Sem dados".
- **Como a IA ajudou:**
  - **CRUD de reportes:** `services/reportesApi.js` (fetch na MockAPI), `hooks/useReportes.js`, `domain/reportes.js` (tipos, situações, validação) e a tela com lista, filtro por situação, formulário e exclusão com confirmação. Testado com um servidor falso local que imita a MockAPI.
  - **Mapa:** MapLibre com os estilos próprios (`celia-mapa-claro/escuro.json`), trechos desenhados por faixa (contínua, tracejados e pontilhado), selos ! e ✕ que também funcionam pelo teclado, legenda e a alternativa em lista.
  - **Poste ao vivo:** `services/thingspeak.js` + `hooks/useStatusPoste.js` (busca a cada 20 s e aplica a regra dos 10 minutos), widget de calor e detalhe do trecho com as medidas.
- **Problemas encontrados e decisões:**
  - O MapLibre 6 não carregava o "worker" no build de produção; voltamos para o MapLibre 5.
  - Só existe um poste, então os outros trechos usam uma **faixa de exemplo (simulada)** em `src/data/trechos.json`. A tela avisa isso ao abrir o trecho.
- **Revisão da equipe:** (preencher)

## 4. Foto com IA de visão e plano B (Claude Code · 12/11/2026)

- **Pedido (resumo técnico):** implementar o novo reporte com foto (item 5 do plano). A foto vai para `POST /analisar` da API de visão, e as caixas dos buracos são desenhadas sobre ela. Se a API não responder, o reporte segue como "Não analisada", com mensagem amigável.
- **Como a IA ajudou:**
  - `services/visaoApi.js` manda a foto para `/analisar` (com tempo máximo de 20 s) e `services/miniatura.js` reduz a foto para guardar na MockAPI;
  - `domain/visao.js` converte as caixas da IA em porcentagem da foto, aceitando coordenadas em pixels ou de 0 a 1 (o formato ainda estava pendente com o Caio);
  - `hooks/useAnaliseFoto.js` controla os estados (analisando, analisada, plano B);
  - `FotoComCaixas` desenha as caixas sobre a foto; o formulário só envia com foto, tipo e descrição (RN05).
- **Testes:** com uma API de visão falsa (resposta "buraco" com uma caixa) e com a API desligada. Sem a API, aparece "A análise por IA roda na demonstração local. Veja o vídeo no README." e o reporte vai como "Não analisada", sem erro cru.
- **Revisão da equipe:** (preencher)

## 5. Rotas, alerta, Locais, histórico e documentação (Claude Code · 12/11/2026)

- **Pedido (resumo técnico):** concluir a lista de prioridades até a linha de corte e os itens seguintes:
  - comparação de 3 rotas pré-definidas com critério de recomendação;
  - alerta quando o caminho escolhido passa por trecho em Evite (RF03);
  - locais de apoio com filtro;
  - mini histórico do poste;
  - rascunhos do README.md e do Integrantes.md.
- **Como a IA ajudou:**
  - **Rotas:** `data/rotas.json` (3 rotas de exemplo), `domain/rotas.js` (a recomendada é a de pior trecho menos grave, depois menos problemas, depois menos minutos) e `hooks/useRotas.js`;
  - **Alerta (RF03):** se a rota escolhida passa por Evite, aparece um aviso no mapa com "Ver rotas" e "Seguir assim". Como o poste é lido ao vivo, o aviso surge sozinho se o trecho mudar;
  - **Locais:** lista com filtro Banheiros/Descanso, dados simulados com a fonte real prevista;
  - **Mini histórico:** últimas leituras do poste no detalhe do trecho;
  - **Perfil:** interruptor do modo chuva (comportamento ainda em definição) e "Sobre";
  - rascunho do **README.md** e modelo do **Integrantes.md**.
- **Revisão da equipe:** (preencher)

## 6. Mapa livre e bairro Grajaú (Claude Code · 12/11/2026)

- **Pedido (resumo técnico):** tirar o mapa de uma área fixa e permitir explorar qualquer região:
  - busca de lugar e botão "Meu local" (GPS);
  - os trechos de exemplo vão para o Grajaú, onde a equipe faz os testes e onde foram tiradas as fotos usadas pela IA de visão;
  - os reportes aparecem no mapa como marcadores, em qualquer região.
- **Como a IA ajudou:**
  - baixou o traçado de 11 ruas reais do Grajaú (OpenStreetMap, pelo Nominatim, uma busca por segundo) e gerou 39 trechos em `src/data/trechos.json`; rotas e locais de exemplo foram para o Grajaú;
  - busca de lugar (`services/geocodificacao.js` + `hooks/useBuscaLugar.js`): o mapa voa até qualquer bairro, rua ou lugar;
  - botão "Meu local" com o GPS (`hooks/useLocalizacao.js`), com aviso se a permissão for negada;
  - reportes com localização: vêm do trecho ou do endereço digitado, e aparecem no mapa como marcadores.
- **Revisão da equipe:** (preencher)

## 7. Local do reporte pelo mapa (Claude Code · 12/11/2026)

- **Pedido (resumo técnico):** no formulário de reporte, escolher o local num mini mapa:
  - abre na posição do GPS;
  - a pessoa arrasta o mapa até o pino ficar no problema, ou digita o endereço e o mapa vai até ele;
  - o endereço é preenchido sozinho por busca reversa.
- **Como a IA ajudou:** criou o `SeletorLocal` (mapa pequeno com pino fixo no centro, estilo aplicativo de transporte), o hook `useLocalDoReporte` (GPS ao abrir, busca do endereço, e busca reversa que preenche o endereço quando a pessoa arrasta) e a função `enderecoDoPonto` no serviço de geocodificação.
- **Problema encontrado:** depois de arrastar, o mapa desliza por inércia e o evento final não indica que foi a pessoa; a solução foi marcar o arrasto no início do movimento.
- **Revisão da equipe:** (preencher)

## 8. Boletim do caminho de sempre (Claude Code + Gemini · 13/11/2026)

- **Pedido (resumo técnico):** primeiro, uma discussão de produto com o Gemini sobre o que a pessoa precisa ver ao abrir o app antes de sair para o trabalho. Depois, a implementação da proposta final:
  - mapa de ponta a ponta;
  - um boletim com a pior situação do caminho de sempre, o motivo e o calor no ponto;
  - escolha do caminho de sempre nas Rotas;
  - alerta de calor configurável no Perfil.
- **Como a IA ajudou:** mapa de ponta a ponta com a gaveta do **boletim do caminho de sempre** (`domain/boletim.js`, `components/BoletimCaminho.jsx`), escolha do caminho de sempre nas Rotas, alerta de calor no Perfil (`hooks/useLimiteCalor.js`) e selos do mapa que nunca ficam um em cima do outro.
- **Revisão da equipe:** (preencher)

## 9. Integração com o contrato da equipe (Claude Code · 13/11/2026)

- **Pedido (resumo técnico):** alinhar o app ao contrato fechado pela equipe em `docs/INTEGRACAO.md`:
  - canal do ThingSpeak;
  - nomes das faixas e códigos de motivo;
  - faixa de valores válidos dos sensores;
  - níveis de calor;
  - endereço da API e formato da resposta de `/analisar`.
- **Como a IA ajudou:** canal 3577155 como padrão, nomes Acessível/Atenção/Evite, motivo 4 removido, descarte de valores absurdos do ThingSpeak, níveis de calor (32 e 41 °C), endereço da API em `VITE_URL_API` e conversão das caixas dos buracos de pixels para frações da foto.
- **Revisão da equipe:** (preencher)

## 10. Trilha de IA, assistente e descrição sugerida (Claude Code · 14/11/2026)

- **Pedido (resumo técnico):** implementar, do lado do front, as seções 5 e 6 do contrato, que não dependem de outra parte da equipe:
  - **trilha de IA:** `GET /trilha` e `/trilha/{id}`, com cópia local como plano B (HU-19);
  - **assistente do trajeto:** `POST /assistente/trajeto`, enviando só os trechos e locais que o app já tem (HU-21, RN06);
  - **descrição do reporte sugerida pela IA:** `POST /assistente/descricao`; a pessoa edita o texto antes de enviar (HU-22, RN07).
- **Como a IA ajudou:**
  - serviço comum `services/apiEquipe.js` (tempo máximo, mensagem em português do campo `detail`, e um erro próprio para quando a API não está no ar) e o hook `useChamadaApi`;
  - **trilha** (HU-19): telas `Trilha` e `Licao`, com cópia em `src/data/trilha.json` como plano B (vazia até a equipe colar o arquivo da API);
  - **assistente** (HU-21, RN06): `domain/assistente.js` monta a situação dos trechos do caminho de sempre e a lista de locais; a tela mostra a conversa e transforma os ids citados em links;
  - **descrição sugerida** (HU-22, RN07): botão no novo reporte; o texto vai para o campo editável e só é enviado quando a pessoa envia o reporte.
- **Como foi testado:** com uma API falsa local que imita o contrato (respostas, lição inexistente e API desligada). O teste com a API real da equipe ainda falta.
- **Problema encontrado:** o recurso "horário" dos locais não tem nome e virava uma vírgula sobrando no texto enviado à IA; foi filtrado.
- **Revisão da equipe:** (preencher)

## 11. Versão para computador (Claude Code · 14/11/2026)

- **Pedido (resumo técnico):** adaptar o layout, feito primeiro para o celular, a tablet e computador. O celular não muda. Em telas largas o espaço é usado para comparar e ler melhor.
- **Como a IA ajudou:** criou `src/styles/responsivo.css` com dois degraus (600 px e 960 px):
  - menu lateral no lugar da barra de baixo;
  - conteúdo em coluna de leitura alinhada com o cabeçalho;
  - boletim do Mapa como cartão flutuante;
  - rotas lado a lado para comparar;
  - Locais com o mini mapa fixo ao lado da lista;
  - reportes em duas colunas.
- **Problemas encontrados:**
  - o menu lateral herdou o `box-sizing` da barra do celular e ficou mais largo e mais alto que a tela;
  - no Perfil, a linha do fieldset atravessava o título "Alerta de calor no ponto" (também no celular); corrigido com `float` no legend.
- **Revisão da equipe:** (preencher)

## 12. Redesenho em grafo (Claude Code · 14/11/2026 · PROPOSTA, experimento local do João)

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

## 13. Ajustes de design, Trilha IA, Sobre, satélite e refatoração (Claude Code · 14/11/2026 · PROPOSTA do João)

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

## 14. Assistente, descrição para a Prefeitura e espera da IA na versão em grafo (Claude Code · 14/11/2026 · pedido do João)

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

## 15. Módulo Prefeitura: câmera do poste com IA de visão e caixa de reportes (Claude Code · 15/11/2026 · PROPOSTA do João, em teste local)

- **Contexto:** o João corrigiu o escopo. A IA de visão (YOLO) roda só no poste (ESP32 com câmera, em ponto liberado pela Prefeitura). Quando acha um buraco, o poste escreve o reporte com o Gemini e envia sozinho à Prefeitura. O cidadão só envia a foto, e a IA ajuda a escrever o texto, que ele revisa (RN07). Sem ESP32-CAM, fotos já baixadas fazem o papel da câmera.
- **Prompt (resumo):** "O YOLO é o módulo da Prefeitura no front. Existe o reporte do cidadão (ele revisa) e o reporte do poste (enviado automaticamente). Crie um módulo separado para a Prefeitura com um vídeo falso ao vivo do YOLO rodando, uma barra de navegação e uma seção que lista reportes de exemplo com localização e data."
- **Como a IA ajudou:**
  - **tela `/prefeitura`** (HU-06, HU-07, HU-16, RF09, RF10, RF13): fica fora do símbolo, junto do Assistente e do Sobre. Tem um resumo (total, dos postes, dos cidadãos) e uma barra de abas acessível (setas do teclado): "Câmera do poste" e "Reportes recebidos";
  - **câmera ao vivo SIMULADA** (`CameraPoste`, `useCameraPoste`): selo AO VIVO, relógio, linhas de vídeo, varredura enquanto a IA analisa e as caixas do YOLO por cima. Uma "ronda" passa por 6 fotos (2 calçadas livres e 4 com buraco). Cada foto vai para o `POST /analisar` real, que também avisa o poste no Wokwi por MQTT. Se for buraco, o `POST /assistente/descricao` escreve o reporte e ele entra sozinho na caixa de entrada. A tela diz que é uma simulação e explica como é na versão real;
  - **etapas** (`EtapasPoste`): Câmera captura → IA de visão → LED vermelho (MQTT) → Gemini escreve → Enviado à Prefeitura, acendendo uma depois da outra;
  - **caixa de entrada** (`CardReportePrefeitura`, `useReportesPrefeitura`): reportes de exemplo (dados simulados, ruas do Grajaú) com origem (poste ou cidadão), local, data e hora, situação e "Ver no mapa". Filtro por origem;
  - **reporte do cidadão sem YOLO** (HU-05, HU-22, RF08, RF21, RN07): `useAnaliseFoto` virou `useFotoReporte` (só prévia e miniatura). O cidadão escolhe buraco ou obstáculo, e a descrição do Gemini é pedida assim que a foto fica pronta.
  - **ajustes de 15/11 (pedido do João):** abas sem rolar junto e na largura dos cards; câmera e etapas com a mesma largura e altura; imagens estáticas; título centralizado (`Cabecalho centro`); cards e botões "saltam" ao passar o mouse (só com mouse e respeitando "menos movimento");
  - **"Como é na versão real" em scroll storytelling** (`VersaoReal`, `useAparecerAoRolar`): linha do tempo com 7 nós (poste, câmera, IA no poste, trecho "Evite", mapa, reporte automático, LGPD). Ao rolar, o `IntersectionObserver` abre cada card (recorte de cima para baixo, deslize lateral e textos subindo em sequência) e a linha se desenha até o próximo nó. Cada card tem a versão real e, embaixo, "Nesta demonstração";
  - **trilho lateral escondido (todas as telas):** fica uma beirada à mostra; ao passar o mouse ele desliza da esquerda para a direita e as telas acompanham, porque o trilho e as telas usam a mesma variável `--nav-lado`, registrada com `@property` para poder ser animada. Só com mouse (em tablet de toque ele fica aberto). O trilho vai do topo ao pé da página, colado na borda: isso corrigiu um tremor (com o mouse no vão de 12 px, ele abria e fechava sem parar);
  - **textos centralizados:** título do cabeçalho, texto de abertura, notas do pé da tela e títulos que apresentam cards e botões, em todas as telas. O texto dentro dos cards continua à esquerda;
  - **revisão tela por tela (pedido do João, conferida com capturas do Edge headless):** trilho com cantos de 14 px; Reportes com botão, filtros e cards centralizados e cards da mesma altura; Locais com filtros no centro e o mini mapa esticando do primeiro ao último card; Sobre com o card da C.E.L.I.A. em coluna (símbolo em cima), todos os textos dos cards centralizados, linha incompleta de cards no meio (flex-wrap) e a linha do tempo "Como ajuda no dia a dia" com bolinhas e textos centralizados e a ligação de uma bolinha à outra;
  - **modo chuva retirado do Perfil** (HU-15 e RF05 descartados do backlog pelo João em 15/11);
  - **aba "Alertas de calor"** (HU-13, RF04, RN01, dados de exemplo): explicação do alerta de calor no ponto e por que ele importa para quem tem mobilidade reduzida, legenda com a quantidade por nível, filtro e 6 cards pequenos com índice de calor, temperatura, umidade, poste, local, hora e orientação. Cores: verde a partir de 30 °C, amarelo a partir de 32 °C, vermelho a partir de 35 °C (PROPOSTA, as mesmas opções do Perfil; o ESP32 usa 32 e 41 °C). A aba também abre pelo endereço `/prefeitura?aba=calor`;
  - **novo fundo** (exemplo de código passado pelo João, em Tailwind, convertido para CSS puro): duas manchas de luz azul desfocadas que flutuam devagar (18 s e 22 s), em cima à direita e embaixo à esquerda, no `FundoGrafo` do layout comum. Param com "menos movimento" e somem com "mais contraste". A arte em imagem testada antes foi descartada. Reportes em 3 colunas, com a última linha centralizada;
  - **Menu como página** (`/menu`, pedido do João): o menu deixou de ser uma caixa de diálogo e virou uma página fora da moldura, com o fundo animado. Fica o grafo de acessibilidade à esquerda e o painel de acesso à direita (título, descrição, "Acesso Prefeitura" e "Acesso Cidadão"). No celular, o painel vem primeiro. `/` e `/home` levam para `/menu`. O símbolo da barra abre `/menu` levando a tela de origem: o grafo mostra "Você está aqui" nela e o X volta para ela. Os links de Assistente, Prefeitura e Sobre saíram do menu. O grafo virou o componente `GrafoAcessibilidade` com a mesma estrutura, e o CSS dele saiu do `MenuGrafo.css` sem as partes do diálogo (`GrafoAcessibilidade.css`). O Mapa mudou de `/` para `/mapa`;
  - **ajustes do Menu:** sem o botão X (sai-se pelo grafo ou pelos botões). A Prefeitura saiu da barra de navegação do cidadão e agora só abre pelo botão "Acesso Prefeitura" do Menu;
  - **título do Menu acima do painel:** "Para onde vamos?" e a frase de apoio, maiores (título grande e texto de 18 px), centralizados em cima do painel de acesso na coluna da direita. O grafo ficou sozinho na coluna da esquerda, centralizado na horizontal e na vertical;
- **Fontes das imagens (RNF04):** Pothole Dataset (KugaN, Roboflow Universe, CC BY 4.0, conjunto de teste) e Wikimedia Commons (domínio público). Cortadas em 800×600; o modelo v2 com confiança 0,40 acertou as 6.
- **Como foi testado:** `oxlint` sem avisos e `npm run build` ok. Falta o teste no navegador com a API ligada.
- **Revisão da equipe:** (preencher)
