/**
 * Market simulation game component
 * 
 * Simulates stock trading with:
 * - Real-time price fluctuations
 * - Historical market scenarios
 * - Portfolio management
 * - Event tracking
 * 
 * @component
 * @example
 * <MarketMadness />
 */

import React, { useState, useEffect } from 'react';
import './MarketMadness.css';

/**
 * Stock asset interface
 * @interface
 */
interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  trend: number[];
  volatility: number;
}

/**
 * Historical market event
 * @interface
 */
interface HistoricalEvent {
  year: number;
  name: string;
  description: string;
  impact: (stocks: Stock[]) => Stock[];
}

const HISTORICAL_SCENARIOS: HistoricalEvent[] = [
  {
    year: 1929,
    name: "Black Tuesday",
    description: "The Wall Street Crash of 1929 begins",
    impact: (stocks) => stocks.map(stock => ({
      ...stock,
      price: stock.price * (0.6 + Math.random() * 0.2),
      change: -30 - Math.random() * 20
    }))
  },
  {
    year: 1987,
    name: "Black Monday",
    description: "Largest one-day percentage decline in stock market history",
    impact: (stocks) => stocks.map(stock => ({
      ...stock,
      price: stock.price * (0.7 + Math.random() * 0.15),
      change: -22 - Math.random() * 15
    }))
  },
  {
    year: 2000,
    name: "Dot-com Bubble",
    description: "Tech stocks crash after speculative bubble",
    impact: (stocks) => stocks.map(stock => ({
      ...stock,
      price: stock.name.includes('Tech') ? 
        stock.price * (0.3 + Math.random() * 0.3) :
        stock.price * (0.8 + Math.random() * 0.2),
      change: stock.name.includes('Tech') ? 
        -70 - Math.random() * 20 :
        -20 - Math.random() * 15
    }))
  },
  {
    year: 2008,
    name: "Financial Crisis",
    description: "Lehman Brothers collapse triggers global crisis",
    impact: (stocks) => stocks.map(stock => ({
      ...stock,
      price: stock.price * (0.5 + Math.random() * 0.3),
      change: -40 - Math.random() * 20
    }))
  },
  {
    year: 2020,
    name: "COVID Crash",
    description: "Global pandemic shocks markets",
    impact: (stocks) => stocks.map(stock => ({
      ...stock,
      price: stock.price * (0.6 + Math.random() * 0.4),
      change: -30 + Math.random() * 40 // Some stocks actually went up!
    }))
  }
];

interface Portfolio {
  [symbol: string]: number;
}

