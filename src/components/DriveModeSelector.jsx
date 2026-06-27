import { useState } from 'react'
import { Info } from 'lucide-react'

const driveModes = ['舒适', '经济', '运动', '个性化', '雪地']

export function DriveModeSelector() {
  const [selectedMode, setSelectedMode] = useState('运动')

  return (
    <section className="drive-mode-panel" aria-labelledby="drive-mode-title">
      <div className="drive-mode-title" id="drive-mode-title">
        <span>驾驶模式</span>
        <Info size={14} strokeWidth={1.9} />
      </div>
      <div className="drive-mode-options">
        {driveModes.map((mode) => (
          <button
            aria-pressed={selectedMode === mode}
            className={`drive-mode-button ${
              selectedMode === mode ? 'is-active' : ''
            }`}
            key={mode}
            type="button"
            onClick={() => setSelectedMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
    </section>
  )
}
