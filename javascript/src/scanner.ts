/**
 * Deriv Digit Markets Volatility Scanner
 */

import { VolatilityData, DIGIT_MARKETS } from './types';

export class VolatilityScanner {
  private volatilityHistory: Map<string, number[]> = new Map();
  private trendHistory: Map<string, string[]> = new Map();
  private historyWindow: number;

  constructor(historyWindow: number = 60) {
    this.historyWindow = historyWindow;
    
    DIGIT_MARKETS.forEach(market => {
      this.volatilityHistory.set(market, []);
      this.trendHistory.set(market, []);
    });
  }

  scanMarket(symbol: string): VolatilityData {
    // Simulate market data
    const baseVolatility = 1.5 + Math.random() * 3.0;
    const bid = 100.0 + Math.random() * 5.0;
    const ask = bid + Math.random() * 0.5;
    const spread = ask - bid;

    // Determine trend
    const trend = this.determineTrend(symbol, baseVolatility);

    // Store in history
    const volHistory = this.volatilityHistory.get(symbol) || [];
    volHistory.push(baseVolatility);
    if (volHistory.length > this.historyWindow) {
      volHistory.shift();
    }
    this.volatilityHistory.set(symbol, volHistory);

    const trendHist = this.trendHistory.get(symbol) || [];
    trendHist.push(trend);
    if (trendHist.length > this.historyWindow) {
      trendHist.shift();
    }
    this.trendHistory.set(symbol, trendHist);

    return {
      symbol,
      current_volatility: baseVolatility,
      bid_price: bid,
      ask_price: ask,
      timestamp: Date.now(),
      trend,
      spread
    };
  }

  private determineTrend(symbol: string, currentVol: number): 'rising' | 'falling' | 'stable' {
    const history = this.volatilityHistory.get(symbol) || [];
    if (history.length < 2) return 'stable';

    const prevVol = history[history.length - 1];
    const changePercent = ((currentVol - prevVol) / prevVol) * 100;

    if (changePercent > 2) return 'rising';
    if (changePercent < -2) return 'falling';
    return 'stable';
  }

  scanAllMarkets(): Record<string, VolatilityData> {
    const results: Record<string, VolatilityData> = {};
    DIGIT_MARKETS.forEach(market => {
      results[market] = this.scanMarket(market);
    });
    return results;
  }

  getVolatilityLevel(volatility: number): 'low' | 'medium' | 'high' {
    if (volatility < 1.8) return 'low';
    if (volatility < 3.0) return 'medium';
    return 'high';
  }
}
