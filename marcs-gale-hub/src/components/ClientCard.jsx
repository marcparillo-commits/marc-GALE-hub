import { useState, useEffect } from 'react'
import NewsCard from './NewsCard.jsx'

export default function ClientCard({ client }) {
  const [news, setNews] = useState([])
  const [compNews, setCompNews] = useState([])
  const [tab, setTab] = useState('news')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const [r1, r2] = await Promise.all([
          fetch(`/api/news?q=${encodeURIComponent(client.newsQuery)}`),
          fetch(`/api/news?q=${encodeURIComponent(client.competitorQuery)}`)
        ])
        if (r1.ok) {
          const d = await r1.json()
          setNews((d.articles || []).slice(0, 5))
        }
        if (r2.ok) {
          const d = await r2.json()
          setCompNews((d.articles || []).slice(0, 5))
        }
      } catch {}
      setLoading(false)
    }
    fetchNews()
  }, [client.id])

  return (
    <div className="client-card">
      <div className="client-card-header">
        <div className="client-avatar" style={{ background: client.color }}>
          {client.logo}
        </div>
        <div>
          <div className="client-name">{client.name}</div>
          <div className="client-industry">{client.industry}</div>
        </div>
        {client.ticker && <span className="ticker-badge">{client.ticker}</span>}
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab==='news'?'active':''}`} onClick={()=>setTab('news')}>Client News</button>
        <button className={`tab-btn ${tab==='comp'?'active':''}`} onClick={()=>setTab('comp')}>Competitor Intel</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"/></div>
      ) : (
        <div className="news-list">
          {tab === 'news' && (
            news.length > 0
              ? news.map((a, i) => <NewsCard key={i} article={a} />)
              : <div className="empty-state">No recent news found.<br/>Add your NewsAPI key to enable live news.</div>
          )}
          {tab === 'comp' && (
            compNews.length > 0
              ? compNews.map((a, i) => <NewsCard key={i} article={a} tag="Competitor" />)
              : <div className="empty-state">No competitor news found.</div>
          )}
        </div>
      )}
    </div>
  )
}
