/**
 * Unified Types for Deriv Matcher
 */

export interface VolatilityData {
  symbol: string;
  current_volatility: number;
  bid_price: number;
  ask_price: number;
  timestamp: number;
  trend: 'rising' | 'falling' | 'stable';
  spread: number;
}

export interface AnalysisData {
  volatility: number;
  volatility_level: 'low' | 'medium' | 'high';
  bid: number;
  ask: number;
  spread: number;
  digit_frequency: Record<number, number>;
}

export interface DigitPrediction {
  predicted_digit: number;
  confidence: number;
  expiration_seconds: number;
  match_probability: number;
  volatility_trend: 'rising' | 'falling' | 'stable';
  symbol: string;
  timestamp: number;
  analysis_data: AnalysisData;
}

export interface PredictionReport {
  timestamp: string;
  scan_number: number;
  predictions: Record<string, DigitPrediction>;
}

export const DIGIT_MARKETS = ['R_100', 'R_50', 'R_25', 'RDBULL', 'RDBEAR'];

export const EXPIRATION_PRESETS: Record<number, number> = {
  0: 15, 1: 20, 2: 25, 3: 30, 4: 35,
  5: 40, 6: 45, 7: 50, 8: 55, 9: 60
};

export const VOLATILITY_MULTIPLIERS: Record<string, number> = {
  low: 0.8,
  medium: 1.0,
  high: 1.2
};
