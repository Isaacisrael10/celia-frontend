# C.E.L.I.A. · Design System (direção em grafo)

Caminhos em Liberdade, Inclusão e Acessibilidade. App para pessoas com deficiência física ou mobilidade reduzida verem, antes de sair de casa, como estão as calçadas no caminho até o trabalho: status dos trechos medidos por postes com ESP32 nos pontos de ônibus, rota mais acessível e reporte de problemas com foto analisada por IA.

Este design system descreve a **direção visual em grafo** feita pelo João na branch `joao/grafo-trilha-sobre` (commit `545851e`, 15/11/2026). Ela ainda não está no `main`: quando entrar, este documento passa a valer para o app inteiro e substitui o `design/README.md` (handoff de 12/11) e o `docs/CELIA_design_system.md` (antigo).

## A ideia central: o símbolo é um grafo

O símbolo internacional de acessibilidade tem cinco bolinhas (cabeça, mãos e pés) ligadas por linhas que se encontram no meio do corpo. A interface inteira nasce dessas duas formas:

- **Bolinha:** círculo azul `primary` com contorno escuro `ink`. É a tela atual na navegação, o número de um passo, o marcador de faixa, o botão-ícone, o radio, o selo no mapa.
- **Ligação:** traço de 2px com ponta redonda, que vai da borda de uma bolinha até a borda da próxima, sem passar por trás. Liga as telas na navegação, os passos do PassosLigados e as bolinhas do Carregando.

Uma bolinha **tracejada** é um ponto que ainda não existe ou que fica fora do símbolo: estado Vazio, Sem dados, Sobre e Assistente na navegação.

## Princípios

1. **Legível antes de bonito.** Contraste AA nos dois temas, texto em rem que acompanha a fonte escolhida, toque de 48px. O vidro só entra onde o texto continua passando.
2. **Nunca só a cor.** Faixa = cor + ícone + nome + padrão de linha. Selecionado = cor + contorno + peso. Erro = borda grossa + ícone + texto.
3. **Linguagem simples.** Frases curtas, voz ativa, o nome que a pessoa reconhece ("Avise um problema", "Banheiros e descanso").
4. **Movimento que responde.** Só o necessário para mostrar onde a pessoa está e o que mudou, e nada para quem pediu menos movimento.

## Cores

A paleta é azul e vem do próprio símbolo.

- `primary` **#49C8F5** é o azul do símbolo, igual nos dois temas. Ele é sempre **fundo** (botão primário, viajante da navegação, pílula selecionada, bolinha numerada) com `on-primary` em cima (8,7:1). No tema claro ele não passa contraste como texto.
- `link` é o azul de texto: #0A72A8 no claro (5,3:1 sobre `bg`) e o próprio #49C8F5 no escuro. Links, ação em texto, botão secundário, anel de foco (`focus`).
- `bg` (branco azulado / azul-noite), `card`, `ink` e `muted` formam a base. `muted` só sobre `bg` ou `card`, nunca sobre o vidro da navegação.
- Bordas: `borda-campo` para tudo que precisa de 3:1 (campos, trilho do interruptor, ligação dos passos); `linha`, `line-soft` e `line-strong` para divisórias decorativas.
- O tema escuro tem valores próprios para tudo. As sombras quase somem lá, e a peça se separa pela cor e pela borda.

### Semáforo
`faixa-normal`, `faixa-atencao`, `faixa-perigo` e `faixa-sem-dados` aparecem **só** nos marcadores de faixa e nas linhas do mapa. Erro de formulário, botão destrutivo e avisos não usam vermelho: usam `ink`.

| Faixa | Claro | Escuro | Ícone | Linha |
| --- | --- | --- | --- | --- |
| Acessível | #1E8E3E | #5BD08A | ✓ | contínua |
| Atenção | #B26A00 | #F2B84B | ! | tracejado longo |
| Evite | #C62828 | #FF7A7A | ✕ | tracejado curto |
| Sem dados | #6B717B | #A0A6B0 | ? | pontilhado |

O nome da faixa vem junto do motivo: "Evite · calor", "Atenção · calçada estreita". Os nomes ficam em `src/domain/faixas.js` e são os mesmos no app, no Python e no ESP32.

## Vidro

O redesenho trouxe superfícies translúcidas com desfoque, que deixam ver o FundoGrafo e o mapa por trás. São cinco níveis, do mais leve ao mais cheio:

| Token | Força | Onde |
| --- | --- | --- |
| `nav-vidro-topo` → `nav-vidro-base` | 34% → 58% (claro) | barra de navegação do celular, mais cheia atrás dos nomes |
| `nav-vidro-trilho` | 44% | trilho lateral |
| `vidro` | 70% | peças pequenas que flutuam |
| `cartao` | 80%, **sem desfoque** | cards de lista |
| `vidro-forte` | 88% | painéis com texto sobre o mapa |

