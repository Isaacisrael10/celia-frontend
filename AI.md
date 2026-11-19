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
  - **câmera real do poste (ESP32-CAM) na área da Prefeitura** (HU-25, RF24): `services/posteApi.js` e o custom hook `useCameraReal` leem a API (`GET /poste/capturas` e `/poste/reportes`, INTEGRACAO.md seção 8.2) a cada 5 s. Se a câmera mandou foto há menos de 2 min (PROPOSTA), a aba mostra a foto real com as caixas do YOLO, o selo "Ao vivo · ESP32-CAM" e as etapas; senão, a câmera simulada com um aviso (RNF10). Os reports reais entram no topo da caixa de entrada e mostram um aviso quando chegam. Testado com uma cópia da API e do site apontando para ela;
- **Fontes das imagens (RNF04):** Pothole Dataset (KugaN, Roboflow Universe, CC BY 4.0, conjunto de teste) e Wikimedia Commons (domínio público). Cortadas em 800×600; o modelo v2 com confiança 0,40 acertou as 6.
- **Como foi testado:** `oxlint` sem avisos e `npm run build` ok. Falta o teste no navegador com a API ligada.
- **Revisão da equipe:** (preencher)

## 16. Mapa e texto grande: card sem rolagem, botões no rodapé e barra sem sobreposição (Claude Code · 16 e 17/11/2026 · pedido do João)

- **Contexto:** depois do merge da PR #3 e do commit de responsividade (`f41fb00`), o João achou bugs no Mapa e na letra "Maior" do Perfil.
- **Prompt (resumo):** "No mapa, o card do caminho de sempre tem que dar scroll para caber. Os botões Lista e Legenda devem ficar no rodapé, com a lista perto deles. Diminua um pouco o card 'Qual é o seu caminho de sempre'. No tamanho Maior, os textos da barra e de outros componentes se sobrepõem: faça uma varredura e corrija."
- **Como a IA ajudou:**
  - **card do caminho de sempre** (HU-04, RF02): o `max-height: 55%` virava 55% do próprio card na grade do computador, e o card sempre rolava (91 px visíveis de 203). Trocado por `55dvh` (altura da janela);
  - **título do card sem hífen:** o `hyphens: auto` dos títulos partia palavras ("cami-nho"); no card o texto só quebra entre palavras;
  - **Legenda e Lista no rodapé:** os botões do canto (Meu local e satélite, empilhados) deixavam a faixa de baixo com 104 px e afastavam a lista. No computador eles saem do fluxo e a lista desce até 10 px dos botões;
  - **card "Qual é o seu caminho de sempre?" menor:** de 165 para 148 px (menos espaço interno, ícone de 32 px e título de 16 px; o menor texto continua com 14 px, RNF05);
  - **barra lateral com letra Grande ou Maior** (RNF05): nome e frase de apoio invadiam a casa de baixo ("Locais" em cima de "Trilha IA"). Nome com teto de 18 px; a frase de apoio só aparece com letra grande em tela de 900 px ou mais de altura;
  - **mini mapa de Locais:** em 320 px, "8 locais perto" cobria o crédito do OpenStreetMap; cada um ficou na sua metade.
- **Como foi testado:** scripts com o Chrome headless (protocolo DevTools) medindo alturas, distâncias e textos sobrepostos em 11 telas, 4 a 8 tamanhos de janela e letra Normal, Grande e Maior, antes e depois. `oxlint` e `npm run build` ok. O hífen não aparece no Chrome headless (sem dicionário de pt-BR): conferido pelo João no navegador.
- **Revisão da equipe:** (preencher)

## 17. Nova logo e "I.A." em azul no nome C.E.L.I.A. (Claude Code · 17/11/2026 · pedido do João)

