import {
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Fan,
  Grid2X2,
  Home,
  Music2,
  Navigation,
  Phone,
  Settings,
  Volume2,
} from 'lucide-react'

const dockItems = [
  { label: '首页', icon: Home },
  { label: '应用', icon: Grid2X2 },
  { label: '用户', icon: CircleUserRound },
  { label: '导航', icon: Navigation },
  { label: '设置', icon: Settings },
]

export function BottomDock() {
  return (
    <footer className="bottom-dock" aria-label="车机快捷控制栏">
      <div className="dock-shortcuts">
        {dockItems.map(({ icon: Icon, label }) => (
          <button className="dock-button" key={label} type="button" aria-label={label}>
            <Icon size={19} strokeWidth={2.1} />
          </button>
        ))}
      </div>

      <div className="temperature-strip" aria-label="温度控制">
        <button className="temp-button" type="button" aria-label="降低左侧温度">
          <ChevronLeft size={15} />
        </button>
        <span>26°C</span>
        <button className="temp-button" type="button" aria-label="升高左侧温度">
          <ChevronRight size={15} />
        </button>
        <Fan className="fan-icon" size={21} />
        <button className="temp-button" type="button" aria-label="降低右侧温度">
          <ChevronLeft size={15} />
        </button>
        <span>26°C</span>
        <button className="temp-button" type="button" aria-label="升高右侧温度">
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="media-zone">
        <button className="dock-button" type="button" aria-label="音量">
          <Volume2 size={19} />
        </button>
        <button className="dock-button" type="button" aria-label="电话">
          <Phone size={18} />
        </button>
        <div className="music-card" aria-label="当前音乐">
          <div className="album-art">
            <Music2 size={16} />
          </div>
          <div>
            <strong>whataya want me</strong>
            <span>Calvin Harris</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
