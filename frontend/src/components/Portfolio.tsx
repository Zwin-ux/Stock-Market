/**
 * Portfolio management component
 * 
 * Tracks:
 * - Asset allocations
 * - Performance metrics
 * - Investment strategy
 * - Achievement system
 * 
 * @component
 * @example
 * <Portfolio />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  getPortfolioPerformance, 
  updatePortfolio,
  getTechnicalIndicators
} from '../services/api.ts';

/**
 * Investment archetype
 * @typedef {'Long-Term Chad'|'Meme Lord'|'Bear Mode'|'Crisis Creator'|'Degenerate'} Archetype
 */
type Archetype = 'Long-Term Chad' | 'Meme Lord' | 'Bear Mode' | 'Crisis Creator' | 'Degenerate';

/**
 * Investment asset
 * @typedef {Object} Asset
 * @property {string} ticker - Asset ticker symbol
 * @property {number} value - Asset value
 * @property {number} volatility - Asset volatility
 * @property {string} sector - Asset sector
 * @property {number} peRatio - Asset price-to-earnings ratio
 * @property {number} beta - Asset beta
 * @property {number} [dividendYield] - Asset dividend yield (optional)
 */
type Asset = {
  ticker: string;
  value: number;
  volatility: number;
  sector: string;
  peRatio: number;
  beta: number;
  dividendYield?: number;
};

/**
 * Investment strategy
 * @typedef {'Long-Term Growth'|'Value Investing'|'Sector Rotation'|'Risk-Adjusted'} Strategy
 */
type Strategy = 'Long-Term Growth' | 'Value Investing' | 'Sector Rotation' | 'Risk-Adjusted';

/**
 * Player achievement
 * @typedef {'Degenerate'|'Crisis Creator'|'Long-Term Chad'} Achievement
 */
type Achievement = 'Degenerate' | 'Crisis Creator' | 'Long-Term Chad';

const DEGENERACY_THRESHOLDS = {
  'Long-Term Chad': 20,
  'Meme Lord': 70,
  'Bear Mode': 30,
  'Crisis Creator': 90,
  'Degenerate': 120
};

const STRATEGY_THRESHOLDS = {
  'Long-Term Growth': { minDiversity: 8, maxTurnover: 0.2 },
  'Value Investing': { minDiversity: 5, peRatioThreshold: 15 },
  'Sector Rotation': { sectorFocus: 3 },
  'Risk-Adjusted': { sharpeRatio: 1.5 }
};

