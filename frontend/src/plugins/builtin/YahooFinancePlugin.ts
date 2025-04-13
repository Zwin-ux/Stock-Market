import { DataPlugin } from '../PluginTypes';

const YAHOO_FINANCE_API = 'https://yfapi.net';

export class YahooFinancePlugin implements DataPlugin {
  id = 'yahoo-finance';
  name = 'Yahoo Finance';
  description = 'Fetch stock/crypto data from Yahoo Finance API';
  version = '1.0.0';
  
  canFetchStockData = true;
  canFetchCryptoData = true;
  canFetchEconomicData = false;
  
  private apiKey: string = '';
  
  async initialize(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }
  
  async fetchStockData(symbol: string, period: string) {
    const endpoint = `${YAHOO_FINANCE_API}/v8/finance/chart/${symbol}?range=${period}`;
    const response = await fetch(endpoint, {
      headers: { 'x-api-key': this.apiKey }
    });
    
    if (!response.ok) throw new Error('Failed to fetch stock data');
    return response.json();
  }
  
  async fetchCryptoData(symbol: string, period: string) {
    return this.fetchStockData(`${symbol}-USD`, period);
  }
  
  registerCommands() {
    return [
      {
        command: '/price {ticker}',
        description: 'Get current price for stock/crypto',
        handler: async (ticker: string) => {
          const data = await this.fetchStockData(ticker, '1d');
          return `Current price: $${data.chart.result[0].meta.regularMarketPrice}`;
        }
      },
      {
        command: '/trend {ticker} {period}',
        description: 'Get price trend (1d, 1w, 1m)',
        handler: async (ticker: string, period: string) => {
          await this.fetchStockData(ticker, period);
          return `Trend data for ${ticker} (${period})`;
        }
      },
      {
        command: '/news {ticker}',
        description: 'Get recent news for ticker',
        handler: async (ticker: string) => {
          const endpoint = `${YAHOO_FINANCE_API}/v1/finance/news?symbol=${ticker}`;
          const response = await fetch(endpoint, {
            headers: { 'x-api-key': this.apiKey }
          });
          return response.json();
        }
      }
    ];
  }
}
