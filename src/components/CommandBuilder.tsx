import React, { useState, useEffect } from 'react';
import { CommandType } from '../types';

type CommandBuilderProps = {
  onExecute: (command: string) => void;
};

type ParamKey = 'ticker' | 'shares' | 'price' | 'period';

const COMMAND_TEMPLATES: Record<CommandType, string> = {
  BUY: 'buy {ticker} {shares} @ {price}',
  SELL: 'sell {ticker} {shares}',
  CHART: 'chart {ticker} {period}',
  ANALYZE: 'analyze {ticker}',
  PORTFOLIO: 'portfolio',
  NEWS: 'news {ticker}'
};

const VALIDATORS: Record<ParamKey, (value: string) => boolean> = {
  ticker: (value: string) => /^[A-Z]{1,5}$/.test(value),
  shares: (value: string) => parseInt(value) > 0,
  price: (value: string) => parseFloat(value) > 0,
  period: (value: string) => ['1d','1w','1m','1y'].includes(value)
};

const HELP_TEXTS: Record<ParamKey, string> = {
  ticker: "Stock symbol (1-5 letters)",
  shares: "Whole number of shares",
  price: "Price per share",
  period: "Time period: 1d, 1w, 1m, 1y"
};

const CommandBuilder: React.FC<CommandBuilderProps> = ({ onExecute }) => {
  const [commandType, setCommandType] = useState<CommandType>('BUY');
  const [params, setParams] = useState<Record<ParamKey, string>>({});
  const [errors, setErrors] = useState<Record<ParamKey, string>>({});
  const [tutorialMode, setTutorialMode] = useState(true);
  
  const handleParamChange = (key: ParamKey, value: string) => {
    const error = VALIDATORS[key]?.(value) ? '' : `Invalid ${key}`;
    setErrors(prev => ({ ...prev, [key]: error }));
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const buildCommand = () => {
    let cmd = COMMAND_TEMPLATES[commandType];
    Object.entries(params).forEach(([key, value]) => {
      cmd = cmd.replace(`{${key}}`, value);
    });
    return cmd;
  };

  const isValid = !Object.values(errors).some(Boolean);

  useEffect(() => {
    setParams({});
    setErrors({});
  }, [commandType]);

  return (
    <div className="command-builder">
      <div className="header">
        <h3>Command Builder {tutorialMode && '(Tutorial Mode)'}</h3>
        <button onClick={() => setTutorialMode(!tutorialMode)}>
          {tutorialMode ? 'Exit Tutorial' : 'Start Tutorial'}
        </button>
      </div>
      
      {tutorialMode && (
        <div className="tutorial-hint">
          <p>Use this tool to build commands safely</p>
        </div>
      )}

      <div className="command-type">
        <label>Action:</label>
        <select 
          value={commandType} 
          onChange={(e) => setCommandType(e.target.value as CommandType)}
        >
          {Object.keys(COMMAND_TEMPLATES).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="params">
        {commandType === 'BUY' && (
          <>
            <div className="param-group">
              <label>Ticker:</label>
              <input 
                type="text" 
                value={params.ticker || ''}
                onChange={(e) => handleParamChange('ticker', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.ticker}</span>
              {errors.ticker && <span className="error">{errors.ticker}</span>}
            </div>
            
            <div className="param-group">
              <label>Shares:</label>
              <input 
                type="number" 
                value={params.shares || ''}
                onChange={(e) => handleParamChange('shares', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.shares}</span>
              {errors.shares && <span className="error">{errors.shares}</span>}
            </div>
            
            <div className="param-group">
              <label>Price:</label>
              <input 
                type="number" 
                value={params.price || ''}
                onChange={(e) => handleParamChange('price', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.price}</span>
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
          </>
        )}
        
        {commandType === 'SELL' && (
          <>
            <div className="param-group">
              <label>Ticker:</label>
              <input 
                type="text" 
                value={params.ticker || ''}
                onChange={(e) => handleParamChange('ticker', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.ticker}</span>
              {errors.ticker && <span className="error">{errors.ticker}</span>}
            </div>
            
            <div className="param-group">
              <label>Shares:</label>
              <input 
                type="number" 
                value={params.shares || ''}
                onChange={(e) => handleParamChange('shares', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.shares}</span>
              {errors.shares && <span className="error">{errors.shares}</span>}
            </div>
          </>
        )}
        
        {commandType === 'CHART' && (
          <>
            <div className="param-group">
              <label>Ticker:</label>
              <input 
                type="text" 
                value={params.ticker || ''}
                onChange={(e) => handleParamChange('ticker', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.ticker}</span>
              {errors.ticker && <span className="error">{errors.ticker}</span>}
            </div>
            
            <div className="param-group">
              <label>Period:</label>
              <input 
                type="text" 
                value={params.period || ''}
                onChange={(e) => handleParamChange('period', e.target.value)}
              />
              <span className="help">{HELP_TEXTS.period}</span>
              {errors.period && <span className="error">{errors.period}</span>}
            </div>
          </>
        )}
        
        {commandType === 'ANALYZE' && (
          <div className="param-group">
            <label>Ticker:</label>
            <input 
              type="text" 
              value={params.ticker || ''}
              onChange={(e) => handleParamChange('ticker', e.target.value)}
            />
            <span className="help">{HELP_TEXTS.ticker}</span>
            {errors.ticker && <span className="error">{errors.ticker}</span>}
          </div>
        )}
        
        {commandType === 'NEWS' && (
          <div className="param-group">
            <label>Ticker:</label>
            <input 
              type="text" 
              value={params.ticker || ''}
              onChange={(e) => handleParamChange('ticker', e.target.value)}
            />
            <span className="help">{HELP_TEXTS.ticker}</span>
            {errors.ticker && <span className="error">{errors.ticker}</span>}
          </div>
        )}
      </div>

      <div className="preview">
        <code>{buildCommand()}</code>
        <div className="actions">
          <button 
            onClick={() => navigator.clipboard.writeText(buildCommand())}
            disabled={!isValid}
          >
            Copy
          </button>
          <button 
            onClick={() => onExecute(buildCommand())} 
            disabled={!isValid}
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandBuilder;