Regras: lista nunca usa desfoque (pesa no celular). Toda peça de vidro tem o fio `vidro-borda`. Em **Mais contraste** (`data-contraste="alto"`), `prefers-contrast: more` ou `prefers-reduced-transparency`, todo vidro vira `card` cheio, o desfoque some, as bordas passam a `borda-campo` e `muted` escurece (10:1 no claro).

## Tipografia

Uma família só: **Lexend** (Google Fonts, pesos 400, 500 e 600), desenhada para facilitar a leitura. Fallback `system-ui, sans-serif`.

- Todos os tamanhos em **rem**. 1rem é o tamanho que a pessoa escolheu no navegador; o Perfil ainda aumenta para 112,5% (`data-texto="grande"`) ou 125% (`data-texto="maior"`), e o app inteiro acompanha.
- Escala: `texto-p` 14px (o menor) · `texto-m` 16px · `texto-g` 18px · `titulo-p` 20px · `titulo-m` 24px · `medida-valor` 28px · `titulo-g` 26 a 38px conforme a largura.
- Títulos em 600 com `letter-spacing: -0.01em` e `text-wrap: balance`. Texto corrido em 400 com altura de linha 1,5. Introdução até 60 caracteres por linha.
- Exceção única: o nome das telas na barra do celular tem teto de 14px, porque seis nomes dividem a largura.

## Forma e espaço

- Raios crescem com a peça: `raio-p` 12px (selos) · 14px (campos) · `raio` 20px (cards) · `raio-g` 28px (painéis, navegação) · `raio-botao` 999px (botões e pílulas). Bolinhas são círculos.
- Espaço: o código usa px direto. Os valores que se repetem são 4, 8, 12, 16, 20, 28 e 40px (`espaco-*`). Gutter lateral de 16px no celular, 28px no tablet e 40px no computador; conteúdo até 76rem.
- Layout fluido com a classe `.grade`: uma coluna no celular, duas ou três conforme a largura (cards de no mínimo 20rem). Nada rola para os lados.

## Moldura responsiva

| Largura | Navegação | Espaço reservado |
| --- | --- | --- |
| até 767px | barra de vidro flutuante embaixo | `--nav-baixo` 92px |
| 768px+ ou celular deitado | trilho estreito na lateral | `--nav-lado` 108px |
| 1200px+ (altura acima de 540px) | trilho largo com nomes | `--nav-lado` 276px |

No celular o cabeçalho é uma barra de vidro presa no topo; a partir de 768px vira só um título grande.

## Movimento

- Curva `--suave` `cubic-bezier(0.22, 1, 0.36, 1)`: desacelera no fim, sem quicar.
- Durações: `--rapido` 160ms (toque, foco) · `--medio` 280ms (cores, interruptor, toast) · `--lento` 520ms (entrada de tela, viajante da navegação).
- Cada tela entra subindo 10px (`entrar`). Painéis que abrem crescem a partir do botão (`brotar`). Botões encolhem para 97% ao toque.
- `prefers-reduced-motion` ou o interruptor "Menos animações" (`data-movimento="reduzido"`) desligam **toda** animação e transição.

## Iconografia

- **Tabler Icons** (`@tabler/icons-react`), traço 2, 20 a 24px, cor herdada do texto.
- Ícone é desenho: sempre `aria-hidden` e sempre ao lado de um texto. Botão só com ícone leva `aria-label`.
- Ícones das telas: Mapa `IconMap`, Rotas `IconRoute`, Reportar `IconMessageReport`, Locais `IconMapPin`, Trilha IA `IconSchool`, Perfil `IconUserCircle`, Sobre `IconInfoCircle`, Assistente `IconMessageChatbot`.
- Ícones das faixas são caracteres de texto (✓ ! ✕ ?), dentro do BadgeFaixa.

## Marca

A marca é o **símbolo internacional de acessibilidade** redesenhado em SVG (componente `FiguraPessoa`), com o nome C.E.L.I.A. escrito ao lado em Lexend 600. No claro: fundo branco, traço preto, bolinhas #49C8F5, como o original. No escuro: fundo azul-noite e traço claro. Os arquivos estão no grupo **Logos**. Um logo próprio do projeto ainda não foi decidido pela equipe.

## Acessibilidade (checklist de toda tela)

- Contraste AA nos dois temas (texto 4,5:1, bordas de controle e ícones 3:1). O nome das telas sobre vidro foi testado com foto branca e linha viva do mapa passando por trás.
- Toque mínimo de 48px. Campos com 16px de texto ou mais.
- Foco sempre visível: anel de 3px em `focus` com 3px de afastamento. "Pular para o conteúdo" é o primeiro item do teclado.
- Ao trocar de tela, o foco vai para o `h1` e o título vai para a aba do navegador.
- Leitor de tela: `aria-current="page"` na navegação, `aria-live` no toast, `role="status"` no carregando, `role="alert"` no erro, lista como alternativa ao mapa.
- Modo de cores forçadas do Windows: vidro, cards, botões e pílulas ganham borda `CanvasText`.

## Voz e texto

