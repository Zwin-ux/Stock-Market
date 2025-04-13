import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const fetchStockData = async (symbol: string, period: string = '1d') => {
  try {
    const response = await axios.get(`${API_BASE}/stock/${symbol}`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const generateSummary = async (text: string) => {
  try {
    const response = await axios.post(`${API_BASE}/meme-summary`, {
      text,
      vibe: 'professional'
    });
    return response.data;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

export const runSimulation = async (scenario: string) => {
  try {
    const response = await axios.post(`${API_BASE}/simulate`, {
      scenario
    });
    return response.data;
  } catch (error) {
    console.error('Error running simulation:', error);
    throw error;
  }
};

// Add new service functions
export const getFinancialNews = async (ticker: string): Promise<any> => {
  const response = await axios.get(`${API_BASE}/news/${ticker}`);
  return response.data;
};

export const updatePortfolio = async (userId: string, holdings: Record<string, number>): Promise<any> => {
  const response = await axios.post(`${API_BASE}/portfolio/${userId}`, holdings);
  return response.data;
};

export const getPortfolioPerformance = async (userId: string): Promise<any> => {
  const response = await axios.get(`${API_BASE}/portfolio/${userId}/performance`);
  return response.data;
};

// Add technical indicators function
export const getTechnicalIndicators = async (ticker: string): Promise<any> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Use mock data in development
      const mockIndicators = await import('./mockData');
      return mockIndicators;
    }
    
    const response = await axios.get(`${API_BASE}/indicators/${ticker}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching technical indicators:', error);
    throw error;
  }
};

export const getSentimentAnalysis = async (ticker: string) => {
  try {
    const response = await axios.get(`${API_BASE}/sentiment/${ticker}`);
    return {
      score: response.data.score,
      positive: response.data.positive,
      negative: response.data.negative,
      neutral: response.data.neutral
    };
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    return { score: 0, positive: 0, negative: 0, neutral: 0 };
  }
};

export const getMLPrediction = async (ticker: string) => {
  try {
    const response = await axios.get(`${API_BASE}/predict/${ticker}`);
    return {
      score: response.data.score, // 0-100 confidence
      direction: response.data.direction, // 'up'/'down'
      timeframe: response.data.timeframe, // 'short'/'medium'/'long'
      reasoning: response.data.reasoning // ML model's explanation
    };
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return { 
      score: 50, 
      direction: 'neutral', 
      timeframe: 'medium',
      reasoning: 'Insufficient data for prediction'
    };
  }
};
