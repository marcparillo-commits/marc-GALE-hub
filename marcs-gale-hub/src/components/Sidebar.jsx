const navItems = [
  { id: 'clients', icon: '🏢', label: 'Client Portfolio' },
  { id: 'trends', icon: '📈', label: 'Marketing Trends' },
  { id: 'verticals', icon: '🔬', label: 'Vertical Intel' },
  { id: 'radar', icon: '🎯', label: 'Opportunity Radar' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Navigation</div>
      {navItems.map(item => (
        <div
          key={item.id}
          className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="sidebar-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </nav>
  )
}
