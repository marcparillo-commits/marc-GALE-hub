import { useState, useEffect } from 'react'
import NewsCard from './NewsCard.jsx'
import { clients } from '../data/clients.js'

const SIGNALS = [
  { id: 'cmo', label: '👤 CMO Changes', query: 'new chief marketing officer appointed CMO hired 2025' },
  { id: 'budget', label: '💰 Budget Signals', query: 'marketing budget increase advertising spend 2025' },
  { id: 'launch', label: '🚀 Product Launches', query: 'new product launch campaign brand 2025' },
  { id: 'expansion', label: '🌍 Market Expansion', query: 'market expansion new market entry growth 2025' },
  { id: 'agency', label: '🏆 Agency Reviews', query: 'agency review RFP pitch marketing account 2025' },
]

export default function OpportunityRadar() {
  const [activeSignal, setActiveSignal] = useState(SIGNALS[0])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      setArticles([])
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(activeSignal.query)}`)
        if (res.ok) {
          const data = await res.json()
          setArticles((data.articles || []).slice(0, 10))
        }
      } catch {}
      setLoading(false)
    }
    fetch_()
  }, [activeSignal.id])

  return (
    <div>
      <div className="section-header">
        <div className="page-title">Opportunity Radar</div>
        <div className="page-subtitle">Signals that indicate pitch opportunities, budget availability, and new business potential.</div>
      </div>

      <div className="filter-bar" style={{marginBottom:20}}>
        {SIGNALS.map(s => (
          <div key={s.id} className={`filter-chip ${activeSignal.id===s.id?'active':''}`} onClick={() => setActiveSignal(s)}>
            {s.label}
          </div>
        ))}
      </div>

      <div className="two-col" style={{marginBottom:20}}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎯 Your Clients in the News</span>
          </div>
          <div style={{fontSize:13,color:'var(--text-secondary)'}}>
            {clients.map(c => (
              <div key={c.id} style={{padding:'8px 0', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10}}>
                <div className="client-avatar" style={{background:c.color, width:28, height:28, fontSize:11, borderRadius:6}}>{c.logo}</div>
                <div>
                  <span style={{fontWeight:500,fontSize:13}}>{c.name}</span>
                  <span style={{marginLeft:8,fontSize:11,color:'var(--text-muted)'}}>{c.industry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">📋 Signal Types</span>
          </div>
          {SIGNALS.map(s => (
            <div key={s.id}
              className="opportunity-item"
              style={{cursor:'pointer', borderColor: activeSignal.id===s.id ? 'var(--accent)' : 'var(--warning)'}}
              onClick={() => setActiveSignal(s)}
            >
              <div className="opp-title">{s.label}</div>
              <div className="opp-meta">Click to load live signal news</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"/><span>Scanning for {activeSignal.label}...</span></div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{activeSignal.label} — Live Feed</span>
            <span className="badge badge-orange">{articles.length} signals</span>
          </div>
          <div className="news-list">
            {articles.length > 0
              ? articles.map((a, i) => <NewsCard key={i} article={a} tag="Signal" />)
              : <div className="empty-state">No signals found. Add your NewsAPI key to enable live data.</div>
            }
          </div>
        </div>
      )}
    </div>
  )
}