- Fale com a pessoa ("Avise um problema", "Compare os caminhos"), em frases curtas e linguagem simples.
- Nomes fixos: **Acessível · Atenção · Evite · Sem dados**. Status de reporte: aberto, enviado, resolvido.
- Erros dizem o que aconteceu e o que fazer. A IA fora do ar nunca aparece como erro cru: "A análise por IA roda na demonstração local. Veja o vídeo no README."
- Dados simulados são avisados na tela ("faixa de exemplo simulada").

## Mapa

MapLibre com tiles do OpenFreeMap e estilos próprios (`celia-mapa-claro.json`, `celia-mapa-escuro.json`), mais o modo satélite (Esri World Imagery). Trechos desenhados abaixo dos nomes das ruas, com o padrão de linha de cada faixa; detalhes no componente **TrechoNoMapa**. Crédito sempre visível: "OpenFreeMap © OpenMapTiles Data from OpenStreetMap".

## O que mudou em relação ao handoff de 12/11

- Fonte: Atkinson Hyperlegible saiu, entrou **Lexend**.
- Azul: o `#2257D6` saiu; a identidade passou ao azul do símbolo `#49C8F5`, com `#0A72A8` para texto no claro.
- Navegação: a barra inferior de abas virou o **grafo** (barra de vidro no celular, trilho na lateral em telas largas).
- Superfícies: entraram o vidro, o FundoGrafo e o modo Mais contraste.
- Texto: tamanhos fixos em px viraram rem, com ajuste de tamanho no Perfil.
- Marcadores de faixa: de quadrados viraram bolinhas.
- Continuam: o semáforo e suas regras, o toque de 48px, a direção sem gradiente em botões, sem botão 3D e sem pedra portuguesa.

## Tokens

Valores exatos de `src/styles/tokens.css` na branch do João. As cores translúcidas estão em `rgba()`; no código elas são `color-mix()` com o mesmo resultado.

