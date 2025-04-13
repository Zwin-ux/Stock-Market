// Mock data for development/testing
export const mockIndicators = {
  rsi: 65.32,
  macd: 1.45,
  movingAverages: {
    '50d': 145.67,
    '200d': 132.89
  }
};

export const mockNews = [
  {
    headline: 'Tech stocks rally on AI boom',
    source: 'Bloomberg',
    timestamp: new Date().toISOString(),
    sentiment: 'positive',
    memeComment: 'AI go brrrrr 🚀'
  },
  {
    headline: 'Fed signals possible rate cuts',
    source: 'CNBC',
    timestamp: new Date().toISOString(),
    sentiment: 'neutral',
    memeComment: '*inserts "wait and see" meme*'
  }
];

export const mockPortfolio = {
  totalValue: 12500,
  dailyChange: 3.2,
  positions: [
    { ticker: 'AAPL', value: 5000, change: 1.8 },
    { ticker: 'TSLA', value: 3000, change: 3.2 },
    { ticker: 'NVDA', value: 2000, change: 4.1 },
    { ticker: 'GME', value: 2500, change: 15.7 }
  ]
};

export const mockStockData = [
  {
    date: '2023-01-01',
    close: 150.25,
    volume: 1000000
  },
  {
    date: '2023-01-02',
    close: 152.50,
    volume: 1200000
  }
];

export const mockSentiment = {
  score: 0.75,
  positive: 15,
  negative: 2,
  neutral: 3
};
