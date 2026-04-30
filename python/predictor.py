"""Deriv Digit Prediction Engine"""
import hashlib
import random
from dataclasses import dataclass
from typing import Dict
from datetime import datetime
from scanner import VolatilityData, VolatilityScanner


@dataclass
class AnalysisData:
    volatility: float
    volatility_level: str
    bid: float
    ask: float
    spread: float
    digit_frequency: Dict[int, int]


@dataclass
class DigitPrediction:
    predicted_digit: int
    confidence: float
    expiration_seconds: int
    match_probability: float
    volatility_trend: str
    symbol: str
    timestamp: int
    analysis_data: AnalysisData


class DigitPredictor:
    """Predicts winning digit using volatility analysis"""
    
    EXPIRATION_PRESETS = {
        0: 15, 1: 20, 2: 25, 3: 30, 4: 35,
        5: 40, 6: 45, 7: 50, 8: 55, 9: 60
    }
    
    VOLATILITY_MULTIPLIERS = {
        'low': 0.8,
        'medium': 1.0,
        'high': 1.2
    }
    
    def __init__(self):
        self.digit_frequency: Dict[int, int] = {i: 0 for i in range(10)}
        self.scanner = VolatilityScanner()
    
    def predict_digit(self, volatility_data: VolatilityData) -> DigitPrediction:
        """Predict winning digit for a symbol"""
        
        # Generate digit using SHA-256 hash of volatility data
        hash_input = f"{volatility_data.symbol}{volatility_data.current_volatility}{volatility_data.timestamp}"
        hash_obj = hashlib.sha256(hash_input.encode())
        hash_value = int(hash_obj.hexdigest(), 16)
        predicted_digit = hash_value % 10
        
        # Update frequency
        self.digit_frequency[predicted_digit] += 1
        
        # Calculate volatility level
        vol_level = self.scanner.get_volatility_level(volatility_data.current_volatility)
        
        # Calculate expiration time
        base_expiration = self.EXPIRATION_PRESETS[predicted_digit]
        multiplier = self.VOLATILITY_MULTIPLIERS[vol_level]
        expiration_seconds = int(base_expiration * multiplier)
        expiration_seconds = max(5, min(300, expiration_seconds))  # Clamp 5-300
        
        # Calculate confidence (0.0-1.0)
        # Based on: volatility trend (40%), spread efficiency (40%), digit frequency balance (20%)
        trend_score = 0.8 if volatility_data.trend == 'rising' else (0.6 if volatility_data.trend == 'falling' else 0.7)
        spread_score = max(0.0, 1.0 - (volatility_data.spread * 0.5))  # Lower spread = higher confidence
        freq_score = self._calculate_frequency_balance()
        
        confidence = (trend_score * 0.4) + (spread_score * 0.4) + (freq_score * 0.2)
        confidence = max(0.0, min(1.0, confidence))
        
        # Calculate match probability (combines confidence with frequency)
        match_probability = (confidence * 0.6) + (freq_score * 0.4)
        
        # Create analysis data
        analysis_data = AnalysisData(
            volatility=round(volatility_data.current_volatility, 2),
            volatility_level=vol_level,
            bid=round(volatility_data.bid_price, 2),
            ask=round(volatility_data.ask_price, 2),
            spread=round(volatility_data.spread, 4),
            digit_frequency=dict(self.digit_frequency)
        )
        
        return DigitPrediction(
            predicted_digit=predicted_digit,
            confidence=round(confidence, 2),
            expiration_seconds=expiration_seconds,
            match_probability=round(match_probability, 2),
            volatility_trend=volatility_data.trend,
            symbol=volatility_data.symbol,
            timestamp=volatility_data.timestamp,
            analysis_data=analysis_data
        )
    
    def _calculate_frequency_balance(self) -> float:
        """Calculate how balanced digit frequencies are (higher = more balanced)"""
        if not self.digit_frequency:
            return 0.5
        
        total = sum(self.digit_frequency.values())
        if total == 0:
            return 0.5
        
        # Perfect balance would be total/10 for each digit
        expected = total / 10
        
        # Calculate variance from perfect balance
        variance = sum((count - expected) ** 2 for count in self.digit_frequency.values()) / 10
        
        # Convert variance to a 0-1 score (lower variance = higher score)
        balance_score = 1.0 / (1.0 + (variance / 100))
        return min(1.0, balance_score)
    
    def predict_all_markets(self, volatility_data_dict: Dict[str, VolatilityData]) -> Dict[str, DigitPrediction]:
        """Generate predictions for all markets"""
        predictions = {}
        for symbol, vol_data in volatility_data_dict.items():
            predictions[symbol] = self.predict_digit(vol_data)
        return predictions
