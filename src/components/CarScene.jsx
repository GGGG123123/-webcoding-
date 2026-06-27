import { SceneCanvas } from './SceneCanvas.jsx'

export function CarScene({
  carState,
  compact = false,
  onDoorToggle,
  onWindowToggle,
}) {
  return (
    <section className={`car-scene ${compact ? 'is-compact' : ''}`} aria-label="3D 车模展示">
      <SceneCanvas
        carState={carState}
        compact={compact}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
      <p className="orbit-hint">拖动鼠标旋转视角 · 滚轮缩放 · 右键平移</p>
    </section>
  )
}
