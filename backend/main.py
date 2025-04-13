import yfinance as yf
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from datetime import datetime, timedelta
from typing import Optional, List, Dict
import numpy as np
import random

app = FastAPI(title='Gödel Terminal API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*']
)

class StockRequest(BaseModel):
    symbol: str
    period: str = '1d'
    interval: str = '15m'

class MemeRequest(BaseModel):
    text: str
    vibe: str = 'professional'

# Initialize API keys
openai.api_key = os.getenv('OPENAI_API_KEY')

portfolios = {}

@app.get('/news/{ticker}')
async def get_news(ticker: str):
    """Get financial news for a ticker"""
    try:
        # In a real app, this would call a news API
        sample_news = [
            {
                'headline': f"{ticker} announces breakthrough product",
                'source': 'Financial Times',
                'timestamp': datetime.now().isoformat(),
                'sentiment': 'positive'
            },
            {
                'headline': f"Analysts raise price target for {ticker}",
                'source': 'Bloomberg',
                'timestamp': datetime.now().isoformat(),
                'sentiment': 'positive'
            }
        ]
        return sample_news
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post('/portfolio/{user_id}')
async def update_portfolio(user_id: str, holdings: Dict[str, float]):
    """Update user portfolio holdings"""
    try:
        portfolios[user_id] = holdings
        return {"status": "success", "holdings": holdings}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get('/portfolio/{user_id}/performance')
async def get_portfolio_performance(user_id: str):
    """Calculate portfolio performance"""
    try:
        if user_id not in portfolios:
            raise HTTPException(status_code=404, detail="Portfolio not found")
            
        # In a real app, this would calculate actual performance
        return {
            "total_value": 10000,
            "daily_change": 2.5,
            "positions": [
                {"ticker": "AAPL", "value": 5000, "change": 1.8},
                {"ticker": "TSLA", "value": 3000, "change": 3.2},
                {"ticker": "NVDA", "value": 2000, "change": 4.1}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def get_stock_data(symbol: str, period: str, interval: str):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        return {
            'symbol': symbol,
            'current_price': round(ticker.history(period='1d')['Close'].iloc[-1], 2),
            'chart_data': hist.reset_index().to_dict('records'),
            'company_name': ticker.info.get('longName', ''),
            'currency': ticker.info.get('currency', 'USD')
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get('/stock/{symbol}')
async def get_stock(
    symbol: str,
    period: Optional[str] = '1d',
    interval: Optional[str] = '15m'
):
    return get_stock_data(symbol, period, interval)

@app.post('/stock')
async def get_stock_details(request: StockRequest):
    return get_stock_data(request.symbol, request.period, request.interval)

@app.post('/meme-summary')
async def generate_meme_summary(request: MemeRequest = Body(...)):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{
                "role": "system",
                "content": "You're a financial analyst. Explain this concisely:"
            }, {
                "role": "user",
                "content": request.text
            }]
        )
        return {
            'original': request.text,
            'summary': response.choices[0].message.content,
            'vibe': request.vibe
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def simulate_inflation(rate: float, duration: int):
    """Simulate inflation impact over time"""
    base = 100
    results = [base]
    for _ in range(duration):
        base *= (1 + rate/100)
        results.append(round(base, 2))
    return results

def simulate_market_shock(severity: float, recovery_rate: float):
    """Simulate market shock and recovery"""
    days = 30
    shock = -severity * np.random.rand()
    recovery = np.linspace(shock, shock * (1 - recovery_rate), days)
    return [round(100 * (1 + x), 2) for x in recovery]

@app.post('/simulate')
async def run_simulation(scenario: str):
    try:
        scenario = scenario.lower()
        
        if 'inflation' in scenario:
            rate = 5.0  # Default inflation rate
            if 'high' in scenario: rate = 8.0
            elif 'low' in scenario: rate = 2.0
            
            duration = 5  # Years
            results = simulate_inflation(rate, duration)
            return {
                'scenario': f'{rate}% inflation over {duration} years',
                'type': 'inflation',
                'results': results,
                'visualization': 'line_chart'
            }
            
        elif 'crash' in scenario or 'shock' in scenario:
            severity = 0.3  # 30% drop
            recovery = 0.8  # 80% recovery
            results = simulate_market_shock(severity, recovery)
            return {
                'scenario': 'Market shock simulation',
                'type': 'market_shock',
                'results': results,
                'visualization': 'area_chart'
            }
            
        else:
            return {
                'scenario': scenario,
                'outcome': 'Basic simulation completed',
                'timestamp': datetime.now().isoformat()
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get('/indicators/{ticker}')
async def get_technical_indicators(ticker: str):
    """
    Returns mock technical indicators for a ticker
    In production, this would connect to a data provider
    """
    try:
        # Mock data - replace with real API calls
        return {
            "rsi": round(random.uniform(30, 70), 2),
            "macd": round(random.uniform(-1, 1), 2),
            "moving_averages": {
                "50_day": round(random.uniform(100, 200), 2),
                "200_day": round(random.uniform(90, 190), 2)
            },
            "ticker": ticker,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
