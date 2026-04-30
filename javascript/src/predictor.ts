/**
 * Deriv Digit Prediction Engine
 */

import { createHash } from 'crypto';
import { VolatilityData, DigitPrediction, AnalysisData, EXPIRATION_PRESETS, VOLATILITY_MULTIPLIERS } from './types';
import { VolatilityScanner } from './scanner';

export class DigitPredictor {
  private digitFrequency: Record<number, number>;
  private scanner: VolatilityScanner;

  constructor() {
    this.digitFrequency = {};
    for (let i = 0; i < 10; i++) {
      this.digitFrequency[i] = 0;
    }
    this.scanner = new VolatilityScanner();
  }

  predictDigit(volatilityData: VolatilityData): DigitPrediction {
    // Generate digit using SHA-256 hash
    const hashInput = `${volatilityData.symbol}${volatilityData.current_volatility}${volatilityData.timestamp}`;
    const hash = createHash('sha256').update(hashInput).digest('hex');
    const hashValue = parseInt(hash.substring(0, 8), 16);
    const predictedDigit = hashValue % 10;

    // Update frequency
    this.digitFrequency[predictedDigit]++;

    // Calculate volatility level
    const volLevel = this.scanner.getVolatilityLevel(volatilityData.current_volatility);

    // Calculate expiration time
    const baseExpiration = EXPIRATION_PRESETS[predictedDigit];
    const multiplier = VOLATILITY_MULTIPLIERS[volLevel];
    let expirationSeconds = Math.floor(baseExpiration * multiplier);
    expirationSeconds = Math.max(5, Math.min(300, expirationSeconds));

    // Calculate confidence
    const trendScore = volatilityData.trend === 'rising' ? 0.8 : (volatilityData.trend === 'falling' ? 0.6 : 0.7);
    const spreadScore = Math.max(0.0, 1.0 - volatilityData.spread * 0.5);
    const freqScore = this.calculateFrequencyBalance();

    const confidence = (trendScore * 0.4) + (spreadScore * 0.4) + (freqScore * 0.2);
    const finalConfidence = Math.max(0.0, Math.min(1.0, confidence));

    // Calculate match probability
    const matchProbability = (finalConfidence * 0.6) + (freqScore * 0.4);

    // Create analysis data
    const analysisData: AnalysisData = {
      volatility: parseFloat(volatilityData.current_volatility.toFixed(2)),
      volatility_level: volLevel,
      bid: parseFloat(volatilityData.bid_price.toFixed(2)),
      ask: parseFloat(volatilityData.ask_price.toFixed(2)),
      spread: parseFloat(volatilityData.spread.toFixed(4)),
      digit_frequency: { ...this.digitFrequency }
    };

    return {
      predicted_digit: predictedDigit,
      confidence: parseFloat(finalConfidence.toFixed(2)),
      expiration_seconds: expirationSeconds,
      match_probability: parseFloat(matchProbability.toFixed(2)),
      volatility_trend: volatilityData.trend,
      symbol: volatilityData.symbol,
      timestamp: volatilityData.timestamp,
      analysis_data: analysisData
    };
  }

  private calculateFrequencyBalance(): number {
    const total = Object.values(this.digitFrequency).reduce((a, b) => a + b, 0);
    if (total === 0) return 0.5;

    const expected = total / 10;
    const variance = Object.values(this.digitFrequency).reduce((sum, count) => {
      return sum + Math.pow(count - expected, 2);
    }, 0) / 10;

    const balanceScore = 1.0 / (1.0 + variance / 100);
    return Math.min(1.0, balanceScore);
  }

  predictAllMarkets(volatilityDataDict: Record<string, VolatilityData>): Record<string, DigitPrediction> {
    const predictions: Record<string, DigitPrediction> = {};
    Object.entries(volatilityDataDict).forEach(([symbol, volData]) => {
      predictions[symbol] = this.predictDigit(volData);
    });
    return predictions;
  }
}
