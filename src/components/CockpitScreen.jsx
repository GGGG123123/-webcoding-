import { CarFront, Lightbulb, Power, Radio } from 'lucide-react'
import { BottomDock } from './BottomDock.jsx'
import { CarScene } from './CarScene.jsx'
import { ControlButton } from './ControlButton.jsx'
import { DoorWindowPanel } from './DoorWindowPanel.jsx'
import { DriveModeSelector } from './DriveModeSelector.jsx'
import { Sidebar } from './Sidebar.jsx'
import { TopCarBar } from './TopCarBar.jsx'
import { VoiceControlPanel } from './VoiceControlPanel.jsx'

const pageTitles = {
  ambient: '氛围灯',
  comfort: '环境舒适',
  doors: '门窗',
  drive: '驾驶',
  lights: '灯光',
  'my-car': '我的爱车',
  position: '位置调节',
  voice: '语音控制',
}

function OverviewPage({ carState, onDoorToggle, onWindowToggle }) {
  return (
    <div className="overview-page">
      <CarScene
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
      <DriveModeSelector />
    </div>
  )
}

function DoorWindowPage({ carState, onDoorSet, onDoorToggle, onWindowSet, onWindowToggle }) {
  return (
    <div className="door-window-page">
      <div className="door-window-stage">
        <CarScene
          compact
          carState={carState}
          onDoorToggle={onDoorToggle}
          onWindowToggle={onWindowToggle}
        />
      </div>
      <DoorWindowPanel
        carState={carState}
        onDoorSet={onDoorSet}
        onWindowSet={onWindowSet}
      />
    </div>
  )
}

function LightsPage({ carState, onDoorToggle, onLightsToggle, onWindowToggle }) {
  return (
    <div className="lighting-page">
      <div className="lighting-stage">
        <CarScene
          compact
          carState={carState}
          onDoorToggle={onDoorToggle}
          onWindowToggle={onWindowToggle}
        />
      </div>
      <aside className="glass-panel lighting-panel" aria-label="灯光控制">
        <div className="panel-title-row">
          <div>
            <p className="panel-kicker">Light Control</p>
            <h2>灯光控制</h2>
          </div>
          <Lightbulb size={21} />
        </div>
        <ControlButton
          active={carState.lightsOn}
          icon={Power}
          label={carState.lightsOn ? '关闭车灯' : '打开车灯'}
          status={carState.lightsOn ? '当前大灯已开启' : '当前大灯已关闭'}
          onClick={onLightsToggle}
        />
        <div className="light-effect-note">
          <Radio size={15} />
          <span>开启后显示前灯光束、灯带高亮与环境照亮效果</span>
        </div>
      </aside>
    </div>
  )
}

function VoicePage({
  carState,
  onAllDoorsSet,
  onAllWindowsSet,
  onDoorSet,
  onDoorToggle,
  onLightsSet,
  onWindowSet,
  onWindowToggle,
}) {
  return (
    <div className="voice-control-page">
      <div className="voice-stage">
        <CarScene
          compact
          carState={carState}
          onDoorToggle={onDoorToggle}
          onWindowToggle={onWindowToggle}
        />
      </div>
      <VoiceControlPanel
        carState={carState}
        onAllDoorsSet={onAllDoorsSet}
        onAllWindowsSet={onAllWindowsSet}
        onDoorSet={onDoorSet}
        onLightsSet={onLightsSet}
        onWindowSet={onWindowSet}
      />
    </div>
  )
}

function PlaceholderPage({ activeMenu, carState, onDoorToggle, onWindowToggle }) {
  return (
    <div className="overview-page">
      <div className="feature-watermark">
        <CarFront size={18} />
        <span>{pageTitles[activeMenu]} · 中控页面预留</span>
      </div>
      <CarScene
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
      <DriveModeSelector />
    </div>
  )
}

export function CockpitScreen({
  activeMenu,
  carState,
  onAllDoorsSet,
  onAllWindowsSet,
  onDoorSet,
  onDoorToggle,
  onLightsSet,
  onLightsToggle,
  onMenuChange,
  onWindowSet,
  onWindowToggle,
}) {
  let content

  if (activeMenu === 'doors') {
    content = (
      <DoorWindowPage
        carState={carState}
        onDoorSet={onDoorSet}
        onDoorToggle={onDoorToggle}
        onWindowSet={onWindowSet}
        onWindowToggle={onWindowToggle}
      />
    )
  } else if (activeMenu === 'lights') {
    content = (
      <LightsPage
        carState={carState}
        onDoorToggle={onDoorToggle}
        onLightsToggle={onLightsToggle}
        onWindowToggle={onWindowToggle}
      />
    )
  } else if (activeMenu === 'voice') {
    content = (
      <VoicePage
        carState={carState}
        onAllDoorsSet={onAllDoorsSet}
        onAllWindowsSet={onAllWindowsSet}
        onDoorSet={onDoorSet}
        onDoorToggle={onDoorToggle}
        onLightsSet={onLightsSet}
        onWindowSet={onWindowSet}
        onWindowToggle={onWindowToggle}
      />
    )
  } else if (activeMenu === 'my-car') {
    content = (
      <OverviewPage
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
    )
  } else {
    content = (
      <PlaceholderPage
        activeMenu={activeMenu}
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
    )
  }

  return (
    <main className="app-shell">
      <section className="cockpit-screen" aria-label="新能源汽车中控屏幕">
        <Sidebar activeMenu={activeMenu} onMenuChange={onMenuChange} />
        <TopCarBar />
        <section className="screen-content" aria-label={pageTitles[activeMenu]}>
          {content}
        </section>
        <BottomDock />
      </section>
    </main>
  )
}
