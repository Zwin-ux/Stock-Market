const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
const newsCache = new Map<string, {timestamp: number; articles: any[]}>();

export const fetchNews = async (ticker: string) => {
  // Check cache first
  const cached = newsCache.get(ticker);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.articles;
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${ticker}&language=en&sortBy=publishedAt&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('News API returned non-ok status');
    }
    
    const articles = data.articles.map((article: any) => ({
      title: article.title,
      source: article.source.name,
      timestamp: new Date(article.publishedAt).toLocaleString(),
      sentiment: 'neutral'
    }));
    
    // Update cache
    newsCache.set(ticker, {
      timestamp: Date.now(),
      articles
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return cached data even if stale when API fails
    return cached?.articles || [];
  }
};
