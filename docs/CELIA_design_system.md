# C.E.L.I.A. · Design System

> **Cores:** mantenha a paleta da **opção 6**, que já escolhemos nesta conversa. Os tokens abaixo dizem **onde** cada cor da opção 6 entra. Não troque a paleta nem invente cores novas. As únicas cores fixas são as do semáforo (seção 2.2).

## 1. Princípios

1. **Acessível antes de bonito.** O público inclui cadeirantes, idosos e pessoas cegas (que usam leitor de tela). Toda decisão visual passa por contraste, tamanho e clareza.
2. **Acolhedor, não clínico.** O app nasce da história da Célia, avó de uma integrante. Visual amigável, cantos arredondados, linguagem simples e calorosa.
3. **O semáforo é sagrado.** Verde, amarelo e vermelho existem só para as faixas de risco. Nada mais na interface usa essas cores.
4. **Carioca.** O elemento gráfico da marca é o padrão de ondas da pedra portuguesa do calçadão de Copacabana, porque o app é sobre calçadas do Rio.

Três adjetivos: **acolhedor, confiável, carioca.**

**Referência de estilo:** o app NeuroLar (projeto pessoal de um integrante). Herdamos o clima: cards bem arredondados, sombras suaves e coloridas pela cor principal, fonte Nunito em pesos fortes, botão principal com efeito 3D. **Não** herdamos o roxo, as cores decorativas variadas nem os textos pequenos.

---

## 2. Cores

### 2.1 Papéis da paleta (preencher com a opção 6)

| Token | Papel |
|---|---|
| `--primary` | Cor principal da opção 6: botões, links, aba ativa, destaques |
| `--primary-strong` | Versão mais escura: texto sobre fundo claro, borda inferior 3D do botão, estado pressionado |
| `--primary-soft` | Versão bem clara: fundo de chips, botões secundários, faixas de destaque |
| `--accent` | Cor de destaque da opção 6, **só decorativa** (ilustração, padrão de ondas, detalhes da marca). Nunca em texto, botão ou perto do mapa |
| `--bg` | Fundo das telas |
| `--card` | Fundo dos cards |
| `--ink` | Texto principal |
| `--muted` | Texto secundário (precisa ter contraste ≥ 4,5:1 com `--bg` e `--card`) |
| `--line` | Bordas e divisórias |

Regras:
- `--primary` com texto branco por cima: contraste ≥ 4,5:1. Se a cor da opção 6 não passar, use `--primary-strong` nos botões.
- Se a opção 6 tiver verde, amarelo, laranja ou vermelho, essa cor vira **só** `--accent`, longe do mapa.

### 2.2 Semáforo (fixo, não mudar)

| Token | Faixa | Modo claro | Modo escuro | Ícone | Texto |
|---|---|---|---|---|---|
| `--ok` | Normal (risco < 40) | `#1E8E3E` | `#5BD08A` | ✓ check | "Normal" |
| `--atencao` | Atenção (40 a 69) | `#B26A00` | `#F2B84B` | ! exclamação | "Atenção" |
| `--perigo` | Perigo (≥ 70) | `#C62828` | `#FF7A7A` | ✕ xis | "Perigo" |
| `--semdados` | Sem dados | `#6B717B` | `#A0A6B0` | ? interrogação | "Sem dados" |

Cada faixa também tem uma versão `-soft` (a cor a ~12% de opacidade sobre o fundo) para fundos de badge e card.

**Regra de ouro:** uma faixa **nunca** aparece só pela cor. Sempre cor + ícone + nome escrito.

### 2.3 Modo escuro

Obrigatório (exigência de Web Development). Mesmos papéis, valores invertidos:
- `--bg` e `--card`: tons escuros derivados de `--primary` (não preto puro).
- `--ink` claro, `--muted` com contraste ≥ 4,5:1.
- `--primary` pode clarear um pouco para manter o contraste.
- Semáforo usa a coluna "modo escuro" da tabela acima.
- Sombras viram bordas sutis (`--line`).

---

## 3. Tipografia

Fonte: **Nunito** (Google Fonts), pesos 400, 600, 700, 800 e 900. Fallback: `'Segoe UI', system-ui, sans-serif`.

| Estilo | Tamanho | Peso | Uso |
|---|---|---|---|
| Display | 28 px | 900 | Título da tela inicial |
| Título 1 | 22 px | 900 | Título de tela |
| Título 2 | 18 px | 900 | Título de card, cabeçalho de seção |
| Corpo | **16 px** | 700 | Texto padrão (mínimo absoluto para corpo) |
| Secundário | 14 px | 700 | Subtítulos, metadados |
| Legenda | 13 px | 800 | Rótulos da barra inferior, legenda do mapa (único uso abaixo de 14 px) |
| Número grande | 32 px | 900 | Índice de risco, minutos da rota |

- Altura de linha: 1,4 no corpo, 1,15 em títulos.
- Nada abaixo de 13 px. O texto deve funcionar com zoom de 200% do sistema.

---

## 4. Forma, espaço e sombra

**Raios**
- Card grande: 22 px
- Botão e campo: 16 px
- Chip, badge e ícone em caixa: 12 px
- Pílula (filtros, "Ver mais"): 999 px

**Espaçamento** (base 4): 4, 8, 12, 16, 20, 24, 32. Margem lateral da tela: 18 px. Espaço entre cards: 12 px. Entre seções: 24 px.

