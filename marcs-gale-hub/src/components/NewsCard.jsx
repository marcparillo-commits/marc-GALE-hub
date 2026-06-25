export default function NewsCard({ article, tag }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : article.pubDate
    ? new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  const title = article.title || article.description || 'No title'
  const url = article.url || article.link || '#'
  const source = article.source?.name || article.creator?.[0] || article.feedName || 'News'

  return (
    <div className="news-item">
      <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
      <div className="news-meta">
        <span className="news-source">{source}</span>
        {date && <span>{date}</span>}
        {tag && <span className="news-tag">{tag}</span>}
      </div>
    </div>
  )
}
