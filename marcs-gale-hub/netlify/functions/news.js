export default async (req, context) => {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  const apiKey = Deno.env.get('NEWS_API_KEY') || process.env.NEWS_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ articles: [], error: 'Missing NEWS_API_KEY' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&pageSize=15&language=en&apiKey=${apiKey}`
    const res = await fetch(newsUrl)
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, articles: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = { path: '/api/news' }
