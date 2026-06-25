import { useState } from 'react'
import { clients, verticals } from '../data/clients.js'
import ClientCard from './ClientCard.jsx'
import StockTicker from './StockTicker.jsx'

export default function ClientPortfolio() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? clients : clients.filter(c => c.vertical === filter)

  return (
    <div>
      <div className="section-header">
        <div className="page-title">Client Portfolio</div>
        <div className="page-subtitle">Recent news, competitive intelligence, and stock performance for your book of business.</div>
      </div>

      <div className="card" style={{marginBottom: 24}}>
        <div className="card-header">
          <span className="card-title">📊 Public Client Stocks</span>
          <span className="badge badge-blue">Live</span>
        </div>
        <StockTicker />
      </div>

      <div className="filter-bar">
        {verticals.map(v => (
          <div
            key={v.id}
            className={`filter-chip ${filter===v.id?'active':''}`}
            onClick={() => setFilter(v.id)}
          >
            {v.label}
          </div>
        ))}
      </div>

      <div className="client-grid">
        {filtered.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}
