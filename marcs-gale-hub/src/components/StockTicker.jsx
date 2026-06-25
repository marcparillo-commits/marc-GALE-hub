import { useEffect, useState } from 'react'

const PUBLIC_CLIENTS = [
  { name: 'HealthEquity', ticker: 'HQY' },
  { name: 'IHG Hotels', ticker: 'IHG' },
  { name: 'Cava', ticker: 'CAVA' },
  { name: 'Shake Shack', ticker: 'SHAK' },
]

export default function StockTicker() {
  const [stocks, setStocks] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStocks = async () => {
      const results = {}
      await Promise.all(
        PUBLIC_CLIENTS.map(async ({ ticker, name }) => {
          try {
            const res = await fetch(`/api/stocks?symbol=${ticker}`)
            if (res.ok) {
              const data = await res.json()
              results[ticker] = { ...data, name }
            }
          } catch {}
        })
      )
      setStocks(results)
      setLoading(false)
    }
    fetchStocks()
  }, [])

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading stocks...</span></div>

  return (
    <div>
      {PUBLIC_CLIENTS.map(({ ticker, name }) => {
        const s = stocks[ticker]
        if (!s?.quote) return (
          <div key={ticker} className="stock-row">
            <div><div className="stock-symbol">{ticker}</div><div className="stock-name">{name}</div></div>
            <span style={{fontSize:12,color:'var(--text-muted)'}}>Data unavailable — add Finnhub API key</span>
          </div>
        )
        const q = s.quote
        const change = q.dp || 0
        const isUp = change >= 0
        return (
          <div key={ticker} className="stock-row">
            <div>
              <div className="stock-symbol">{ticker}</div>
              <div className="stock-name">{name}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="stock-price">${q.c?.toFixed(2) || '—'}</div>
              <div className={`stock-change ${isUp ? 'up' : 'down'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
              </div>
            </div>
          </div>
        )
      })}
      <p style={{fontSize:11,color:'var(--text-muted)',marginTop:8}}>
        Powered by Finnhub · 15-min delayed
      </p>
    </div>
  )
}
