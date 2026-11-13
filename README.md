# C.E.L.I.A. · Front-end

**Caminhos em Liberdade, Inclusão e Acessibilidade**
Global Solution 2026.2 (CitizenTech) · FIAP · Engenharia de Software, 1º ano · Rio de Janeiro

> Vídeo de demonstração: _(link em breve)_

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
| Normal | ✓ | contínua |
| Atenção | ! | tracejado longo |
| Perigo | ✕ | tracejado curto |
| Sem dados | ? | pontilhada |

O motivo aparece junto: "Perigo · calor", "Atenção · calçada estreita".

---

## Telas

| Tela | O que faz |
|---|---|
| **Mapa** | Mapa real e livre de ponta a ponta (busca de bairro/rua/lugar e botão "Meu local" com GPS), trechos coloridos, reportes das pessoas como marcadores, legenda e alternativa em lista para leitor de tela. Embaixo, a gaveta do **boletim do caminho de sempre** responde se dá para ir trabalhar hoje pelo caminho de sempre (livre, Atenção, Perigo ou sem dados), com o calor medido no ponto de ônibus e o alerta de calor escolhido no Perfil. |
| **Detalhe do trecho** | Faixa e motivo, medidas do poste ao vivo (distância livre, índice de calor, temperatura, umidade), últimas leituras e atalho para reportar. |
| **Rotas** | Compara 3 caminhos até o trabalho, recomenda o mais seguro (que nem sempre é o mais curto) e deixa a pessoa escolher o **caminho de sempre** (salvo no navegador, sem login). |
| **Reportar** | CRUD de reportes: lista com filtro, novo reporte com foto e IA, local escolhido num mapa com pino (abre no GPS, arrasta ou busca o endereço), editar e excluir. |
| **Locais** | Banheiros acessíveis e pontos de descanso perto do caminho, com filtro. |
| **Perfil** | Modo escuro, alerta de calor no ponto (30, 32 ou 35 °C, ou desligado), modo chuva e informações do projeto. |

_(prints das telas em breve)_

---

## O que é real e o que é simulado

| Parte | Situação |
|---|---|
| Poste `poste01` (ThingSpeak) | **Real**, lido ao vivo a cada 20 s e mostrado no boletim do caminho de sempre. Sem leitura há mais de 10 min, vira "Sem dados". O ponto de ônibus do poste no mapa ainda vai ser definido pela equipe. |
| Outros trechos do mapa | **Simulados** (faixa de exemplo em `src/data/trechos.json`). Só existe um poste. A tela do trecho avisa isso. |
| Reportes | **Reais** na MockAPI (API externa do CRUD). |
| Análise da foto (IA) | **Real** na demonstração local (API Flask do Caio em `localhost:5000`). Na versão publicada a API não está no ar: o app mostra uma mensagem e o reporte vai como "Não analisada" (plano B). |
| Rotas | **Simuladas** (3 rotas pré-definidas em `src/data/rotas.json`); o status de cada trecho vem do poste e dos dados simulados. |
| Locais | **Simulados** (`src/data/locais.json`), com a fonte real prevista indicada na tela. |
| Mapa e ruas | **Reais** (OpenStreetMap). O mapa abre no **Grajaú**, bairro dos testes e das fotos usadas para treinar a IA, mas vai para qualquer lugar pela busca ou pelo GPS. Os trechos coloridos são 39 trechos de 11 ruas reais do Grajaú. |
| Localização dos reportes | **Real**: vem do trecho de onde a pessoa reportou ou do endereço digitado (busca no Nominatim/OpenStreetMap). |

Nenhum dado pessoal real é usado.

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
| `VITE_THINGSPEAK_CHANNEL_ID` | Número do canal público do poste |
| `VITE_VISAO_URL` | API de visão (padrão `http://localhost:5000/analisar`) |

---

## Integrações