### Cores

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--bg` | `#f4f7fd` | `#0b1530` | Fundo de todas as telas (branco azulado no claro, azul-noite no escuro). É o chão onde o FundoGrafo desenha as manchas de luz. |
| `--card` | `#ffffff` | `#13204a` | Cor cheia de cards, campos e trilho do interruptor. As versões translúcidas (vidro, cartao) partem desta cor. |
| `--ink` | `#0f1b3d` | `#e8eefc` | Texto principal e contorno das bolinhas do grafo. Também é o fundo do Aviso (toast) e do botão grafite. |
| `--muted` | `#4a5878` | `#a9b6d6` | Texto secundário: dicas de campo, apoio, nome da medida. Passa 4,5:1 sobre bg e card nos dois temas. Nunca em cima do vidro da navegação. |
| `--line-soft` | `#e1e7f3` | `#22305a` | Divisórias entre linhas de lista (radio, interruptor). Decorativa. |
| `--line-strong` | `#c9d4ea` | `#33447a` | Borda de cards cheios e a linha que liga as bolinhas do Carregando. |
| `--linha` | `#d3dcef` | `#2b3b6c` | Borda fina de pílulas e listas. |
| `--borda-campo` | `#7d8baa` | `#7383b3` | Borda de campos e do trilho do interruptor (3:1 contra o fundo). Também é a ligação do PassosLigados e o contorno tracejado do estado Vazio. |
| `--primary` | `#49c8f5` | `#49c8f5` | O azul do símbolo internacional de acessibilidade, igual nos dois temas. Usado como FUNDO (botão primário, bolinha ativa, pílula selecionada), sempre com on-primary em cima. Nunca como cor de texto no claro. |
| `--on-primary` | `#0f1b3d` | `#0b1530` | Texto e ícone sobre primary (8,7:1 no claro). |
| `--link` | `#0a72a8` | `#49c8f5` | Texto azul: links, ação em texto, botão secundário (5,3:1 sobre bg no claro). No claro é um tom mais escuro do azul do símbolo. |
| `--focus` | `#0a72a8` | `#49c8f5` | Anel de foco de 3px com 3px de afastamento, em todo elemento focável. |
| `--head` | `#ffffff` | `#0b1530` | Fundo do cabeçalho quando ele não está em vidro. |
| `--on-head` | `#0f1b3d` | `#e8eefc` | Texto do cabeçalho. |
| `--simbolo-fundo` | `#ffffff` | `#13204a` | Fundo do círculo do símbolo de acessibilidade (FiguraPessoa). |
| `--simbolo-traco` | `#000000` | `#e8eefc` | Traço do símbolo: preto como o original no claro, claro no escuro. |
| `--vidro` | `rgba(255, 255, 255, 0.70)` | `rgba(19, 32, 74, 0.66)` | Vidro leve (card a 70% / 66%) com desfoque. Só peças pequenas que flutuam, como botões sobre o mapa. No código é color-mix(card, transparent). |
| `--vidro-forte` | `rgba(255, 255, 255, 0.88)` | `rgba(19, 32, 74, 0.88)` | Vidro de painel com texto (88%): o texto mantém AA mesmo sobre o mapa. Cabeçalho, botão-ícone, pílula de vidro. |
| `--cartao` | `rgba(255, 255, 255, 0.80)` | `rgba(19, 32, 74, 0.76)` | Card de lista: translúcido SEM desfoque, porque muitos desfoques na mesma tela pesam no celular. |
| `--vidro-borda` | `rgba(255, 255, 255, 0.80)` | `rgba(255, 255, 255, 0.11)` | Fio claro na borda das peças de vidro, como a quina de um vidro. |
| `--veu` | `rgba(244, 247, 253, 0.76)` | `rgba(11, 21, 48, 0.76)` | Véu atrás do menu em tela cheia (MenuGrafo). |
| `--nav-vidro-topo` | `rgba(255, 255, 255, 0.34)` | `rgba(19, 32, 74, 0.46)` | Parte de cima da barra de navegação do celular, atrás das bolinhas (mais transparente). |
| `--nav-vidro-base` | `rgba(255, 255, 255, 0.58)` | `rgba(19, 32, 74, 0.76)` | Parte de baixo da barra, atrás dos nomes: mais cheia, garante AA mesmo com foto escura passando por trás. |
| `--nav-vidro-trilho` | `rgba(255, 255, 255, 0.44)` | `rgba(19, 32, 74, 0.74)` | Vidro do trilho lateral (tablet e computador), igual de cima a baixo. |
| `--nav-bolinha` | `rgba(255, 255, 255, 0.55)` | `rgba(19, 32, 74, 0.55)` | Bolinha fosca de cada tela na navegação. Deixa ver o viajante azul por baixo. |
| `--nav-borda` | `rgba(255, 255, 255, 0.90)` | `rgba(255, 255, 255, 0.20)` | Borda da barra e do trilho de navegação. |
| `--nav-brilho` | `rgba(255, 255, 255, 0.55)` | `rgba(255, 255, 255, 0.10)` | Reflexo de luz no canto de cima da navegação. |
| `--nav-traco` | `rgba(15, 27, 61, 0.26)` | `rgba(232, 238, 252, 0.32)` | Contorno das bolinhas da navegação e a LIGAÇÃO entre elas (ink a 26% / 32%). |
| `--nav-realce` | `rgba(73, 200, 245, 0.22)` | `rgba(73, 200, 245, 0.14)` | Faixa suave atrás da tela atual no trilho largo do computador. |
| `--faixa-normal` | `#1e8e3e` | `#5bd08a` | Faixa Acessível (✓, linha contínua). Semáforo: SÓ em marcadores de faixa e linhas do mapa. |
| `--faixa-atencao` | `#b26a00` | `#f2b84b` | Faixa Atenção (!, tracejado longo). Só em marcadores de faixa e linhas do mapa. |
| `--faixa-perigo` | `#c62828` | `#ff7a7a` | Faixa Evite (✕, tracejado curto). Só em marcadores de faixa e linhas do mapa. Erro de formulário NÃO usa esta cor. |
| `--faixa-sem-dados` | `#6b717b` | `#a0a6b0` | Sem dados (?, pontilhado, contorno tracejado sem preenchimento). Poste sem leitura há mais de 10 minutos. |
| `--faixa-icone` | `#ffffff` | `#0b1530` | Ícone (✓ ! ✕) dentro do marcador de faixa. |

### Texto (Lexend)

| Estilo | Tamanho | Linha | Peso | Uso |
| --- | --- | --- | --- | --- |
| `titulo-g` | 2.375rem | 1.2 | 600 | Título da tela em tablet e computador. No código é clamp(1.625rem, 1.3rem + 1.5vw, 2.375rem): cresce de 26 a 38px com a largura. |
| `titulo-m` | 1.5rem | 1.15 | 600 | Título da tela no cabeçalho de vidro do celular. |
| `titulo-p` | 1.25rem | 1.2 | 600 | Título de card, título do estado Vazio, nome C.E.L.I.A. no trilho largo. |
| `medida-valor` | 1.75rem | 1 | 600 | Valor grande de uma medida do poste (temperatura, umidade, distância livre). |
| `texto-g` | 1.125rem | 1.5 | 400 | Introdução da tela (.intro, até 60ch, em muted) e nome da faixa ao lado do marcador (em 600). |
| `texto-m` | 1rem | 1.5 | 400 | Texto corrido. É também o mínimo para campos (16px evita o zoom automático do iPhone). |
| `texto-p` | 0.875rem | 1.5 | 400 | O menor texto do app: apoio, dica de campo, detalhe da medida. |
| `botao` | 1.0625rem | 1.2 | 600 | Rótulo de botão (17px). |
| `nav-rotulo` | 0.8125rem | 1.15 | 500 | Nome da tela na barra do celular. Único texto com teto (min(0.8125rem, 14px)), porque seis nomes dividem a largura. Fica 600 na tela atual. |

### Espaços

