/*
  Regras do assistente do trajeto (sem React, sem fetch).

  RN06: o assistente só pode responder com os trechos e locais que o app mandou.
  Por isso o app monta aqui o "contexto": a situação dos trechos e a lista de locais.
*/
import { nomeDoTrecho } from './trechos'
import { RECURSOS } from './locais'

// Faixa do app → número do field5 do ThingSpeak (0 Acessível, 1 Atenção, 2 Evite)
const STATUS_DA_FAIXA = { normal: 0, atencao: 1, perigo: 2 }

/*
  Monta { trechos, locais } no formato do contrato.
  - trechos: os trechos com faixa e motivo (useTrechos)
  - idsDoCaminho: ids dos trechos que importam (o caminho de sempre ou as rotas)
  - locais: lista de locais.json
  Trechos sem dados ficam de fora: não há o que dizer sobre eles.
*/
export function montarContexto(trechos, idsDoCaminho, locais) {
  const doCaminho = trechos.filter((t) => idsDoCaminho.includes(t.id) && t.faixa.id in STATUS_DA_FAIXA)

  return {
    trechos: doCaminho.map((t) => ({
      id: t.id,
      nome: nomeDoTrecho(t),
      status: STATUS_DA_FAIXA[t.faixa.id],
      motivo: t.motivo,
    })),
    locais: locais.map((l) => ({
      id: l.id,
      nome: l.nome,
      tipo: l.tipo,
      // Só os recursos que têm nome (o "horario" fica de fora: ele vai no campo horario do card)
      acessibilidade: l.recursos
        .map((r) => RECURSOS[r])
        .filter(Boolean)
        .join(', '),
      endereco: l.endereco,
    })),
  }
}

// Ids dos trechos que o assistente recebe: o caminho de sempre, ou todas as rotas se não houver um
export function idsParaOAssistente(rotas, escolhida) {
  if (escolhida) return escolhida.trechos
  const todos = []
  for (const rota of rotas) {
    for (const id of rota.trechos) {
      if (!todos.includes(id)) todos.push(id)
    }
  }
  return todos
}

// Perguntas prontas para quem não sabe por onde começar
export const PERGUNTAS_PRONTAS = [
  'Meu caminho está bom para ir trabalhar hoje?',
  'Tem banheiro acessível perto do caminho?',
  'Onde posso descansar na sombra?',
]
