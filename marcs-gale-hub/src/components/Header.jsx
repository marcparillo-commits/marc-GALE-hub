export default function Header() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-badge">GALE</span>
        <h1>Marc's GALE Hub</h1>
      </div>
      <div className="header-right">
        <span className="header-date">{dateStr}</span>
        <button className="refresh-btn" onClick={() => window.location.reload()}>↻ Refresh</button>
      </div>
    </header>
  )
}