const PortfolioSimulator = () => {
  const [holdings, setHoldings] = useState<Record<string, number>>({});
  const [performance, setPerformance] = useState<any>(null);
  const [archetype, setArchetype] = useState<Archetype>('Long-Term Chad');
  const [degeneracyScore, setDegeneracyScore] = useState(0);
  const [timeTravelYear, setTimeTravelYear] = useState(new Date().getFullYear());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [crisisCount, setCrisisCount] = useState(0);
  const [strategy, setStrategy] = useState<Strategy>('Long-Term Growth');
  const [learningTips, setLearningTips] = useState<string[]>([]);

  // Calculate meme exposure and degeneracy score
  useEffect(() => {
    const memeStocks = ['GME', 'AMC', 'DOGE', 'SHIB'];
    const exposure = Object.keys(holdings)
      .filter(t => memeStocks.includes(t))
      .reduce((acc, t) => acc + (holdings[t] || 0), 0);
    
    const score = Math.min(100, Math.floor(exposure * 1.5));
    setDegeneracyScore(score);
    
    // Determine archetype based on score
    if (score >= DEGENERACY_THRESHOLDS['Crisis Creator']) {
      setArchetype('Crisis Creator');
    } else if (score >= DEGENERACY_THRESHOLDS['Degenerate']) {
      setArchetype('Degenerate');
    } else if (score >= DEGENERACY_THRESHOLDS['Meme Lord']) {
      setArchetype('Meme Lord');
    } else if (score <= DEGENERACY_THRESHOLDS['Long-Term Chad']) {
      setArchetype('Long-Term Chad');
    } else {
      setArchetype('Bear Mode');
    }
  }, [holdings]);

  // Load portfolio data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPortfolioPerformance('user123');
        setPerformance(data);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    };
    loadData();
  }, []);

  const handleAddStock = async (ticker: string, amount: number) => {
    const newHoldings = { ...holdings, [ticker]: amount };
    setHoldings(newHoldings);
    await updatePortfolio('user123', newHoldings);
  };

  const checkAchievements = useCallback(() => {
    const newAchievements: Achievement[] = [];
    if (degeneracyScore > 85 && !achievements.includes('Degenerate')) {
      newAchievements.push('Degenerate');
    }
    if (crisisCount >= 3 && !achievements.includes('Crisis Creator')) {
      newAchievements.push('Crisis Creator');
    }
    if (newAchievements.length) {
      setAchievements([...achievements, ...newAchievements]);
      
      // Show achievement animation
      newAchievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = 'achievement-popup';
        achievementEl.textContent = `🏆 Unlocked: ${achievement}`;
        document.body.appendChild(achievementEl);
        
        setTimeout(() => {
          achievementEl.remove();
        }, 3000);
      });
    }
  }, [degeneracyScore, crisisCount, achievements]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const calculateDegeneracy = (assets: Asset[]) => {
    return assets.reduce((score, asset) => {
      return score + (asset.volatility * (asset.dividendYield || 0));
    }, 0);
  };

  const calculateDiversity = (portfolio: Asset[]) => {
    const sectors = portfolio.map(asset => asset.sector);
    const uniqueSectors = [...new Set(sectors)];
    return uniqueSectors.length;
  };

  const calculateAveragePERatio = (portfolio: Asset[]) => {
    const peRatios = portfolio.map(asset => asset.peRatio);
    return peRatios.reduce((sum, ratio) => sum + ratio, 0) / peRatios.length;
  };

  const analyzeStrategy = useCallback((positions: Asset[]) => {
    // Calculate portfolio metrics
    const diversityScore = calculateDiversity(positions);
    const peRatio = calculateAveragePERatio(positions);
    
    if (diversityScore >= STRATEGY_THRESHOLDS['Long-Term Growth'].minDiversity) {
      setStrategy('Long-Term Growth');
      setLearningTips(['Consider dollar-cost averaging', 'Rebalance quarterly']);
    } else if (peRatio <= STRATEGY_THRESHOLDS['Value Investing'].peRatioThreshold) {
      setStrategy('Value Investing');
      setLearningTips(['Look for undervalued sectors', 'Check financial health metrics']);
    }
    // ... other strategy detection
  }, [setStrategy, setLearningTips]);

  useEffect(() => {
    if (performance?.positions) {
      analyzeStrategy(performance.positions);
    }
  }, [analyzeStrategy, performance]);

  return (
    <div className="portfolio-container">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="archetype-badge"
        style={{
          background: archetype === 'Meme Lord' ? '#9c27b0' : 
                    archetype === 'Crisis Creator' ? '#f44336' :
                    archetype === 'Long-Term Chad' ? '#4caf50' : 
                    archetype === 'Degenerate' ? '#ff69b4' : '#ff9800'
        }}
      >
        {archetype}
      </motion.div>
      
      <div className="stats-panel">
        <h3>Degeneracy Score: {degeneracyScore}/100</h3>
        <div className="score-bar">
          <motion.div 
            className="score-fill"
            initial={{ width: 0 }}
            animate={{ width: `${degeneracyScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        
        <div className="time-travel">
          <input 
            type="range"
            min="2000"
            max="2030"
            value={timeTravelYear}
            onChange={(e) => setTimeTravelYear(parseInt(e.target.value))}
          />
          <span>Year: {timeTravelYear}</span>
        </div>
        
        <h3>Strategy: {strategy}</h3>
        <ul>
          {learningTips.map(tip => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
      
      {performance?.positions?.map((asset: Asset) => (
        <motion.div 
          key={asset.ticker}
          className="asset-card"
          whileHover={{ scale: 1.03 }}
        >
          <h4>{asset.ticker}</h4>
          <p>Value: ${asset.value.toLocaleString()}</p>
          <p>Volatility: {asset.volatility}</p>
          <p>Sector: {asset.sector}</p>
          <p>PE Ratio: {asset.peRatio}</p>
          <p>Beta: {asset.beta}</p>
          <p>Dividend Yield: {asset.dividendYield}%</p>
          <button 
            onClick={() => handleAddStock(asset.ticker, 1000)}
            className="buy-button"
          >
            Add $1k
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default PortfolioSimulator;
