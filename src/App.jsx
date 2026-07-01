import { useState, useEffect } from 'react'
import GreetingScreen from './components/GreetingScreen.jsx'
import MainApp from './components/MainApp.jsx'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [theme, setTheme]     = useState('sakura')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return entered
    ? <MainApp theme={theme} setTheme={setTheme} />
    : <GreetingScreen onEnter={() => setEntered(true)} theme={theme} setTheme={setTheme} />
}