- **Contexto:** a equipe ganhou uma logo (um "C" azul-marinho abraçando uma pessoa azul), gerada pelo João com o Gemini.
- **Prompt (resumo):** "Coloque a logo na barra, no topo à esquerda, no lugar do ícone (não substitua o grafo do Menu). Substitua também no /sobre e no /perfil. Atenção às proporções. Em todo lugar onde estiver escrito C.E.L.I.A., os caracteres I.A. ficam no azul #49c8f5 e o resto na cor padrão. Acrescente a logo no /menu, ao lado do C.E.L.I.A., no card de acesso."
- **Como a IA ajudou:**
  - **`LogoCelia`:** a logo redesenhada em SVG a partir da imagem (medidas tiradas com Python: centro e raios do arco, círculo da cabeça e curva dos braços) e conferida sobrepondo o SVG à imagem original. Fica nítida em qualquer tamanho e sem fundo. Cores da imagem (#0e2b57 e #4aaae6, tokens `--logo-escuro` e `--logo-azul`); no modo escuro o "C" fica claro;
  - **onde entrou:** trilho lateral (48 px), botão do topo no celular (40 px), Sobre (104 px), Perfil (72 px) e card de acesso do Menu (36 px). O grafo do Menu e o bonequinho "Você está aqui" do mapa continuam com o símbolo de acessibilidade;
  - **`NomeCelia`:** escreve "C.E.L." na cor do texto e "I.A." em #49c8f5 (token `--cor-ia`). Os textos dos arquivos de dados (Sobre, Trilha, linha do tempo da Prefeitura) e as respostas do Assistente passam pela função `comNomeCelia`, que troca cada "C.E.L.I.A." pelo nome colorido. O leitor de tela continua lendo o nome inteiro.
- **Pontos em aberto:** #49c8f5 sobre branco tem contraste baixo (cerca de 1,9:1, RNF05). No card do Menu, no modo escuro, "C.E.L." usa a cor de link, que também é #49c8f5.
- **Como foi testado:** Chrome headless em Menu, Perfil, Sobre, Trilha, Prefeitura e Mapa, no celular e no computador, nos modos claro e escuro: cor real do "I.A.", tamanho de cada logo e nenhum "C.E.L.I.A." visível sem o azul. `oxlint` e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 18. Responsividade no app inteiro: zoom e texto grande sem nada sobreposto (Claude Code · 16/11/2026 · pedido do Isaac)

- **Contexto:** com zoom alto no navegador, alguns textos ficavam um em cima do outro.
- **Prompt (resumo):** "Dependendo do zoom, letras ficam sobrepostas. Ajuste a responsividade no aplicativo inteiro para não ficar nada grudado."
- **Como a IA ajudou:**
  - **regras gerais** (`base.css`): `overflow-wrap: anywhere` no corpo (palavra comprida quebra em vez de vazar) e hífen nos títulos;
  - **container queries:** o grafo do Menu e as figuras redondas (`container: figura` e `container: grafo`) trocam para rótulos curtos ou para lista quando o próprio espaço fica estreito, e não só a janela;
  - **pontos de quebra em `em`/`rem`:** acompanham o zoom e o tamanho de letra do Perfil;
  - **grades fluidas:** resumo da Prefeitura com `repeat(auto-fit, minmax(min(100%, 6.5rem), 1fr))` e abas que quebram linha;
  - **barra de navegação:** rótulo com teto de tamanho e quebra de linha; abaixo de 360 px de largura a barra usa 13 px (mínimo do RNF05).
- **Como foi testado:** script com o Chrome headless (protocolo DevTools) que procura textos sobrepostos e rolagem lateral em 13 telas × 15 cenários (larguras de 320 a 1440 px, zoom e letra Normal, Grande e Maior). Resultado: 0 problemas. `oxlint` e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 19. Mais opções de lazer acessível em Locais (Claude Code · 17/11/2026 · pedido do Isaac)

- **Contexto:** para a demonstração, a tela de Locais precisava de mais opções de lazer acessível perto da pessoa. Dados simulados.
- **Prompt (resumo):** "Adicionar mais opções de lazer acessível perto do usuário, com dados mocados para a demonstração. Sempre conferir se está responsivo, os cards estavam quebrando linha."
- **Como a IA ajudou:**
  - **dados** (`locais.json`): 9 locais de lazer em ruas reais do Grajaú, com `categoria` (esporte, cultura, ao ar livre) e recursos (vestiário, audiodescrição, Libras, área reservada, caminho plano);
  - **regras** (`domain/locais.js`): `CATEGORIAS_LAZER`, `filtrarLocais(locais, filtro, categoria)` e `nomeDoTipo` ("Lazer acessível · Cultura");
  - **hook** `useLocais`: guarda a categoria e volta para "Todo tipo" ao trocar o filtro principal;
  - **tela:** segundo filtro "Tipo de lazer" (só no lazer); card redesenhado (ícone na linha do tipo, nome e endereço na largura toda, distância e "Como chegar" no rodapé) e mini mapa fixo na tela do computador;
  - **erro 422 no Assistente:** a API (`Local.tipo`) só aceita `banheiro`, `descanso` e `capacite-se`. O app passou a mandar só os tipos aceitos (`TIPOS_ACEITOS_NA_API` em `domain/assistente.js`). Para o Assistente citar o lazer, o João precisa acrescentar `lazer` na API.
- **Como foi testado:** script que conta as linhas de cada card em 320, 375, 768 e 1280 px com letra Normal e Maior (2 linhas no máximo, só em 320 px ou letra Maior) e a varredura de sobreposição. `oxlint` e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 20. Revisão final pelos requisitos de Front-end Design e Web Development (Claude Code · 17/11/2026 · pedido do Isaac)

- **Prompt (resumo):** "Revisão final do código de acordo com os requisitos do projeto de Front-end Design e de Web Dev."
- **Como a IA ajudou:**
  - **auditoria:** CRUD completo na MockAPI pela interface; 26 custom hooks; `fetch` só em `services/`; regras sem React em `domain/`; modo claro/escuro por `data-tema`; 21 interações listadas; nenhuma chave no repositório;
  - **separação de camadas:** a tela do Assistente guardava a conversa e chamava a API. Isso foi para o custom hook `useAssistente`; a tela só desenha;
  - **README:** ficha CitizenTech com link do app publicado, nomes das faixas atualizados (Acessível, Atenção, Evite), tabela de hooks e lista de serviços corrigidas e duas tabelas que ligam cada requisito das disciplinas ao arquivo onde ele está.
- **Como foi testado:** Assistente no navegador (pergunta pronta vira balão; com a API desligada aparece o plano B amigável). `oxlint` e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 21. Reportar: YOLO antes do Gemini, cronômetro e pop-up de erro da IA (Claude Code · 18/11/2026 · pedido do João)

- **Contexto:** testando o app, o João enviou a foto de um caderno e o Gemini escreveu um report de buraco. Motivo: o Gemini nunca recebe a foto, só o tipo escolhido (que já vem como "Buraco"), o local e o texto. Além disso, quando os 3 modelos do Gemini falhavam, o app tentava mais 3 vezes e a pessoa podia esperar minutos sem saber o que acontecia.
- **Prompt (resumo):** "Quando os 3 modelos falharem, preciso de um aviso de erro ao usuário, com fallback e motivo, em estilo pop-up card. Também um contador de segundos enquanto a LLM processa o report. E linkar primeiro o YOLO: só se ele detectar buraco o Gemini gera o report."
- **Decisões do João (18/11):** buraco sem confirmação do YOLO não gera texto, mas o cidadão ainda pode escrever e enviar (o modelo acha cerca de 7 em 10 buracos, recall 69,8%); obstáculo, que o YOLO não reconhece, só vai ao Gemini depois que o cidadão conta o que viu.
- **Como a IA ajudou:**
  - **hook** `useDescricaoIa`: no buraco chama `/analisar` (YOLO) e só com "buraco" pede a descrição ao Gemini; ignora a resposta de uma foto já trocada; no obstáculo espera o texto;
  - **hook** `useCronometro(ativo, fase)`: conta os segundos da espera e recomeça ao passar do YOLO para o Gemini;
  - **hook** `useChamadaApi(esperas)`: aceita `[]` para não tentar de novo sozinho (a API já tentou os 3 modelos). O Assistente e a câmera do poste continuam com as 3 tentativas;
  - **regras** (`domain/descricaoIa.js`): `textoSuficiente` e `descricaoPadrao(tipo, local, texto)`, o plano B que funciona até sem internet e não apaga o que a pessoa escreveu;
  - **tela:** `PopupErroIa` com `<dialog>` nativo (prende o foco e fecha com Esc), motivo do erro e os botões "Usar texto padrão", "Tentar de novo" e "Escrever eu mesmo"; `CardDescricaoIa` com os estados "Conferindo a foto", "A IA não viu buraco nesta foto" e "Gerar descrição com IA" (obstáculo); `CardCarregando` com o contador (fora da leitura do leitor de tela, para não falar a cada segundo); caixas do YOLO de volta sobre a foto do cidadão.
- **Como foi testado:** Chrome sem janela controlado por script, com a API e o Gemini reais: foto com buraco (YOLO marcou "Buraco 93%", Gemini escreveu em 12 s), caderno desenhado (nenhuma caixa, aviso e nenhum report), obstáculo (botão desabilitado sem texto; Gemini escreveu em 31 s) e falha dos 3 modelos simulada com 503 (pop-up com o motivo; "Usar texto padrão" preencheu o campo). `oxlint` sem avisos em `src/` e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 22. Merge do PR #5 e refatoração de robustez pelos requisitos das disciplinas (Claude Code · 18/11/2026 · pedido do Isaac)

- **Contexto:** antes de levar a API para a VPS, o Isaac pediu para conferir e mergear o que faltava do João e refatorar o front. O João tinha uma lista de requisitos para os módulos Python da equipe ("funciona do início ao fim, funções com docstring e uma tarefa cada, API real com plano B, nada derruba: rede, arquivo e entrada"). O Isaac pediu para traduzir essa lista para Front-end Design e Web Development, sem mexer em Python.
- **Prompt (resumo):** "Mergear tudo, conferindo antes para não dar problema nem conflito. Depois refatorar o código pelas atribuições das nossas matérias, usando a estrutura do João só como ideia."
- **Como a IA ajudou:**
  - **PR #5:** revisão do código, `oxlint` e `npm run build` limpos e teste da tela Reportar com a API simulada no navegador (`fetch` trocado só no teste): buraco com caixa, texto do Gemini, "sem buraco", pop-up de falha e texto padrão. Era só soma em cima da `main`, sem conflito; mergeado;
  - **bug achado no teste do PR:** depois de o Gemini falhar, trocar para Obstáculo mantinha o erro antigo na tela. `useChamadaApi` ganhou `limpar()`, chamado pelo `useDescricaoIa` ao trocar foto ou tipo; a resposta do Gemini que chega depois da troca é ignorada;
  - **auditoria:** nenhum `fetch` fora de `services/`, nenhum arquivo sem uso, nenhum `console.log`; os pontos fracos eram respostas que não são JSON e a falta de proteção contra tela branca;
  - **serviço** `lerJson.js`: resposta com status 200 que não é JSON (Wi-Fi público que pede login devolve HTML) virava "Unexpected token '<'..." na tela. Agora vira mensagem em português na MockAPI, no ThingSpeak e na busca de lugar, e plano B na foto (`VisaoIndisponivel`);
  - **componente** `ErroDaTela` (error boundary, o único componente de classe, porque o React só oferece isso em classe): se uma tela quebrar ao desenhar, só ela vira "Esta tela teve um problema", com "Tentar de novo" e link para o Menu;
  - **comentários** nas funções que ainda não tinham (CRUD da MockAPI, `MensagemErro`, `Vazio`, tela Rotas, `VersaoReal`, `buscarTrilha`).
- **Como foi testado:** as 11 telas abertas no navegador sem cair no `ErroDaTela`; serviços chamados com resposta HTML falsa (mensagem amigável nos quatro) e com as APIs reais (MockAPI, ThingSpeak e Nominatim responderam); erro forçado na tela Rotas (mensagem e link apareceram, trocar de tela voltou ao normal; o erro de teste foi removido); celular 375 px com texto Maior sem rolagem lateral e pop-up cabendo na tela. `oxlint` sem avisos e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 23. Controles do mapa menores no celular (Claude Code · 18/11/2026 · pedido do Isaac)

- **Contexto:** no celular e no tablet, os botões Legenda e Lista, "Meu local", mapa/satélite e o bloco de créditos do mapa ocupavam três faixas em cima do mapa e tampavam boa parte dele.
- **Prompt (resumo):** "No mobile esses elementos estão muito grandes, tampando o mapa. Dá para posicionar melhor e menor. O boletim do caminho de sempre fica do mesmo tamanho."
- **Como a IA ajudou:**
  - **layout:** tudo numa linha só no celular e no tablet: Legenda e Lista à esquerda; créditos, "Meu local" e mapa/satélite juntos à direita. Com texto Maior, se faltar largura, o grupo da direita desce inteiro para a linha de baixo;
  - **tamanho:** os botões em cima do mapa passaram de 48 para 40 px de desenho, mas a área de toque continua com 48 px (um `::after` invisível em volta), para manter a regra de acessibilidade de toque mínimo;
  - **componente** `CreditoMapa`: no celular e no tablet o crédito obrigatório (OpenFreeMap/OpenStreetMap e Esri no satélite) fica recolhido num botão "i" (`aria-expanded`), como o próprio MapLibre faz em telas pequenas; um toque abre o texto completo num balão. No computador o texto continua sempre visível e o botão some (só CSS).
- **Como foi testado:** navegador em 375 px (texto Normal e Maior, mapa e satélite, crédito aberto e fechado), 768 px e 1440 px; sem rolagem lateral e sem erro no console. `oxlint` sem avisos e `npm run build` ok.
- **Revisão da equipe:** (preencher)

## 24. App publicado usando a API da equipe na VPS (Claude Code · 18/11/2026 · pedido do Isaac)

- **Contexto:** a API FastAPI da equipe (foto, Gemini e trilha) foi publicada numa VPS com HTTPS (`https://2-29-156-251.sslip.io`). Até aqui o app publicado ia direto para o plano B, porque o endereço padrão era `127.0.0.1:8000`.
- **Prompt (resumo):** "A API já está na VPS com HTTPS. Coloca o endereço na Vercel (VITE_URL_API) e faz o redeploy."
- **Como a IA ajudou:**
  - **conferência antes de trocar:** `/docs` respondendo 200, `/trilha` devolvendo as lições e o CORS liberando `https://celia-frontend.vercel.app` e `http://localhost:5173` (pré-requisição `OPTIONS /analisar`);
  - **endereço padrão:** em vez de variável no painel da Vercel, o endereço da VPS virou o padrão em `src/services/config.js`, no mesmo padrão da MockAPI e do ThingSpeak (não é senha, e quem clonar o repositório já usa a API real). `VITE_URL_API` continua servindo para testar com a API no próprio computador;
  - **textos do plano B:** as mensagens diziam que a IA "roda na demonstração local", o que deixou de ser verdade. Agora dizem que a IA está fora do ar no momento (câmera do poste, descrição do reporte, assistente e trilha); README e `.env.example` atualizados.
- **Como foi testado:** `oxlint` sem avisos, `npm run build` ok e o endereço da VPS conferido dentro do JavaScript gerado; depois do deploy, o mesmo conferido no site publicado.
- **Revisão da equipe:** (preencher)

## 25. Foto do cidadão só no navegador de quem enviou (Claude Code · 19/11/2026 · pedido do João)

- **Contexto:** a miniatura da foto do reporte ia em base64 no campo `fotoUrl` da MockAPI. A MockAPI é pública e o endereço dela está no JavaScript do app, então qualquer pessoa que chamasse `GET /reportes` via as fotos de todo mundo.
- **Prompt (resumo):** "Qualquer usuário que upar uma foto deixa ela pública. Dá para manter a classificação e a foto aparecer no reporte só para quem enviou, sumindo ao atualizar a página?"
- **Como a IA ajudou:**
  - **`useReportes`:** a foto sai do que vai para a MockAPI (`fotoUrl: ''`) e fica num `Map` só na memória do navegador, ligado ao id do reporte. O hook devolve os reportes com a foto local de volta, então o card de quem enviou mostra a foto e o dos outros vem sem ela. Sem localStorage: ao atualizar a página, a foto some;
  - **edição:** se o reporte tem foto local, o PUT também vai com `fotoUrl: ''`, para a foto não subir pela edição;
  - **classificação mantida:** a foto continua indo para o `/analisar` da API, que analisa só em memória e não salva (RNF01); a validação da RN05 continua exigindo a foto no formulário;
  - **textos:** Sobre, Versão real, README e comentários dizem agora que a foto não vai para a lista de reportes. As fotos antigas que já estavam na MockAPI ficam, por decisão do João (sem dado sensível).
- **Como foi testado:** o hook rodou no Node com React e `fetch` simulados (nada foi gravado na MockAPI): POST e PUT saíram com `fotoUrl` vazio, nenhuma chamada levou base64 e o card do autor continuou com a foto. `oxlint` sem avisos e `npm run build` ok.
- **Revisão da equipe:** (preencher)