O código escreve os espaços direto em px. Esta escala reúne os valores que se repetem nos componentes.

| Token | Valor | Uso |
| --- | --- | --- |
| `espaco-1` | 4px | Folga entre a bolinha da navegação e a linha que sai dela. |
| `espaco-2` | 8px | Gap entre pílulas e entre ícone e texto no botão. |
| `espaco-3` | 12px | Gap do cabeçalho e do interruptor (ícone, nome, trilho). |
| `espaco-4` | 16px | Padding do card, gutter lateral e gap entre blocos no celular. |
| `espaco-5` | 20px | Gap entre blocos a partir de 768px; padding lateral do botão. |
| `espaco-7` | 28px | Gutter lateral no tablet. |
| `espaco-10` | 40px | Gutter lateral no computador (1200px+). |

### Raios

Quanto maior a peça, maior o raio. Toda bolinha do grafo é círculo (50%).

| Token | Valor | Uso |
| --- | --- | --- |
| `raio-p` | 12px | Selos e peças pequenas. |
| `raio-campo` | 14px | Campos de formulário (escrito direto no .campo__entrada). |
| `raio` | 20px | Cards, toast, faixa de realce do trilho. |
| `raio-g` | 28px | Painéis, gaveta e a barra de navegação. |
| `raio-botao` | 999px | Botões e pílulas. |

### Tamanhos fixos

Medidas fixas de acessibilidade e da moldura do app.

| Token | Valor | Uso |
| --- | --- | --- |
| `toque` | 48px | Área mínima de toque de qualquer controle (dedo, punho, ponteira). |
| `campo-altura` | 52px | Altura mínima de campo de texto. |
| `nav-lado-tablet` | 108px | Largura reservada para o trilho estreito (768px+ ou celular deitado). |
| `nav-lado-computador` | 276px | Largura reservada para o trilho largo (1200px+ e altura acima de 540px). |
| `conteudo-max` | 76rem | Largura máxima do conteúdo das telas. |

### Sombras

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--sombra` | `0 1px 2px rgba(15, 27, 61, 0.05), 0 8px 24px rgba(15, 27, 61, 0.07)` | `0 8px 24px rgba(0, 0, 0, 0.25)` | Cards de lista e botão-ícone. No escuro quase some: a peça se separa pela cor e pela borda. |
| `--sombra-flutuante` | `0 2px 6px rgba(15, 27, 61, 0.08), 0 14px 34px rgba(15, 27, 61, 0.14)` | `0 14px 34px rgba(0, 0, 0, 0.5)` | Peças que flutuam: navegação, pílula de vidro, toast. |
| `--sombra-gaveta` | `0 -4px 20px rgba(15, 27, 61, 0.12)` | `0 -4px 20px rgba(0, 0, 0, 0.45)` | Gaveta que sobe de baixo no mapa. |

### Movimento

| Token | Valor |
| --- | --- |
| `--suave` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--rapido` | 160ms |
| `--medio` | 280ms |
| `--lento` | 520ms |
| `--desfoque` | `blur(22px) saturate(170%)` |
| `--nav-desfoque` | `blur(26px) saturate(160%)` |

## Componentes

Cada componente com as regras de uso. O CSS de todos está em `src/styles/componentes.css` e em `src/components/<Nome>.css`.

### Botao

Botão em pílula com altura mínima de 48px, em três pesos: primário, secundário e grafite.

#### Variações
- `.botao.botao--primario`: fundo `primary` com texto `on-primary` e uma sombra azul suave. **No máximo um por tela.** É a ação que a pessoa veio fazer ("Enviar reporte").
- `.botao.botao--secundario`: fundo `card` a 85%, texto e borda `link`. Para a segunda ação.
- `.botao.botao--grafite`: fundo `ink`, texto `bg`. Ação forte e destrutiva sem cor de semáforo ("Sim, excluir"). O vermelho fica reservado para a faixa Evite.
- `.botao--pequeno`: 8px 16px e texto de 16px, para botões dentro de card.
- `.botao--seta`: texto à esquerda e ícone à direita, para ações que levam a outra tela.
- `.acao-texto`: parece link e é botão (sublinhado, cor `link`). Para "Cancelar" e ações leves.

#### Regras
- Toque: `min-height: var(--toque)`. Rótulo no estilo `botao` (17px, 600).
- Ao tocar, o botão encolhe para 97% em `--rapido` (160ms). Nada de botão 3D nem gradiente.
- `:disabled` fica com 60% de opacidade e cursor de espera: é usado enquanto uma chamada está em andamento.
- Ícones do Tabler com `aria-hidden`, sempre junto de texto. Botão só com ícone é o `BotaoIcone`.

#### O que quem usa fornece
O texto da ação no infinitivo ou imperativo curto e, se precisar, um ícone de 20 a 22px.

### BotaoIcone

Botão redondo só com ícone (voltar, meu local, fechar): uma "bolinha" do grafo em vidro forte.

