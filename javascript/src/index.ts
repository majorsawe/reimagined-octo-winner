/**
 * Deriv Matcher - Unified Digit Prediction System
 */

import { writeFileSync } from 'fs';
import { VolatilityScanner } from './scanner';
import { DigitPredictor } from './predictor';
import { DIGIT_MARKETS } from './types';

interface ScanResult {
  timestamp: string;
  scan_number: number;
  predictions: any;
}

class DerivMatcher {
  private scanInterval: number;
  private duration: number;
  private scanner: VolatilityScanner;
  private predictor: DigitPredictor;
  private allPredictions: ScanResult[] = [];

  constructor(scanInterval: number = 5, duration: number = 60) {
    this.scanInterval = scanInterval;
    this.duration = duration;
    this.scanner = new VolatilityScanner(60);
    this.predictor = new DigitPredictor();
  }

  async run(): Promise<void> {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 DERIV MATCHER - Unified Digit Prediction System (TypeScript)');
    console.log('='.repeat(80));
    console.log(`📊 Scanning: ${DIGIT_MARKETS.join(', ')}`);
    console.log(`⏱️  Interval: ${this.scanInterval}s | Duration: ${this.duration}s`);
    console.log('='.repeat(80) + '\n');

    const startTime = Date.now();
    let scanCount = 0;

    while (Date.now() - startTime < this.duration * 1000) {
      scanCount++;
      const currentTime = new Date().toLocaleTimeString();

      // Scan all markets
      const volatilityData = this.scanner.scanAllMarkets();

      // Generate predictions
      const predictions = this.predictor.predictAllMarkets(volatilityData);

      // Store for reporting
      this.allPredictions.push({
        timestamp: currentTime,
        scan_number: scanCount,
        predictions
      });

      // Display predictions
      this.displayPredictions(currentTime, predictions);

      // Wait before next scan
      if (Date.now() - startTime < this.duration * 1000) {
        await this.sleep(this.scanInterval * 1000);
      }
    }

    // Generate report
    this.generateReport();
  }

  private displayPredictions(timestamp: string, predictions: any): void {
    console.log(`\n📍 ${timestamp} - Scan Analysis:`);
    console.log('-'.repeat(80));
    console.log(
      `${'Symbol':<12} ${'Digit':<8} ${'Confidence':<12} ${'Expiry(s)':<12} ${'Probability':<12} ${'Trend':<10}`
    );
    console.log('-'.repeat(80));

    Object.entries(predictions).forEach(([symbol, pred]: [string, any]) => {
      console.log(
        `${symbol.padEnd(12)} ${pred.predicted_digit.toString().padEnd(8)} ` +
        `${pred.confidence.toString().padEnd(12)} ${pred.expiration_seconds.toString().padEnd(12)} ` +
        `${pred.match_probability.toString().padEnd(12)} ${pred.volatility_trend.padEnd(10)}`
      );
    });

    console.log('-'.repeat(80));
  }

  private generateReport(): void {
    const report = {
      system: 'Deriv Matcher - Unified Digit Prediction (TypeScript)',
      generated_at: new Date().toISOString(),
      total_scans: this.allPredictions.length,
      markets_analyzed: DIGIT_MARKETS,
      scan_data: this.allPredictions.map(scan => ({
        timestamp: scan.timestamp,
        scan_number: scan.scan_number,
        predictions: scan.predictions
      }))
    };

    writeFileSync('prediction_report.json', JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(80));
    console.log('✅ REPORT GENERATED');
    console.log('='.repeat(80));
    console.log('📄 Report saved to: prediction_report.json');
    console.log(`📊 Total scans: ${this.allPredictions.length}`);
    console.log(`🎯 Markets analyzed: ${DIGIT_MARKETS.join(', ')}`);
    console.log('='.repeat(80) + '\n');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the system
const matcher = new DerivMatcher(5, 60);
matcher.run().catch(console.error);
