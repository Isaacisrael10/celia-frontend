import { useState } from 'react'
import { IconSearch, IconMapPin } from '@tabler/icons-react'
import { useBuscaLugar } from '../hooks/useBuscaLugar'
import './BuscaLugar.css'

/*
  Campo para ir a qualquer bairro, rua ou lugar no mapa.
  - aoEscolher(lugar): recebe { nome, lat, lng, area }
*/
export default function BuscaLugar({ aoEscolher }) {
  const [texto, setTexto] = useState('')
  const { resultados, buscando, erro, buscar, limpar } = useBuscaLugar()

  function enviar(evento) {
    evento.preventDefault()
    buscar(texto)
  }

  function escolher(lugar) {
    aoEscolher(lugar)
    // Mostra só o começo do nome no campo (ex.: "Grajaú")
    setTexto(lugar.nome.split(',')[0])
    limpar()
  }

  return (
    <div className="busca-lugar">
      <form className="busca-lugar__form" onSubmit={enviar} role="search">
        <label htmlFor="busca-lugar" className="so-leitor">
          Buscar bairro, rua ou lugar
        </label>
        <input
          id="busca-lugar"
          className="campo__entrada busca-lugar__entrada"
          placeholder="Buscar bairro, rua ou lugar"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="botao botao--secundario busca-lugar__botao" disabled={buscando} aria-label="Buscar">
          <IconSearch size={22} aria-hidden="true" />
        </button>
      </form>

      <div aria-live="polite">
        {buscando && <p className="busca-lugar__info">Buscando…</p>}
        {erro && <p className="busca-lugar__info">{erro}</p>}
      </div>

      {resultados.length > 0 && (
        <ul className="busca-lugar__resultados" aria-label="Resultados da busca">
          {resultados.map((lugar) => (
            <li key={lugar.lat + ',' + lugar.lng}>
              <button className="busca-lugar__resultado" onClick={() => escolher(lugar)}>
                <IconMapPin size={20} aria-hidden="true" />
                <span>{lugar.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