- **ThingSpeak** (leitura pública): `GET https://api.thingspeak.com/channels/{ID}/feeds.json?results=20`. Campos: temperatura, umidade, índice de calor, distância livre, status (0 verde, 1 amarelo, 2 vermelho) e motivo.
- **MockAPI** (CRUD): `GET`, `POST`, `PUT` e `DELETE` em `/reportes`.
- **API de visão** (Flask): `POST /analisar` com a foto; devolve o resultado (`livre`, `obstaculo` ou `buraco`) e as caixas, que o app desenha sobre a foto.
- **Mapa**: MapLibre GL + tiles do OpenFreeMap (gratuito, sem chave), com estilos próprios claro e escuro.
- **Busca de lugares** (Nominatim/OpenStreetMap, sem chave): leva o mapa a qualquer endereço e acha as coordenadas dos reportes. Só busca quando a pessoa confirma, como pede a regra de uso do serviço.
- **GPS do navegador** (Geolocation API): botão "Meu local".

---

## Como o código está organizado

A lógica de negócio, o acesso a dados e a apresentação ficam separados:

```
src/
  services/    acesso a dados, sem React
               reportesApi.js · thingspeak.js · visaoApi.js · miniatura.js · config.js
  domain/      regras de negócio puras (sem React, sem fetch)
               faixas.js · reportes.js · poste.js · trechos.js · rotas.js · boletim.js · visao.js
  hooks/       custom hooks: juntam serviços, regras e estado
  components/  peças visuais reutilizáveis
  pages/       as telas
  data/        dados fixos (trechos, rotas, locais)
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
| `useAnaliseFoto` | Envia a foto para a IA e cuida do plano B |
| `useTema` | Modo claro/escuro, salvo no navegador |
| `usePreferencia` | Preferência liga/desliga salva no navegador (modo chuva) |
| `useAviso` | Mensagem rápida no rodapé que some sozinha |
| `useBuscaLugar` | Busca de bairro, rua ou lugar para levar o mapa até lá |
| `useLocalizacao` | Pede o GPS do celular para o botão "Meu local" |
| `useLocalDoReporte` | Local do reporte: GPS ao abrir, pino no mapa que preenche o endereço, e busca do endereço digitado |

### Interações em JavaScript (Web Development)

1. Alternar **modo claro/escuro** (Perfil)
2. **Filtrar reportes** por situação
3. Alternar **Mapa / Lista**
4. **Filtrar locais** por tipo
5. **Inverter** origem e destino nas rotas
6. **Escolher o caminho de sempre** e ver o boletim no mapa (muda sozinho se um trecho mudar de faixa)
7. **Confirmar exclusão** de um reporte dentro do próprio card
8. **Validação** do formulário de reporte, com mensagens de erro acessíveis
9. **Buscar um lugar** e o mapa voar até ele
10. **Meu local**: centralizar o mapa no GPS
11. **Escolher o local do reporte** arrastando o mapa (o endereço se preenche sozinho)
12. **Abrir e fechar a gaveta** do boletim com os detalhes do caminho
13. **Alerta de calor**: escolher a temperatura no Perfil e o boletim avisar quando o ponto passar dela

---

## Acessibilidade

- Fonte **Atkinson Hyperlegible**, criada para pessoas com baixa visão
- Contraste AA nos dois modos; texto do corpo com 16 px ou mais
- Áreas de toque com 44 px ou mais
- Foco visível em tudo; navegação completa pelo teclado
- Rótulos para leitor de tela em botões de ícone e nos selos do mapa (sem o "Map marker" em inglês do MapLibre)
- Selos do mapa nunca ficam um em cima do outro: quando não cabem, aparece o mais grave
- **Lista** como alternativa completa ao mapa
- Animações desligadas para quem pediu menos movimento no sistema
- Verde, amarelo e vermelho reservados para as faixas; erros e status usam grafite e azul

---

## Tecnologias

React 19 · Vite · React Router · MapLibre GL (react-map-gl) · Tabler Icons · OpenFreeMap

---

## Equipe

Veja [Integrantes.md](Integrantes.md). O uso de IA está registrado em [AI.md](AI.md).
