# API Documentation

## News API
```typescript
interface NewsArticle {
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * Fetches financial news for a given ticker
 * @param ticker - Stock symbol (e.g. 'AAPL')
 * @returns Promise<NewsArticle[]> 
 */
function fetchNews(ticker: string): Promise<NewsArticle[]>
```

## CLI Commands
```typescript
interface CommandResponse {
  text: string;
  data?: {
    type: 'news' | 'chart' | 'portfolio';
    // ...type-specific data
  };
}

/**
 * Processes terminal commands
 * @param input - Raw command string
 * @returns CommandResponse
 */
function handleCommand(input: string): CommandResponse
```

## Chart Data API
```typescript
interface ChartPoint {
  date: string;
  value: number;
}

/**
 * Fetches historical data for visualization
 * @param ticker - Stock symbol
 * @param range - Time range ('1d', '1w', '1m', '1y')
 * @returns Promise<ChartPoint[]> 
 */
function fetchChartData(ticker: string, range: string): Promise<ChartPoint[]>
```

## Authentication

```typescript
/**
 * API Key Requirements:
 * - Store in .env file as VITE_NEWS_API_KEY
 * - Get from https://newsapi.org
 * - Rate limit: 100 requests/day (free tier)
 */

// Example .env configuration:
VITE_NEWS_API_KEY=your_api_key_here
VITE_ALPHAVANTAGE_KEY=your_key_here  // For stock data
