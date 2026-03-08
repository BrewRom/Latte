import absOne from './assets/Abstract1.ogg'
import absTwo from './assets/Abstract2.ogg'
import { useEffect, useState } from 'react'

interface Config {
  background: string
}

function App(): React.JSX.Element {
  const [backgroundUrl, setBackgroundUrl] = useState<string>()
  const [count, setCount] = useState(100)
  const [mvAudio1] = useState(new Audio(absOne))
  const [mvAudio2] = useState(new Audio(absTwo))

  useEffect(() => {
    window.electronAPI.onControllerInput((_data) => {
      setCount((c) => c - 1)
      const sInt = Math.floor(Math.random() * 2)
      //@ts-ignore Audio stuff
      const s: HTMLAudioElement = sInt ? mvAudio1.cloneNode() : mvAudio2.cloneNode()
      s.play()
      s.onended = () => {
        s.remove()
      }
    })

    async function getConfig(): Promise<void> {
      const configText = await window.electronAPI.openLoadConfig()
      const config: Config = JSON.parse(configText)
      setBackgroundUrl('latte://~/' + config.background)
    }

    getConfig()
  }, [])

  const appStyle = {
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'auto',
    backgroundPosition: 'center'
  }

  return (
    <>
      <div>
        <div className="application" style={appStyle} />
        <div className="content">
          <h1>{count}</h1>
        </div>
      </div>
    </>
  )
}

export default App
