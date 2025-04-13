import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/newsApi';
import './NewsFeed.css';

type Article = {
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
};

type NewsFeedProps = {
  ticker: string;
};

const NewsFeed: React.FC<NewsFeedProps> = ({ ticker }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await fetchNews(ticker);
      setArticles(news);
    } catch (err) {
      setError('Failed to load news. Showing cached data if available.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [ticker]);

  if (loading) {
    return <div className="news-loading">Loading {ticker} news...</div>;
  }

  if (error) {
    return (
      <div className="news-error">
        {error}
        <button onClick={loadNews} className="refresh-btn">
          Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="news-empty">
        No news found for {ticker}.
        <button onClick={loadNews} className="refresh-btn">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <div className="news-header-container">
        <h3 className="news-header">Latest {ticker.toUpperCase()} News</h3>
        <button onClick={loadNews} className="refresh-btn">
          ↻ Refresh
        </button>
      </div>
      <div className="news-articles">
        {articles.map((article, index) => (
          <div 
            key={index} 
            className={`news-article ${article.sentiment}`}
          >
            <div className="news-title">{article.title}</div>
            <div className="news-meta">
              <span className="news-source">{article.source}</span>
              <span className="news-timestamp">{article.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
