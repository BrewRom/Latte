import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [count, setCount] = useState(100)

  useEffect(() => {
    window.electronAPI.onControllerInput((_data) => {
      setCount((c) => c - 1)
    })
  }, [])

  return <></>
}

export default App
