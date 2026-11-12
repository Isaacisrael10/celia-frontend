import { useState } from 'react'

/*
  Custom hook do GPS do celular (API de Geolocalização do navegador).
  - pedirLocal(): pede a permissão e devolve { lat, lng } (ou null se não der)
  - posicao: a última posição encontrada
  - erro: texto simples quando a pessoa nega ou o aparelho não tem GPS
*/
export function useLocalizacao() {
  const [posicao, setPosicao] = useState(null)
  const [erro, setErro] = useState('')
  const [buscando, setBuscando] = useState(false)

  function pedirLocal() {
    return new Promise((resolver) => {
      if (!navigator.geolocation) {
        setErro('Este aparelho não informa a localização.')
        resolver(null)
        return
      }
      setBuscando(true)
      setErro('')
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const local = { lat: p.coords.latitude, lng: p.coords.longitude }
          setPosicao(local)
          setBuscando(false)
          resolver(local)
        },
        (e) => {
          // código 1 = a pessoa não deu permissão
          setErro(e.code === 1 ? 'Sem permissão para ver sua localização.' : 'Não deu para achar sua localização.')
          setBuscando(false)
          resolver(null)
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }

  return { posicao, erro, buscando, pedirLocal }
}
