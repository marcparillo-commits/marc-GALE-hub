import { useState, useEffect } from 'react'
import NewsCard from './NewsCard.jsx'

const FEEDS = [
  { name: 'Ad Age', url: 'https://adage.com/rss/feed' },
  { name: 'Digiday', url: 'https://digiday.com/feed/' },
  { name: 'Marketing Dive', url: 'https://www.marketingdive.com/feeds/news/' },
  { name: 'The Drum', url: 'https://www.thedrum.com/rss' },
]

const TOPICS = ['All', 'AI', 'Privacy', 'Creator Economy', 'Retail Media', 'Social Media', 'Agency News']

export default function MarketingTrends() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFeed, setActiveFeed] = useState('All')
  const [activeTopic, setActiveTopic] = useState('All')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      let all = []
      await Promise.all(
        FEEDS.map(async (feed) => {
          try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=10`)
            if (res.ok) {
              const data = await res.json()
              const items = (data.items || []).map(item => ({ ...item, feedName: feed.name }))
              all = all.concat(items)
            }
          } catch {}
        })
      )
      all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      setArticles(all)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const topicFilter = (a) => {
    if (activeTopic === 'All') return true
    const text = (a.title + ' ' + (a.description || '')).toLowerCase()
    const map = {
      'AI': ['ai', 'artificial intelligence', 'generative', 'chatgpt', 'llm'],
      'Privacy': ['privacy', 'cookie', 'gdpr', 'data', 'tracking'],
      'Creator Economy': ['creator', 'influencer', 'tiktok', 'youtube', 'ugc'],
      'Retail Media': ['retail media', 'amazon', 'walmart connect', 'commerce media'],
      'Social Media': ['social media', 'instagram', 'facebook', 'twitter', 'x.com', 'linkedin'],
      'Agency News': ['agency', 'holding company', 'wpp', 'publicis', 'omnicom', 'interpublic']
    }
    return (map[activeTopic] || []).some(kw => text.includes(kw))
  }

  const filtered = articles
    .filter(a => activeFeed === 'All' || a.feedName === activeFeed)
    .filter(topicFilter)

  return (
    <div>
      <div className="section-header">
        <div className="page-title">Marketing Industry Trends</div>
        <div className="page-subtitle">Curated news from Ad Age, Digiday, Marketing Dive, The Drum and more.</div>
      </div>

      <div style={{marginBottom: 12}}>
        <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>SOURCE</div>
        <div className="filter-bar">
          {['All', ...FEEDS.map(f=>f.name)].map(f => (
            <div key={f} className={`filter-chip ${activeFeed===f?'active':''}`} onClick={() => setActiveFeed(f)}>{f}</div>
          ))}
        </div>
      </div>

      <div style={{marginBottom: 16}}>
        <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>TOPIC</div>
        <div className="filter-bar">
          {TOPICS.map(t => (
            <div key={t} className={`filter-chip ${activeTopic===t?'active':''}`} onClick={() => setActiveTopic(t)}>{t}</div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"/><span>Loading industry news...</span></div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Latest Stories</span>
            <span className="badge badge-green">{filtered.length} articles</span>
          </div>
          <div className="news-list">
            {filtered.length > 0
              ? filtered.map((a, i) => <NewsCard key={i} article={a} tag={a.feedName} />)
              : <div className="empty-state">No articles found for this filter.</div>
            }
          </div>
        </div>
      )}
    </div>
  )
}