- 48 × 48 (`--toque`), círculo, fundo `vidro-forte` com `--desfoque`, borda `vidro-borda`, `sombra`.
- Hover: a borda vira `link`. Toque: encolhe para 94%.
- **Sempre** com `aria-label` ("Voltar", "Meu local"), porque não há texto visível.
- Ícone do Tabler de 24px, traço 2, cor `ink`.
- Use em cima do mapa e no cabeçalho. Para ações com texto, use `Botao`.

### Pilula

Pílula de filtro e botão flutuante do mapa, com estado selecionado que não depende só da cor.

- `.filtros` agrupa as pílulas e **quebra linha** em vez de rolar para o lado.
- `.pilula`: fundo `cartao`, borda 1,5px `linha`, texto 16px peso 500, altura 48px.
- Selecionada (`aria-pressed="true"`): fundo `primary`, texto `on-primary`, **contorno de 2px em `ink`** e peso 600. O contorno e o peso garantem a diferença sem depender do azul.
- `.pilula--vidro`: vidro forte com desfoque e `sombra-flutuante`, para flutuar sobre o mapa ("Satélite", "Legenda").
- Use `aria-pressed` (botão de alternar) e dê ao grupo um `aria-label`.

### Campo

Campo de formulário com rótulo, dica e erro sem vermelho, mais o radio desenhado como bolinha.

#### Campo
- `.campo` empilha `.campo__rotulo` (16px, 600), `.campo__dica` (14px, `muted`) e `.campo__entrada`.
- Entrada: altura mínima 52px, borda 1,5px `borda-campo` (3:1), raio 14px, fundo `card`, **texto de 16px** (evita o zoom do iPhone). No foco a borda vira `focus` e o anel de 3px aparece.
- **Erro sem vermelho:** `aria-invalid="true"` deixa a borda com 2,5px em `ink`, e o `.campo__erro` traz ícone + texto em 600. O vermelho é só da faixa Evite.
- A mensagem de erro diz o que fazer ("Escreva o que você viu"), nunca "campo inválido".

#### Radio
- `.radio` é a linha inteira (48px, divisória `line-soft`). O input fica escondido e `.radio__bolinha` desenha o círculo de 26px com borda `borda-campo`.
- Marcado: borda `link` e um ponto de 12px que cresce em `--medio`.
- O foco do teclado aparece na bolinha.

### Interruptor

Liga/desliga (`role="switch"`) com o estado escrito ao lado, usado nos ajustes do Perfil.

- Grade de três colunas: ícone · nome e estado · trilho. O nome nunca é espremido, nem com letra grande.
- `.interruptor__estado` escreve "Ligado" ou "Desligado": o estado não depende da posição nem da cor.
- Trilho 56 × 32 com borda `borda-campo`; bolinha de 22px em `muted`.
- Ligado: trilho `primary` com contorno `ink`, bolinha `on-primary` deslizando 24px em `--medio`.
- Quem usa fornece `Icone`, `rotulo`, `ligado` e `aoAlternar`.
- No app: Modo escuro, Mais contraste, Menos animações, Texto maior.

### BadgeFaixa

Marcador de faixa do semáforo: uma bolinha colorida com ícone, sempre acompanhada do nome escrito.

| Faixa | Token | Ícone | Linha no mapa |
| --- | --- | --- | --- |
| Acessível | `faixa-normal` | ✓ | contínua |
| Atenção | `faixa-atencao` | ! | tracejado longo |
| Evite | `faixa-perigo` | ✕ | tracejado curto |
| Sem dados | `faixa-sem-dados` | ? | pontilhado, contorno tracejado sem preenchimento |

#### Regras
- **Cor + ícone + nome**, sempre os três. `comNome` escreve o nome ao lado; sem ele, o nome precisa estar no texto vizinho.
- O marcador tem `aria-hidden` para o leitor de tela não ler o nome duas vezes.
- Tamanhos: 28, 32, 36, 40 ou 56px. O ícone ocupa 55% do tamanho, em `faixa-icone`.
- O motivo vem junto do nome com um ponto médio: "Evite · calor", "Atenção · calçada estreita". Acessível e Sem dados aparecem sem motivo.
- Nomes e ícones vêm de `src/domain/faixas.js` (ids internos `normal`, `atencao`, `perigo`, `semDados`). A cor vem do field5 do ThingSpeak, sem recalcular.
- As cores do semáforo **só** aparecem aqui e nas linhas do mapa.

### TrechoNoMapa

Como cada faixa é desenhada como linha no mapa (MapLibre, em `CamadasTrechos.jsx`).

