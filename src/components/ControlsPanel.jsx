import {
  Car,
  Gauge,
  Lightbulb,
  Power,
  Radio,
} from 'lucide-react'

export function ControlsPanel({
  carState,
  openDoorCount,
  openWindowCount,
  onSetAllDoors,
  onSetAllWindows,
  onToggleLights,
}) {
  return (
    <aside className="controls-panel" aria-label="vehicle controls">
      <header className="panel-header">
        <div className="panel-header-main">
          <div>
            <p className="eyebrow">Central Control</p>
            <h1>车辆控制</h1>
          </div>
          <div className="panel-icon" aria-hidden="true">
            <Car size={22} />
          </div>
        </div>
        <div className="status-grid">
          <div className="status-cell">
            <span className="stat-label">车门</span>
            <strong className="stat-value">{openDoorCount}/4</strong>
          </div>
          <div className="status-cell">
            <span className="stat-label">车窗</span>
            <strong className="stat-value">{openWindowCount}/4</strong>
          </div>
          <div className="status-cell">
            <span className="stat-label">车灯</span>
            <strong className="stat-value">
              {carState.lightsOn ? '开启' : '关闭'}
            </strong>
          </div>
        </div>
      </header>

      <section className="control-section" aria-labelledby="access-control-title">
        <div className="section-title" id="access-control-title">
          <Gauge size={16} />
          <h2>门窗</h2>
        </div>
        <div className="access-bulk-actions">
          <button
            className="ghost-button"
            type="button"
            onClick={() => onSetAllDoors(true)}
          >
            车门全开
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onSetAllDoors(false)}
          >
            车门全关
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onSetAllWindows(true)}
          >
            车窗全开
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onSetAllWindows(false)}
          >
            车窗全关
          </button>
        </div>
      </section>

      <section className="control-section" aria-labelledby="light-control-title">
        <div className="section-title" id="light-control-title">
          <Lightbulb size={16} />
          <h2>灯光</h2>
        </div>
        <button
          aria-pressed={carState.lightsOn}
          className={`light-toggle ${carState.lightsOn ? 'is-active' : ''}`}
          type="button"
          onClick={onToggleLights}
        >
          <span className="light-toggle-main">
            <Power size={18} />
            <span>
              大灯
              <small>{carState.lightsOn ? '已开启' : '已关闭'}</small>
            </span>
          </span>
          <Radio size={18} />
        </button>
      </section>
    </aside>
  )
}
