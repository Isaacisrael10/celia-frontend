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
