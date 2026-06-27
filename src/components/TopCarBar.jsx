import {
  Bluetooth,
  MapPin,
  Search,
  Settings,
  SignalHigh,
  Wifi,
} from 'lucide-react'

const tabs = ['状态', '能耗', '健康']

export function TopCarBar() {
  return (
    <header className="top-car-bar" aria-label="车机顶部状态栏">
      <div className="top-left-actions">
        <button className="icon-button" type="button" aria-label="搜索">
          <Search size={16} />
        </button>
        <button className="icon-button" type="button" aria-label="车辆设置">
          <Settings size={16} />
        </button>
      </div>

      <div className="status-tabs" aria-label="车辆状态标签">
        {tabs.map((tab) => (
          <button
            className={`status-tab ${tab === '状态' ? 'is-active' : ''}`}
            key={tab}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="system-icons" aria-label="系统状态">
        <SignalHigh size={15} />
        <Wifi size={15} />
        <MapPin size={15} />
        <Bluetooth size={15} />
        <Settings size={15} />
      </div>
    </header>
  )
}