**Sombras** (coloridas pela cor principal, como no NeuroLar)
- Card: `0 5px 16px` de `--primary` a 6% de opacidade
- Botão principal: `0 6px 16px` de `--primary` a 22%
- Elemento em destaque: `0 3px 10px` de `--primary` a 30%

---

## 5. Componentes

### Botão principal
Fundo `--primary` (gradiente suave de cima para baixo, um pouco mais claro no topo), texto branco 17 px peso 900, **borda inferior de 3 px em `--primary-strong`** (efeito 3D), raio 16 px, altura mínima 56 px, largura total. Ícone opcional à esquerda.

### Botão secundário
Fundo `--primary-soft`, texto `--primary-strong`, sem borda 3D, mesma altura.

### Botão "Ver mais" (pílula)
Fundo `--primary-soft`, texto `--primary-strong` 14 px peso 900, raio 999, com seta.

### Card
Fundo `--card`, raio 22 px, sombra de card, padding 16 px. Variante destaque: borda de 1,5 px em `--primary-soft` com fundo levemente tingido.

### Cabeçalho de seção
Título 2 com ícone à esquerda e botão "Ver mais" à direita.

### Badge de faixa
Pílula com fundo `-soft` da faixa, ícone + nome na cor da faixa, 14 px peso 900. Ex.: `✓ Normal`, `! Atenção`, `✕ Perigo`, `? Sem dados`.

### Card de trecho
Nome da rua (Título 2) + badge de faixa + três dados em linha: **largura livre** (cm), **inclinação** (graus), **índice** (0 a 100, número grande). Barra fina na lateral esquerda na cor da faixa.

### Card de rota
Dois cards lado a lado (ou empilhados no celular): "Mais curta" e "Mais acessível". Cada um mostra minutos (número grande), risco médio, pior trecho com badge. O recomendado tem borda de 2 px em `--primary` e selo "Recomendada".

### Aviso antecipado
Faixa no topo do mapa com fundo `--atencao-soft` ou `--perigo-soft`, ícone, texto 16 px ("Daqui a 2 quarteirões há um trecho em Perigo") e botão "Desviar".

### Status do dispositivo
Indicador grande com ponto colorido + texto: "Gravando", "Dados enviados", "Sem sinal (guardando para enviar depois)". Esses estados usam `--primary` e tons neutros, **não** as cores do semáforo.

### Seletor de modo
Controle segmentado com duas opções grandes: "Cadeira" e "Bengala", com ícone e descrição curta de cada uma.

### Item de reporte
Linha com ícone do problema, rua, data e status em pílula ("Aberto", "Enviado à prefeitura", "Resolvido"). Ações de editar e excluir com rótulo de texto, não só ícone.

### Campo de formulário
Rótulo sempre visível acima (nunca só placeholder), 16 px, campo com altura 52 px, borda 1,5 px `--line`, foco com anel de 3 px em `--primary`. Erro com ícone + texto.

### Barra inferior
5 abas: **Mapa, Rotas, Reportes, Dispositivo, Perfil**. Ícone 24 px + rótulo 13 px. Aba ativa em `--primary-strong` com indicador acima do ícone. Altura 78 px.

### Tela "Entre como"
Logo (espaço reservado) + frase da marca + três cards grandes com ícone em caixa, título e descrição:
- **Pessoa usuária**: ver o mapa e as rotas acessíveis
- **Voluntário**: mapear trechos com o dispositivo
- **Prefeitura**: receber relatórios dos trechos com problema

Os ícones dessas caixas usam `--primary-soft` com ícone em `--primary-strong` (não usar cores variadas por perfil).

### Gamificação do voluntário
Card no estilo "ofensiva": "38 trechos mapeados este mês" com barra de progresso em `--primary` e marcos. Sem dourado nem laranja.

---

## 6. Elemento gráfico: pedra portuguesa

Padrão de ondas inspirado no calçadão de Copacabana, desenhado em linhas ou faixas onduladas.
- Usado em: fundo da tela "Entre como", topo do perfil, splash, estados vazios ("Nenhum reporte ainda").
- Cor: `--accent` ou `--primary-soft`, em baixo contraste com o fundo, para nunca competir com o conteúdo.
- Nunca atrás de texto pequeno nem dentro do mapa.

---

## 7. Ícones

Traço arredondado de 2 px, cantos suaves, 24 px por padrão (20 px dentro de chips). Mesmo estilo em todo o app. Ícones decorativos recebem `aria-hidden`; ícones que significam algo têm rótulo de texto ao lado.

---

## 8. Acessibilidade (obrigatório)

- Contraste AA: 4,5:1 para texto, 3:1 para ícones e componentes, nos dois modos.
- Área de toque mínima: 48 x 48 px.
- Foco visível em todo elemento interativo (anel de 3 px `--primary`).
- Ordem de leitura lógica para o leitor de tela: título da tela, aviso, conteúdo principal, ações.
- Todo botão de ícone tem rótulo acessível.
- Animações curtas e suaves; respeitar "reduzir movimento".
- Linguagem simples, frases curtas, sem jargão técnico.

---

## 9. Proibido

- Verde, amarelo ou vermelho fora das faixas do semáforo.
- Faixa de risco indicada só por cor.
- Texto abaixo de 13 px (e corpo abaixo de 16 px).
- `--accent` em textos, botões ou perto do mapa.
- Placeholder no lugar de rótulo.
- Cores decorativas variadas (cada perfil, avatar ou ícone com uma cor diferente).
- Criar a logo: deixar só o espaço reservado.