- Linha principal de 5,5px na cor da faixa, com um brilho largo da própria cor por baixo (16px, opacidade 0,16 no claro e 0,22 no escuro, desfoque 1).
- Padrão da linha por faixa, para não depender da cor: Acessível contínua; Atenção `line-dasharray [2.6, 1.1]`; Evite `[1.1, 1.1]`; Sem dados 4px pontilhado `[0.01, 2.2]`.
- Selos ! e ✕ no meio dos trechos em Atenção e Evite: bolinha na cor da faixa com contorno de 2,5px.
- As camadas ficam **abaixo de `highway-name-minor`**, para os nomes das ruas aparecerem por cima.
- O MapLibre não lê CSS: as cores vêm de `CORES_MAPA` em `src/domain/faixas.js`, com os mesmos valores dos tokens `faixa-*` de cada tema.
- Rota escolhida: brilho de 14px a 35% em `#0A72A8` (claro) ou `#49C8F5` (escuro, e no satélite).
- Estilos do mapa: `celia-mapa-claro.json`, `celia-mapa-escuro.json` e o satélite (Esri World Imagery com só as camadas de texto do escuro por cima). O crédito "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" aparece sempre; no satélite, o da Esri também.
- Reportes **não** mudam a cor dos trechos. Os trechos sem poste mostram faixa simulada, avisada na tela do trecho.

### Cartao

As três superfícies do app: cartão, vidro e vidro forte. Todas deixam ver o FundoGrafo por trás.

| Classe | Fundo | Desfoque | Quando usar |
| --- | --- | --- | --- |
| `.cartao` | `cartao` (80% / 76%) | não | Cards de lista: reportes, rotas, locais, medidas. Padding 16px, raio `raio`, `sombra`. |
| `.vidro` | `vidro` (70% / 66%) | `--desfoque` (22px) | Peças pequenas que flutuam. `sombra-flutuante`. |
| `.vidro.vidro--forte` | `vidro-forte` (88%) | sim | Painéis com texto: cabeçalho, gaveta, legenda. Mantém AA sobre o mapa. |

#### Regras
- O desfoque pesa no celular: **lista nunca usa vidro**, usa `.cartao`.
- Toda superfície tem o fio `vidro-borda`, como a quina de um vidro.
- Em **Mais contraste** (`data-contraste="alto"`), em `prefers-reduced-transparency` ou `prefers-contrast: more`, as três viram `card` cheio, sem desfoque, com borda `borda-campo`.
- No modo de cores forçadas do Windows, ganham borda `CanvasText`.

### Medida

Uma leitura do poste num cartão pequeno: ícone e nome em cima, valor grande, detalhe opcional.

- Props: `Icone` (Tabler), `nome` ("Temperatura"), `texto` (valor com unidade, "32 °C") e `detalhe` opcional (o que o valor quer dizer).
- Nome em 14px 600 `muted`; valor no estilo `medida-valor` (28px, 600, linha 1); detalhe em 14px `muted`.
- Unidades reais do poste: °C (temperatura e índice de calor), % (umidade), cm (distância livre do HC-SR04).
- Calor: Normal abaixo de 32 °C, Atenção a partir de 32, Perigo a partir de 41 (limite em validação).
- Valores fora da faixa possível são descartados antes de chegar aqui. Sem leitura há mais de 10 minutos, a tela mostra "Sem dados".

### Estados

Os estados que toda tela precisa ter: carregando, espera da IA, erro e vazio.

- **Carregando:** três bolinhas ligadas por uma linha `line-strong`, acendendo em `primary` uma depois da outra (1,2s). `role="status"`.
- **CardCarregando:** para chamadas demoradas à IA (foto, descrição, assistente). Título diz o que está acontecendo ("Analisando a foto"); `linhas` desenha linhas de texto se formando quando a IA está escrevendo.
- **MensagemErro:** card com `role="alert"`, ícone e mensagem amigável, mais "Tentar de novo" (botão secundário pequeno). Nunca mostrar erro cru da API. Plano B da IA: "A análise por IA roda na demonstração local. Veja o vídeo no README." e o reporte segue como "Não analisada".
- **Vazio:** bolinha tracejada de 64px (um ponto do grafo que ainda não existe), título em `titulo-p` e um texto que diz como o primeiro item aparece.
- Com menos movimento, as bolinhas e as linhas ficam paradas e o texto continua avisando.

### Aviso

Toast: pílula escura que sobe logo acima da navegação e confirma o que acabou de acontecer.

- Fundo `ink`, texto `bg` em 16px 600, raio `raio`, `sombra-flutuante`, ícone de 22px.
- Posição: centralizado na área de conteúdo (desconta o trilho lateral), 14px acima da barra no celular e a 24px do rodapé em telas largas. Sobe em `--medio`.
- Uma região `aria-live="polite"` fica sempre na página, então o leitor de tela anuncia a mensagem. A pílula visível tem `aria-hidden`.
- Texto no passado, curto e específico: "Reporte enviado.", "Reporte excluído." Nada de "Sucesso!".

### PassosLigados

Uma sequência de passos desenhada como grafo em linha: bolinhas numeradas ligadas por um traço.

