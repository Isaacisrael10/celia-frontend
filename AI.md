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
