import { useState, useEffect } from 'react'
import NewsCard from './NewsCard.jsx'

const VERTICALS = [
  { id: 'healthcare', label: '🏥 Healthcare / Fintech', query: 'healthcare technology HSA digital health fintech 2025' },
  { id: 'insurance', label: '🐾 Pet Insurance', query: 'pet insurance market 2025' },
  { id: 'hospitality', label: '🏨 Hospitality', query: 'hotel industry hospitality travel 2025' },
  { id: 'automotive', label: '🚗 Autonomous Vehicles', query: 'autonomous vehicle self-driving technology 2025' },
  { id: 'food', label: '🍔 Food & Beverage', query: 'fast casual restaurant food beverage industry 2025' },
]

export default function VerticalIntelligence() {
  const [active, setActive] = useState(VERTICALS[0])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      setArticles([])
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(active.query)}`)
        if (res.ok) {
          const data = await res.json()
          setArticles((data.articles || []).slice(0, 12))
        }
      } catch {}
      setLoading(false)
    }
    fetch_()
  }, [active.id])

  return (
    <div>
      <div className="section-header">
        <div className="page-title">Vertical Intelligence</div>
        <div className="page-subtitle">Industry news filtered by your client verticals.</div>
      </div>

      <div className="filter-bar" style={{marginBottom:20}}>
        {VERTICALS.map(v => (
          <div key={v.id} className={`filter-chip ${active.id===v.id?'active':''}`} onClick={() => setActive(v)}>
            {v.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"/><span>Loading {active.label} news...</span></div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{active.label}</span>
            <span className="badge badge-blue">{articles.length} stories</span>
          </div>
          <div className="news-list">
            {articles.length > 0
              ? articles.map((a, i) => <NewsCard key={i} article={a} />)
              : <div className="empty-state">No stories found. Add your NewsAPI key for live results.</div>
            }
          </div>
        </div>
      )}
    </div>
  )
}
