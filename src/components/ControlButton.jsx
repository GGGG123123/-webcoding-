export function ControlButton({
  active = false,
  icon: Icon,
  label,
  onClick,
  status,
}) {
  return (
    <button
      aria-pressed={active}
      className={`control-button ${active ? 'is-active' : ''}`}
      type="button"
      onClick={onClick}
    >
      {Icon ? <Icon aria-hidden="true" size={17} strokeWidth={1.8} /> : null}
      <span>
        <strong>{label}</strong>
        {status ? <small>{status}</small> : null}
      </span>
    </button>
  )
}
