import { useState } from 'react'
import GreetingScreen from './components/GreetingScreen.jsx'
import MainApp from './components/MainApp.jsx'

export default function App() {
  const [entered, setEntered] = useState(false)

  return entered
    ? <MainApp />
    : <GreetingScreen onEnter={() => setEntered(true)} />
}
