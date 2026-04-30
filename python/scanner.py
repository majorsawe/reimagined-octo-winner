"""Deriv Digit Markets Volatility Scanner"""
import time
import random
from dataclasses import dataclass
from typing import Dict, List
from datetime import datetime


@dataclass
class VolatilityData:
    symbol: str
    current_volatility: float
    bid_price: float
    ask_price: float
    timestamp: int
    trend: str  # 'rising', 'falling', 'stable'
    spread: float


class VolatilityScanner:
    """Scans all digit markets for volatility trends"""
    
    DIGIT_MARKETS = ['R_100', 'R_50', 'R_25', 'RDBULL', 'RDBEAR']
    
    def __init__(self, history_window: int = 60):
        self.history_window = history_window
        self.volatility_history: Dict[str, List[float]] = {market: [] for market in self.DIGIT_MARKETS}
        self.trend_history: Dict[str, List[str]] = {market: [] for market in self.DIGIT_MARKETS}
    
    def scan_market(self, symbol: str) -> VolatilityData:
        """Simulate scanning a digit market for volatility"""
        # Simulate market data
        base_volatility = 1.5 + (random.random() * 3.0)
        bid = 100.0 + (random.random() * 5.0)
        ask = bid + (random.random() * 0.5)
        spread = ask - bid
        
        # Determine trend based on volatility history
        trend = self._determine_trend(symbol, base_volatility)
        
        # Store in history
        self.volatility_history[symbol].append(base_volatility)
        self.trend_history[symbol].append(trend)
        
        # Keep only recent history
        if len(self.volatility_history[symbol]) > self.history_window:
            self.volatility_history[symbol].pop(0)
            self.trend_history[symbol].pop(0)
        
        return VolatilityData(
            symbol=symbol,
            current_volatility=base_volatility,
            bid_price=bid,
            ask_price=ask,
            timestamp=int(time.time() * 1000),
            trend=trend,
            spread=spread
        )
    
    def _determine_trend(self, symbol: str, current_vol: float) -> str:
        """Determine if volatility is rising, falling, or stable"""
        if len(self.volatility_history[symbol]) < 2:
            return 'stable'
        
        prev_vol = self.volatility_history[symbol][-1]
        change_percent = ((current_vol - prev_vol) / prev_vol) * 100
        
        if change_percent > 2:
            return 'rising'
        elif change_percent < -2:
            return 'falling'
        return 'stable'
    
    def scan_all_markets(self) -> Dict[str, VolatilityData]:
        """Scan all digit markets at once"""
        results = {}
        for market in self.DIGIT_MARKETS:
            results[market] = self.scan_market(market)
        return results
    
    def get_volatility_level(self, volatility: float) -> str:
        """Classify volatility as low, medium, or high"""
        if volatility < 1.8:
            return 'low'
        elif volatility < 3.0:
            return 'medium'
        return 'high'
