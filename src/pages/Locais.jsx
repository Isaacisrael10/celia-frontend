import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import MiniMapa from "../components/MiniMapa";
import CardLocal from "../components/CardLocal";
import { Vazio } from "../components/Estados";
import { useTema } from "../hooks/useTema";
import dados from "../data/locais.json";
import "./Locais.css";

const FILTROS = { todos: "Todos", banheiro: "Banheiros", descanso: "Descanso" };

// Posição de reserva da pessoa (a mesma do mapa: Rua Barão do Bom Retiro, Grajaú)
const VOCE = { lat: -22.9223585, lng: -43.2586232 };

export default function Locais() {
  const { escuro } = useTema();
  // Interação Web Dev: filtrar por tipo de local
  const [filtro, setFiltro] = useState("todos");

  // Mais perto primeiro
  const visiveis = dados.locais
    .filter((local) => filtro === "todos" || local.tipo === filtro)
    .sort((a, b) => a.metros - b.metros);

  return (
    <>
      <Cabecalho titulo="Locais" />
      <main className="app__conteudo app__conteudo--largo">
        <p className="locais__intro">
          Banheiros acessíveis e lugares para descansar perto do caminho.
        </p>

        {/* Filtro em pílulas */}
        <div
          className="locais__filtros"
          role="group"
          aria-label="Filtrar locais"
        >
          {Object.entries(FILTROS).map(([valor, nome]) => (
            <button
              key={valor}
              className="locais__filtro"
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {nome}
            </button>
          ))}
        </div>

        {/* No computador: mini mapa à esquerda e a lista à direita */}
        <div className="locais__corpo">
          {visiveis.length > 0 && (
            <MiniMapa locais={visiveis} voce={VOCE} escuro={escuro} />
          )}

          <p className="so-leitor" aria-live="polite">
            {visiveis.length === 1 ? "1 local" : visiveis.length + " locais"}
          </p>

          {visiveis.length === 0 && (
            <Vazio titulo="Nenhum local deste tipo por perto" />
          )}

          <ul className="locais">
            {visiveis.map((local) => (
              <CardLocal key={local.id} local={local} />
            ))}
          </ul>
        </div>

        <p className="locais__fonte">{dados.fonte}</p>
      </main>
    </>
  );
}