- Use só quando a ordem é informação (como funciona, etapas de um envio). Para listas sem ordem, use cards.
- Bolinha de 40px em `primary` com contorno 2,5px `ink` e número em `on-primary`, igual às bolinhas do símbolo.
- A ligação é um traço de 2px em `borda-campo`, que sai de baixo de uma bolinha e chega na próxima.
- Celular: em pé. A partir de 900px: deitado, lado a lado.
- É uma `<ol>`: o leitor de tela já anuncia a ordem, e o número visível tem `aria-hidden`.
- Prop: `passos`, lista de `{ titulo, texto }`.

### NavGrafo

A navegação principal desenhada como grafo: cada tela é uma bolinha, uma linha liga todas, e o "viajante" azul desliza até a tela atual.

#### A ideia
O símbolo internacional de acessibilidade é um grafo: cabeça, duas mãos e dois pés ligados por linhas. Cada parte do app é um ponto dele.

| Ponto | Tela | Apoio (trilho largo) |
| --- | --- | --- |
| cabeça | Mapa | Como estão as calçadas agora |
| mão esquerda | Rotas | Compare os caminhos |
| mão direita | Reportar | Avise um problema |
| pé esquerdo | Locais | Banheiros e descanso |
| meio do corpo | Trilha IA | Aprenda IA para o trabalho |
| pé direito | Perfil | Ajustes e acessibilidade |

Assistente e Sobre ficam **fora** do símbolo: embaixo do trilho, com bolinha de contorno tracejado, e no menu.

#### Três formatos
1. **Celular:** barra de vidro flutuando a 10px do rodapé, até 30rem de largura, raio `raio-g`. Bolinhas de 36 a 42px lado a lado, nome embaixo (`nav-rotulo`).
2. **Tablet (768px+) ou celular deitado:** trilho estreito de 108px na lateral, símbolo no topo (abre o menu), bolinhas espalhadas pela altura toda.
3. **Computador (1200px+):** trilho largo de 276px, nome ao lado da bolinha, frase de apoio quando sobra altura, faixa `nav-realce` atrás da tela atual.

#### O vidro da navegação
Quatro camadas: fundo translúcido (`nav-vidro-topo` para `nav-vidro-base` no celular, `nav-vidro-trilho` no trilho), `--nav-desfoque` (26px), borda `nav-borda` com reflexo `nav-brilho` e `sombra-flutuante`. Sem suporte a desfoque, vira `vidro-forte`.

#### Tela atual
A bolinha fica transparente e deixa ver o viajante: círculo `primary` com contorno 2,5px `ink` e um halo de 5px. O nome fica em 600 e o link tem `aria-current="page"`. O viajante desliza em `--lento` (520ms).

#### Regras
- Nomes sempre em `ink` (o cinza perderia contraste sobre vidro). Nome nunca quebra linha.
- A ligação é um traço de 2px em `nav-traco` que vai de borda a borda, sem passar por trás das bolinhas.
- O conteúdo reserva o espaço da navegação com `--nav-baixo` e `--nav-lado`.

### Cabecalho

Topo de cada tela: voltar (opcional), título e o símbolo que abre o menu.

- **Celular:** barra de vidro presa no topo (`position: sticky`), 64px, só com a borda de baixo. O conteúdo passa desfocado por trás ao rolar. Título em `titulo-m`.
- **768px+:** sem barra. O título fica grande e solto (`titulo-g`, de 26 a 38px), alinhado com o conteúdo; o símbolo já está no trilho lateral.
- O `h1` tem `tabIndex={-1}` e recebe o foco ao trocar de tela, para o leitor de tela anunciar onde a pessoa chegou. O título também vai para a aba do navegador.
- Props: `titulo`, `voltar` (mostra o BotaoIcone) e `aoVoltar` (sem ele, volta para a tela anterior).

### FundoGrafo

Fundo decorativo das telas: o próprio símbolo de acessibilidade, bem grande e bem suave.

- SVG fixo atrás do app (`z-index: -1`, sem toque), em `xMidYMid slice` para cobrir qualquer tela.
- As cinco bolinhas viram manchas de luz `primary` em gradiente radial, com força `--fundo-brilho` (0,42 no claro, 0,3 no escuro).
- O círculo, os braços e as pernas são traços de 1,5px em `ink` com opacidade `--fundo-traco` (0,07 / 0,1), sempre finos em qualquer tamanho.
- É o que aparece desfocado atrás das peças de vidro: sem ele, o vidro fica sem graça.
- Só enfeite: `aria-hidden`, e some em Mais contraste e em `prefers-reduced-transparency`.

## Limites desta versão

- O CSS do mapa (`Mapa.css`), das telas (`pages/*.css`) e dos componentes MenuGrafo, CardRota, CardReporte, CardLocal, CardLicao, CardDescricaoIa, FotoComCaixas, EtapaFoto, Legenda, BuscaLugar, Opcoes, SeletorLocal, HistoricoPoste e MiniMapa ficaram de fora desta primeira versão.
- `color-mix()` não é aceito nos tokens: as cores translúcidas foram convertidas para `rgba()` com o mesmo resultado.
- No app o tema é trocado por `data-tema="claro|escuro"` no `<html>`; aqui os temas se chamam `light` e `dark`.
