import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Line // Added missing import
} from 'recharts';
import { 
  getTechnicalIndicators, 
  getSentimentAnalysis,
  getMLPrediction 
} from '../services/api.ts';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

type Indicator = {
  name: string;
  value: number;
  interpretation: string;
  color: string;
  description: string;
};

type ChartData = {
  date: string;
  close: number;
  upperBand?: number;
  lowerBand?: number;
  rsi?: number;
  macd?: number;
};

type Prediction = {
  score: number;
  direction: string;
  timeframe: string;
  reasoning: string;
};

export default function TechnicalAnalysis({ ticker }: { ticker: string }) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [sentiment, setSentiment] = useState<number>(0);
  const [activeIndicators, setActiveIndicators] = useState<{[key: string]: boolean}>({
    bollinger: true,
    rsi: true,
    macd: true
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [techData, sentimentData, predictionData] = await Promise.all([
        getTechnicalIndicators(ticker),
        getSentimentAnalysis(ticker),
        getMLPrediction(ticker)
      ]);
      
      setChartData(techData.historical.map((d: any) => ({
        date: d.date,
        close: d.close,
        upperBand: d.upperBand,
        lowerBand: d.lowerBand,
        rsi: d.rsi,
        macd: d.macd
      })));

      setIndicators([
        {
          name: 'RSI',
          value: techData.rsi,
          interpretation: techData.rsi > 70 ? 'Overbought' : techData.rsi < 30 ? 'Oversold' : 'Neutral',
          color: techData.rsi > 70 ? '#f44336' : techData.rsi < 30 ? '#4caf50' : '#2196f3',
          description: 'Measures speed/change of price movements (30-70 range)'
        },
        {
          name: 'MACD',
          value: techData.macd,
          interpretation: techData.macd > 0 ? 'Bullish' : 'Bearish',
          color: techData.macd > 0 ? '#4caf50' : '#f44336',
          description: 'Trend-following momentum indicator showing relationship between two moving averages'
        },
        {
          name: 'Sentiment',
          value: sentimentData.score,
          interpretation: sentimentData.score > 0.5 ? 'Positive' : sentimentData.score < -0.5 ? 'Negative' : 'Neutral',
          color: sentimentData.score > 0.5 ? '#4caf50' : sentimentData.score < -0.5 ? '#f44336' : '#2196f3',
          description: 'Aggregated sentiment from recent news/articles about this stock'
        }
      ]);

      setSentiment(sentimentData.score);
      setPrediction(predictionData);
    };

    loadData();
  }, [ticker]);

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
    localStorage.setItem(`activeIndicators`, JSON.stringify(activeIndicators));
  };

  const SentimentGauge = ({ score }: { score: number }) => {
    const gaugeWidth = useMotionValue(50);
    const color = useTransform(
      gaugeWidth,
      [0, 50, 100],
      ['#ff0000', '#ffff00', '#00ff00']
    );
    
    useEffect(() => {
      gaugeWidth.set(score * 100);
    }, [score]);

    return (
      <div className="sentiment-gauge">
        <motion.div 
          className="gauge-track"
          style={{ backgroundColor: color }}
          animate={{ width: `${score * 100}%` }}
          transition={{ type: 'spring', damping: 10 }}
        />
        <div className="gauge-labels">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <motion.div 
        className="custom-tooltip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h4>{label}</h4>
        <div className="tooltip-grid">
          {payload.map((entry: any) => (
            <div key={entry.name} className="tooltip-item">
              <span className="tooltip-label" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="tooltip-value">
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              </span>
              {entry.name === 'RSI' && (
                <div className="tooltip-explanation">
                  {entry.value > 70 ? 'Overbought (Consider selling)' : 
                   entry.value < 30 ? 'Oversold (Consider buying)' : 'Neutral zone'}
                </div>
              )}
              {entry.name === 'MACD' && (
                <div className="tooltip-explanation">
                  {entry.value > 0 ? 'Bullish momentum' : 'Bearish momentum'}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="technical-panel">
      <h3>Technical Analysis: {ticker}</h3>
      
      <div className="indicator-controls">
        {['bollinger', 'rsi', 'macd'].map(indicator => (
          <label key={indicator}>
            <input
              type="checkbox"
              checked={activeIndicators[indicator]}
              onChange={() => toggleIndicator(indicator)}
            />
            {indicator.charAt(0).toUpperCase() + indicator.slice(1)}
          </label>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={ticker}
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                content={<CustomTooltip />}
                contentStyle={{
                  background: 'rgba(30, 30, 40, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  padding: '12px'
                }}
              />
              
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#27ae60" 
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
              
              {activeIndicators.bollinger && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="upperBand" 
                    stroke="#9b59b6" 
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lowerBand" 
                    stroke="#3498db" 
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </>
              )}
              
              {activeIndicators.rsi && (
                <ReferenceLine 
                  y={70} 
                  stroke="#f44336" 
                  strokeDasharray="3 3"
                  label={{ value: 'RSI 70', position: 'right' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      <div className="indicator-grid">
        <AnimatePresence>
          {indicators.map(indicator => (
            <motion.div
              key={indicator.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              <div 
                className="indicator-card"
                style={{ borderLeft: `4px solid ${indicator.color}` }}
              >
                <h4>{indicator.name}</h4>
                <p className="value" style={{ color: indicator.color }}>
                  {typeof indicator.value === 'number' ? indicator.value.toFixed(2) : indicator.value}
                </p>
                <p className="interpretation">{indicator.interpretation}</p>
                <p className="description">{indicator.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="prediction-container">
        {prediction && (
          <div className="prediction-card">
            <div className="prediction-header">
              <h4>AI Trend Prediction</h4>
              <span className={`prediction-direction ${prediction.direction}`}>
                {prediction.direction.toUpperCase()}
              </span>
            </div>
            
            <div className="prediction-confidence">
              <div className="confidence-meter">
                <div 
                  className="confidence-fill"
                  style={{
                    width: `${prediction.score}%`,
                    background: prediction.direction === 'up' 
                      ? 'linear-gradient(90deg, #00e676, #00c853)'
                      : 'linear-gradient(90deg, #ff5252, #ff1744)'
                  }}
                />
              </div>
              <span>{prediction.score.toFixed(0)}% confidence</span>
            </div>
            
            <div className="prediction-meta">
              <span className="timeframe">{prediction.timeframe} term</span>
              <span className="model-info">ML Model v3.1</span>
            </div>
            
            <p className="prediction-reasoning">
              <strong>Analysis:</strong> {prediction.reasoning}
            </p>
          </div>
        )}
      </div>

      <div className="sentiment-gauge-container">
        <SentimentGauge score={sentiment} />
      </div>
    </div>
  );
}
