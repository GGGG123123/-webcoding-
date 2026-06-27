import { ChevronDown, ChevronUp, DoorOpen } from 'lucide-react'
import { ControlButton } from './ControlButton.jsx'

const doorControls = [
  { id: 'frontLeft', label: '左前门开', open: true },
  { id: 'frontRight', label: '右前门开', open: true },
  { id: 'frontLeft', label: '左前门关', open: false },
  { id: 'frontRight', label: '右前门关', open: false },
]

const windowControls = [
  { id: 'frontLeft', label: '左前窗开', open: true, icon: ChevronDown },
  { id: 'frontRight', label: '右前窗开', open: true, icon: ChevronDown },
  { id: 'frontLeft', label: '左前窗关', open: false, icon: ChevronUp },
  { id: 'frontRight', label: '右前窗关', open: false, icon: ChevronUp },
]

function actionStatus(currentOpen, targetOpen) {
  if (currentOpen === targetOpen) {
    return currentOpen ? '已开启' : '已关闭'
  }

  return targetOpen ? '点击开启' : '点击关闭'
}

export function DoorWindowPanel({ carState, onDoorSet, onWindowSet }) {
  return (
    <aside className="glass-panel door-window-panel" aria-label="门窗控制面板">
      <div className="panel-title-row">
        <div>
          <p className="panel-kicker">Access Control</p>
          <h2>门窗控制</h2>
        </div>
        <div className="panel-status-pill">
          前排门窗
        </div>
      </div>

      <section className="control-card-group" aria-labelledby="door-control-title">
        <div className="mini-section-title" id="door-control-title">
          车门控制
        </div>
        <div className="control-button-grid">
          {doorControls.map(({ id, label, open }) => (
            <ControlButton
              active={carState.doors[id] === open}
              icon={DoorOpen}
              key={`${id}-${label}`}
              label={label}
              status={actionStatus(carState.doors[id], open)}
              onClick={() => onDoorSet(id, open)}
            />
          ))}
        </div>
      </section>

      <section className="control-card-group" aria-labelledby="window-control-title">
        <div className="mini-section-title" id="window-control-title">
          车窗控制
        </div>
        <div className="control-button-grid">
          {windowControls.map(({ icon, id, label, open }) => (
            <ControlButton
              active={carState.windows[id] === open}
              icon={icon}
              key={`${id}-${label}`}
              label={label}
              status={actionStatus(carState.windows[id], open)}
              onClick={() => onWindowSet(id, open)}
            />
          ))}
        </div>
      </section>
    </aside>
  )
}
