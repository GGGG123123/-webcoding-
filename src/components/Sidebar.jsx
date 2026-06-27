import {
  CarFront,
  CircleUserRound,
  DoorOpen,
  Fan,
  Gauge,
  Grid2X2,
  Lightbulb,
  MessageSquare,
  Mic,
  Palette,
  SlidersHorizontal,
} from 'lucide-react'

const menuItems = [
  { id: 'my-car', label: '我的爱车', icon: CarFront },
  { id: 'doors', label: '门窗', icon: DoorOpen },
  { id: 'lights', label: '灯光', icon: Lightbulb },
  { id: 'voice', label: '语音控制', icon: Mic },
  { id: 'ambient', label: '氛围灯', icon: Palette },
  { id: 'position', label: '位置调节', icon: SlidersHorizontal },
  { id: 'comfort', label: '环境舒适', icon: Fan },
  { id: 'drive', label: '驾驶', icon: Gauge },
]

export function Sidebar({ activeMenu, onMenuChange }) {
  return (
    <aside className="sidebar" aria-label="车辆功能菜单">
      <div className="sidebar-tools" aria-label="快捷入口">
        <button className="icon-button" type="button" aria-label="用户">
          <CircleUserRound size={15} />
        </button>
        <button className="icon-button" type="button" aria-label="消息">
          <MessageSquare size={15} />
        </button>
        <button className="icon-button" type="button" aria-label="应用">
          <Grid2X2 size={15} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ icon: Icon, id, label }) => (
          <button
            aria-current={activeMenu === id ? 'page' : undefined}
            className={`sidebar-item ${activeMenu === id ? 'is-active' : ''}`}
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
