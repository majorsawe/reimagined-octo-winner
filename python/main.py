#!/usr/bin/env python3
"""Deriv Matcher - Unified Digit Prediction System"""
import json
import time
from datetime import datetime
from scanner import VolatilityScanner
from predictor import DigitPredictor


class DerivMatcher:
    """Main unified system combining scanner and predictor"""
    
    def __init__(self, scan_interval: int = 5, duration: int = 60):
        self.scan_interval = scan_interval
        self.duration = duration
        self.scanner = VolatilityScanner(history_window=60)
        self.predictor = DigitPredictor()
        self.all_predictions = []
    
    def run(self):
        """Run the complete analysis system"""
        print("\n" + "="*80)
        print("🚀 DERIV MATCHER - Unified Digit Prediction System")
        print("="*80)
        print(f"📊 Scanning {', '.join(self.scanner.DIGIT_MARKETS)}")
        print(f"⏱️  Interval: {self.scan_interval}s | Duration: {self.duration}s")
        print("="*80 + "\n")
        
        start_time = time.time()
        scan_count = 0
        
        while time.time() - start_time < self.duration:
            scan_count += 1
            current_time = datetime.now().strftime("%H:%M:%S")
            
            # Scan all markets
            volatility_data = self.scanner.scan_all_markets()
            
            # Generate predictions
            predictions = self.predictor.predict_all_markets(volatility_data)
            
            # Store for reporting
            self.all_predictions.append({
                'timestamp': current_time,
                'scan_number': scan_count,
                'predictions': predictions
            })
            
            # Display current predictions
            self._display_predictions(current_time, predictions)
            
            # Wait before next scan
            if time.time() - start_time < self.duration:
                time.sleep(self.scan_interval)
        
        # Generate final report
        self._generate_report()
    
    def _display_predictions(self, timestamp: str, predictions: dict):
        """Display predictions in formatted table"""
        print(f"\n📍 {timestamp} - Scan Analysis:")
        print("-" * 80)
        print(f"{'Symbol':<12} {'Digit':<8} {'Confidence':<12} {'Expiry(s)':<12} {'Probability':<12} {'Trend':<10}")
        print("-" * 80)
        
        for symbol, pred in predictions.items():
            print(f"{symbol:<12} {pred.predicted_digit:<8} "
                  f"{pred.confidence:<12.2f} {pred.expiration_seconds:<12} "
                  f"{pred.match_probability:<12.2f} {pred.volatility_trend:<10}")
        
        print("-" * 80)
    
    def _generate_report(self):
        """Generate JSON report of all predictions"""
        report = {
            'system': 'Deriv Matcher - Unified Digit Prediction',
            'generated_at': datetime.now().isoformat(),
            'total_scans': len(self.all_predictions),
            'markets_analyzed': self.scanner.DIGIT_MARKETS,
            'scan_data': []
        }
        
        for scan in self.all_predictions:
            scan_data = {
                'timestamp': scan['timestamp'],
                'scan_number': scan['scan_number'],
                'predictions': {}
            }
            
            for symbol, pred in scan['predictions'].items():
                scan_data['predictions'][symbol] = {
                    'predicted_digit': pred.predicted_digit,
                    'confidence': pred.confidence,
                    'expiration_seconds': pred.expiration_seconds,
                    'match_probability': pred.match_probability,
                    'volatility_trend': pred.volatility_trend,
                    'analysis_data': {
                        'volatility': pred.analysis_data.volatility,
                        'volatility_level': pred.analysis_data.volatility_level,
                        'bid': pred.analysis_data.bid,
                        'ask': pred.analysis_data.ask,
                        'spread': pred.analysis_data.spread,
                        'digit_frequency': pred.analysis_data.digit_frequency
                    }
                }
            
            report['scan_data'].append(scan_data)
        
        # Save report
        with open('prediction_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        print("\n" + "="*80)
        print("✅ REPORT GENERATED")
        print("="*80)
        print(f"📄 Report saved to: prediction_report.json")
        print(f"📊 Total scans: {len(self.all_predictions)}")
        print(f"🎯 Markets analyzed: {', '.join(self.scanner.DIGIT_MARKETS)}")
        print("="*80 + "\n")


if __name__ == '__main__':
    matcher = DerivMatcher(scan_interval=5, duration=60)
    matcher.run()
