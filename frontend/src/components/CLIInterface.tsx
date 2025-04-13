import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { fetchStockData, runSimulation } from '../services/api'; 
import PortfolioSimulator from './Portfolio.tsx';
import NewsFeed from './NewsFeed.tsx';
import TechnicalAnalysis from './TechnicalAnalysis.tsx';
import MiniChart from './MiniChart.tsx'; 
import { FaMicrophone, FaHistory, FaKeyboard } from 'react-icons/fa';

interface Command {
  text: string;
  isUser: boolean;
  timestamp: string;
  data?: {
    type: string;
    ticker?: string;
    [key: string]: any;
  };
}

interface CLIInterfaceProps {
  onCommand: (command: string) => void;
  commandHistory: string[];
  theme?: 'light' | 'dark' | 'matrix';
  enableAI?: boolean;
  enableVoice?: boolean;
  showTutorial?: boolean;
}

const containerStyle = {
  background: 'rgba(20, 20, 30, 0.85)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  padding: '24px',
  height: '80vh',
  maxWidth: '1000px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden'
};

const commandStyle = {
  fontFamily: '"Fira Code", monospace',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '8px 0',
  padding: '12px 16px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.03)'
};

const chartContainerStyle = {
  background: 'rgba(30, 30, 40, 0.7)',
  borderRadius: '12px',
  padding: '16px',
  margin: '16px 0',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const SimulationVisualization = ({ data }: { data: any }) => {
  if (!data?.results) return null;
  
  const chartData = data.results.map((value: number, index: number) => ({
    name: `Day ${index}`,
    value
  }));

  return (
    <div style={chartContainerStyle}>
      <h3 style={{ color: '#fff', marginBottom: '16px', fontWeight: 500 }}>
        {data.scenario}
      </h3>
      {data.visualization === 'line_chart' ? (
        <LineChart 
          width={600} 
          height={300} 
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3498db" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3498db" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#95a5a6' }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis 
            tick={{ fill: '#95a5a6' }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(30, 30, 40, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3498db" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      ) : (
        <AreaChart 
          width={600} 
          height={300} 
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#27ae60" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#27ae60" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#95a5a6' }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis 
            tick={{ fill: '#95a5a6' }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(30, 30, 40, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#27ae60" 
            fill="url(#colorArea)" 
            strokeWidth={2}
            animationDuration={1500}
          />
        </AreaChart>
      )}
    </div>
  );
};

const COMMAND_SUGGESTIONS = [
  { command: '/1d', description: '1-day chart' },
  { command: '/5d', description: '5-day chart' },
  { command: '/1w', description: '1-week chart' },
  { command: '/1m', description: '1-month chart' },
  { command: '/compare', description: 'Compare stocks' },
  { command: '/insight', description: 'Get AI-powered insights' },
  { command: '/simulate', description: 'Run portfolio simulation' },
  { command: '/battle', description: 'Compare two stocks' },
  { command: '/calendar', description: 'Economic calendar' },
  { command: '/global', description: 'Global market data' }
];

const CLIInterface: React.FC<CLIInterfaceProps> = ({ 
  onCommand, 
  commandHistory,
  theme = 'dark',
  enableAI = true,
  enableVoice = false,
  showTutorial = false
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<typeof COMMAND_SUGGESTIONS>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.includes('/') && input.split(' ').length === 2) {
        const [symbol, period] = input.split(' ');
        if (symbol && period) {
          try {
            setIsLoadingChart(true);
            const data = await fetchStockData(symbol.replace('/', ''), period.replace('/', ''));
            setChartData(data);
          } catch (error) {
            setChartData(null);
          } finally {
            setIsLoadingChart(false);
          }
        }
      } else {
        setChartData(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const updateSuggestions = useCallback((value: string) => {
    if (!value.startsWith('/')) {
      setSuggestions([]);
      return;
    }
    
    const filtered = COMMAND_SUGGESTIONS.filter(suggestion => 
      suggestion.command.includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setSelectedSuggestion(-1);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    updateSuggestions(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          Math.min(prev + 1, suggestions.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Tab' && selectedSuggestion >= 0) {
        e.preventDefault();
        setInput(suggestions[selectedSuggestion].command);
        setSuggestions([]);
      } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
        e.preventDefault();
        setInput(suggestions[selectedSuggestion].command);
        setSuggestions([]);
      }
    }
  };

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    background: 'rgba(30, 30, 40, 0.7)'
  };

  const inputStyle = {
    fontFamily: '"Fira Code", monospace',
    fontSize: '15px',
    lineHeight: '1.6',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    flex: 1
  };

  const voiceButtonStyle = {
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer'
  };

  const suggestionsStyle = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(30, 30, 40, 0.7)',
    padding: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    zIndex: 1
  };

  const suggestionItemStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  };

  const commandStyle = {
    fontFamily: '"Fira Code", monospace',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#fff'
  };

  const descriptionStyle = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#95a5a6'
  };

  return (
    <div className={`cli-interface ${theme}`}>
      <div className="header">
        <h3>Gödel Terminal</h3>
        <div className="controls">
          <button 
            className={`voice-btn ${enableVoice ? 'active' : ''}`}
            onClick={() => {}}
            disabled={!enableVoice}
          >
            <FaMicrophone />
          </button>
          <button 
            className="toggle-history"
            onClick={() => {}}
          >
            <FaHistory />
          </button>
          <button 
            className="toggle-shortcuts"
            onClick={() => {}}
          >
            <FaKeyboard />
          </button>
        </div>
      </div>
      <div style={inputContainerStyle}>
        <div className="input-prefix">❯</div>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          placeholder="Enter stock command (e.g. AAPL /1w)"
        />
        {enableVoice && (
          <button style={voiceButtonStyle}>
            <FaMicrophone />
          </button>
        )}
        {!isLoadingChart && chartData?.historical && (
          <div style={{ marginLeft: '10px' }}>
            <MiniChart 
              data={chartData.historical} 
              width={100} 
              height={40} 
              color={chartData.currentPrice > chartData.historical[0].close ? '#27ae60' : '#e74c3c'}
            />
          </div>
        )}
        {isLoadingChart && (
          <div style={{ marginLeft: '10px', color: '#95a5a6' }}>Loading chart...</div>
        )}
        {suggestions.length > 0 && (
          <div style={suggestionsStyle}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={suggestion.command}
                style={{
                  ...suggestionItemStyle,
                  background: index === selectedSuggestion ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
                onClick={() => {
                  setInput(suggestion.command);
                  setSuggestions([]);
                }}
              >
                <span style={commandStyle}>{suggestion.command}</span>
                <span style={descriptionStyle}>{suggestion.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ReactionButtons = ({ onReact }: { onReact: (emoji: string) => void }) => (
  <div className="reactions">
    {['👍', '👎', '❤️', '🚀'].map(emoji => (
      <button 
        key={emoji}
        onClick={() => onReact(emoji)}
        className="reaction-btn"
      >
        {emoji}
      </button>
    ))}
  </div>
);

const GodelCLI = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  
  const handleCommandSubmit = async () => {
    if (!input.trim()) return;
    
    const newCommand: Command = {
      text: input,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setCommands([...commands, newCommand]);
    
    try {
      let response: {
        text: string;
        data?: any;
        isUser?: boolean;
      };
      
      if (input.startsWith('portfolio')) {
        response = {
          text: 'Opening portfolio simulator',
          data: { type: 'portfolio' }
        };
      } 
      else if (input.startsWith('news')) {
        const ticker = input.split(' ')[1] || 'general';
        response = {
          text: `Fetching latest ${ticker} news...`,
          data: { 
            type: 'news', 
            ticker,
            articles: [
              {
                title: `${ticker.toUpperCase()} Company Reports Record Earnings`,
                source: 'Financial Times',
                timestamp: '2 hours ago',
                sentiment: 'positive'
              },
              {
                title: `Analysts Upgrade ${ticker.toUpperCase()} Price Target`,
                source: 'Bloomberg',
                timestamp: '5 hours ago',
                sentiment: 'neutral'
              }
            ]
          }
        };
      }
      else if (input.startsWith('ta')) {
        const ticker = input.split(' ')[1] || 'AAPL';
        const tickerValue = ticker || '';
        response = {
          text: `Technical analysis for ${tickerValue}`,
          data: { type: 'technical', ticker: tickerValue }
        };
      }
      else if (input.includes('/')) {
        const [symbol, period] = input.split('/');
        response = await fetchStockData(symbol.replace('/', ''), period.replace('/', ''));
      } 
      else {
        response = await runSimulation(input);
      }
      
      setCommands(prev => [...prev, {
        text: typeof response === 'string' ? response : response.text,
        isUser: false,
        timestamp: new Date().toISOString(),
        data: response.data
      }]);
      
    } catch (error) {
      setCommands(prev => [...prev, {
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="terminal-header">
        <h1>Gödel Terminal</h1>
        <div className="status-indicator">Connected</div>
      </div>
      
      <div className="command-history">
        <AnimatePresence>
          {commands.map((cmd) => (
            <div key={cmd.timestamp}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={commandStyle}
                className={`command ${cmd.isUser ? 'user' : 'system'}`}
                transition={{ duration: 0.2 }}
              >
                <div className="command-output">
                  <div className="output-content">{cmd.text}</div>
                  {cmd.isUser && <ReactionButtons onReact={(emoji) => console.log(emoji)} />}
                  {cmd.data?.type === 'chart' && <MiniChart data={cmd.data.values} />}
                </div>
              </motion.div>
              {!cmd.isUser && cmd.data?.type === 'portfolio' && <PortfolioSimulator />}
              {!cmd.isUser && cmd.data?.type === 'news' && (
                <div>
                  <h3>Latest News</h3>
                  {cmd.data.articles.map((article, index) => (
                    <div key={index}>
                      <h4>{article.title}</h4>
                      <p>Source: {article.source}</p>
                      <p>Timestamp: {article.timestamp}</p>
                      <p>Sentiment: {article.sentiment}</p>
                    </div>
                  ))}
                </div>
              )}
              {!cmd.isUser && cmd.data?.type?.includes('simulation') && (
                <SimulationVisualization data={cmd.data} />
              )}
              {!cmd.isUser && cmd.data?.type === 'technical' && (
                <TechnicalAnalysis ticker={cmd.data.ticker || ''} />
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <CLIInterface 
        onCommand={handleCommandSubmit} 
        commandHistory={commands.map(cmd => cmd.text)} 
        showTutorial={true}
      />
    </div>
  );
};

export default GodelCLI;
