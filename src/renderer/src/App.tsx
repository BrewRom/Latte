import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [count, setCount] = useState(100)

  useEffect(() => {
    window.electronAPI.onControllerInput((data) => {
      setCount((c) => c - 1)
    })
  }, [])

  return (
    <>
      <p>{count}</p>
    </>
  )
}

export default App
