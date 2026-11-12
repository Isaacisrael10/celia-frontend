import { IconMoon } from '@tabler/icons-react'
import Cabecalho from '../components/Cabecalho'
import Interruptor from '../components/Interruptor'
import { useTema } from '../hooks/useTema'

export default function Perfil() {
  const { escuro, alternarTema } = useTema()

  return (
    <>
      <Cabecalho titulo="Perfil" />
      <main className="app__conteudo">
        <section aria-labelledby="titulo-ajustes">
          <h2 id="titulo-ajustes" style={{ fontSize: 22 }}>
            Ajustes
          </h2>
          {/* Interação Web Dev nº 1: alternar modo claro/escuro */}
          <Interruptor Icone={IconMoon} rotulo="Modo escuro" ligado={escuro} aoAlternar={alternarTema} />
        </section>
      </main>
    </>
  )
}
