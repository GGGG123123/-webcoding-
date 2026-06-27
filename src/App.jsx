import { useState } from 'react'
import './App.css'
import { CockpitScreen } from './components/CockpitScreen.jsx'
import { initialCarState } from './store/carState.js'

function App() {
  const [activeMenu, setActiveMenu] = useState('my-car')
  const [carState, setCarState] = useState(initialCarState)

  function setDoorState(doorId, isOpen) {
    setCarState((current) => ({
      ...current,
      doors: {
        ...current.doors,
        [doorId]: isOpen,
      },
    }))
  }

  function toggleDoor(doorId) {
    setCarState((current) => ({
      ...current,
      doors: {
        ...current.doors,
        [doorId]: !current.doors[doorId],
      },
    }))
  }

  function setWindowState(windowId, isOpen) {
    setCarState((current) => ({
      ...current,
      windows: {
        ...current.windows,
        [windowId]: isOpen,
      },
    }))
  }

  function toggleWindow(windowId) {
    setCarState((current) => ({
      ...current,
      windows: {
        ...current.windows,
        [windowId]: !current.windows[windowId],
      },
    }))
  }

  function setAllDoors(isOpen) {
    setCarState((current) => ({
      ...current,
      doors: Object.fromEntries(
        Object.keys(current.doors).map((doorId) => [doorId, isOpen]),
      ),
    }))
  }

  function setAllWindows(isOpen) {
    setCarState((current) => ({
      ...current,
      windows: Object.fromEntries(
        Object.keys(current.windows).map((windowId) => [windowId, isOpen]),
      ),
    }))
  }

  function setLightsState(isOpen) {
    setCarState((current) => ({
      ...current,
      lightsOn: isOpen,
    }))
  }

  function toggleLights() {
    setCarState((current) => ({
      ...current,
      lightsOn: !current.lightsOn,
    }))
  }

  return (
    <CockpitScreen
      activeMenu={activeMenu}
      carState={carState}
      onAllDoorsSet={setAllDoors}
      onAllWindowsSet={setAllWindows}
      onDoorSet={setDoorState}
      onDoorToggle={toggleDoor}
      onLightsSet={setLightsState}
      onLightsToggle={toggleLights}
      onMenuChange={setActiveMenu}
      onWindowSet={setWindowState}
      onWindowToggle={toggleWindow}
    />
  )
}

export default App
