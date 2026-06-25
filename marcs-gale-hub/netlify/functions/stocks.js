export default async (req, context) => {
  const url = new URL(req.url)
  const symbol = url.searchParams.get('symbol') || ''
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ quote: null, error: 'Missing FINNHUB_API_KEY' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`)
    ])
    const quote = await quoteRes.json()
    const profile = await profileRes.json()
    return new Response(JSON.stringify({ quote, profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: '/api/stocks' }