const MarketMadness = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [events, setEvents] = useState<string[]>([]);
  const [currentScenario, setCurrentScenario] = useState<HistoricalEvent|null>(null);
  const [scenarioActive, setScenarioActive] = useState(false);

  // Initialize game
  useEffect(() => {
    generateStocks();
    const timer = setInterval(() => {
      setGameTime(t => t + 1);
      updateMarket();
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const generateStocks = () => {
    const funnyNames = [
      'MemeStonks', 'DogeCoin', 'BananaTech', 
      'UberForX', 'BlockchainWater', 'AI-Pets'
    ];
    
    const newStocks = funnyNames.map(name => ({
      symbol: name.substring(0, 4).toUpperCase(),
      name,
      price: Math.random() * 100 + 50,
      change: 0,
      trend: Array(10).fill(0).map(() => Math.random() * 100 + 50),
      volatility: Math.random() * 2 + 0.5
    }));
    
    setStocks(newStocks);
  };

  const updateMarket = () => {
    setStocks(prevStocks => {
      return prevStocks.map(stock => {
        // Random price movement based on volatility
        const change = (Math.random() - 0.5) * stock.volatility * 2;
        const newPrice = stock.price * (1 + change / 100);
        
        // Update trend data
        const newTrend = [...stock.trend.slice(1), newPrice];
        
        return {
          ...stock,
          price: newPrice,
          change,
          trend: newTrend
        };
      });
    });
    
    // Add random market events
    if (Math.random() > 0.8) {
      const events = [
        "Rumors of alien technology boost tech stocks",
        "Banana shortage affects food sector",
        "Meme stocks trending on social media",
        "Investors panic over nothing in particular"
      ];
      setEvents(prev => [events[Math.floor(Math.random() * events.length)], ...prev.slice(0, 4)]);
    }
  };

  const triggerHistoricalScenario = (event: HistoricalEvent) => {
    setCurrentScenario(event);
    setScenarioActive(true);
    setStocks(event.impact(stocks));
    setEvents(prev => [event.description, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setScenarioActive(false);
    }, 10000); // Scenario lasts 10 seconds
  };

  const handleTrade = (symbol: string, isBuy: boolean) => {
    const sharesInput = document.querySelector(`.stock-card .symbol:contains('${symbol}')`)
      ?.closest('.stock-card')
      ?.querySelector('.shares-input') as HTMLInputElement;
      
    const shares = sharesInput ? parseInt(sharesInput.value) || 1 : 1;
    const stock = stocks.find(s => s.symbol === symbol);
    
    if (!stock) return;
    
    if (isBuy) {
      const cost = stock.price * shares;
      if (cost > balance) {
        setEvents(prev => [`Not enough funds to buy ${shares} shares of ${symbol}`, ...prev.slice(0, 4)]);
        return;
      }
      
      setBalance(prev => prev - cost);
      setPortfolio(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + shares
      }));
      setEvents(prev => [`Bought ${shares} shares of ${symbol} at $${stock.price.toFixed(2)}`, ...prev.slice(0, 4)]);
    } else {
      if (!portfolio[symbol] || portfolio[symbol] < shares) {
        setEvents(prev => [`Not enough shares of ${symbol} to sell`, ...prev.slice(0, 4)]);
        return;
      }
      
      const earnings = stock.price * shares;
      setBalance(prev => prev + earnings);
      setPortfolio(prev => ({
        ...prev,
        [symbol]: prev[symbol] - shares
      }));
      setEvents(prev => [`Sold ${shares} shares of ${symbol} at $${stock.price.toFixed(2)}`, ...prev.slice(0, 4)]);
    }
  };

  const calculatePortfolioValue = () => {
    return Object.entries<number>(portfolio).reduce((total, [symbol, shares]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      return total + (stock ? stock.price * shares : 0);
    }, 0);
  };

  const PortfolioSummary = () => (
    <div className="portfolio-summary">
      <h3>Your Portfolio</h3>
      <div className="portfolio-value">
        Total Value: ${(balance + calculatePortfolioValue()).toFixed(2)}
      </div>
      <div className="holdings">
        {Object.entries<number>(portfolio)
          .filter(([_, shares]) => shares > 0)
          .map(([symbol, shares]) => {
            const stock = stocks.find(s => s.symbol === symbol);
            return (
              <div key={symbol} className="holding">
                {symbol}: {shares} @ ${stock?.price.toFixed(2)}
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="market-madness">
      <h2>Market Madness Mode</h2>
      <div className="game-stats">
        <span>Time: {gameTime}</span>
        <span>Balance: ${balance.toFixed(2)}</span>
      </div>
      
      <div className="scenario-controls">
        <h3>Historical Events</h3>
        <div className="scenario-buttons">
          {HISTORICAL_SCENARIOS.map((scenario, i) => (
            <button 
              key={i}
              onClick={() => triggerHistoricalScenario(scenario)}
              disabled={scenarioActive}
              className="scenario-button"
            >
              {scenario.year}: {scenario.name}
            </button>
          ))}
        </div>
      </div>
      
      {currentScenario && (
        <div className="active-scenario">
          <h4>{currentScenario.year}: {currentScenario.name}</h4>
          <p>{currentScenario.description}</p>
        </div>
      )}
      
      <div className="stocks-grid">
        {stocks.map((stock, i) => (
          <div key={i} className={`stock-card ${stock.change >= 0 ? 'up' : 'down'}`}>
            <div className="stock-header">
              <span className="symbol">{stock.symbol}</span>
              <span className="name">{stock.name}</span>
            </div>
            <div className="stock-price">
              ${stock.price.toFixed(2)}
              <span className="change">
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </span>
            </div>
            <div className="stock-trend">
              {stock.trend.map((value, j) => (
                <div 
                  key={j}
                  className="trend-point"
                  style={{
                    left: `${j * 10}%`,
                    bottom: `${value - Math.min(...stock.trend)}%`
                  }}
                />
              ))}
            </div>
            <div className="stock-actions">
              <input 
                type="number" 
                min="1" 
                max="100" 
                defaultValue="1"
                className="shares-input"
              />
              <button 
                className="buy-button"
                onClick={() => handleTrade(stock.symbol, true)}
              >
                Buy
              </button>
              <button 
                className="sell-button"
                onClick={() => handleTrade(stock.symbol, false)}
                disabled={!portfolio[stock.symbol]}
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="events-log">
        <h4>Market Events</h4>
        {events.map((event, i) => (
          <div key={i} className="event">{event}</div>
        ))}
      </div>
      <PortfolioSummary />
    </div>
  );
};

export default MarketMadness;
