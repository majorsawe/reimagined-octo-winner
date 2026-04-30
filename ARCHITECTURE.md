# Deriv Matcher - System Architecture

## Overview

The Deriv Matcher is a unified multi-language system designed to:
1. Scan all Deriv digit markets in real-time
2. Analyze volatility patterns
3. Predict winning digits (0-9)
4. Calculate optimal expiration times
5. Generate confidence and probability scores

## System Components

### 1. Volatility Scanner
**Purpose:** Real-time market data collection

**Inputs:**
- Digit market symbols (R_100, R_50, R_25, RDBULL, RDBEAR)
- Historical volatility data (60-second window)

**Outputs:**
- Current volatility level
- Bid/ask prices
- Spread values
- Trend direction (rising/falling/stable)

**Algorithm:**
```
For each market symbol:
  1. Generate/fetch bid price (100 ± 5)
  2. Generate/fetch ask price (bid ± 0.5)
  3. Calculate spread (ask - bid)
  4. Calculate volatility (1.5 + random * 3.0)
  5. Compare with previous value to determine trend
  6. Store in history (max 60 samples)
```

### 2. Digit Predictor
**Purpose:** Generate digit predictions with confidence scores

**Inputs:**
- Volatility data
- Historical frequency distribution
- Volatility trends

**Outputs:**
- Predicted digit (0-9)
- Confidence score (0.0-1.0)
- Expiration time (5-300 seconds)
- Match probability (0.0-1.0)

**Algorithm:**

#### Step 1: Digit Generation
```
hash_input = symbol + volatility + timestamp
sha256_hash = SHA256(hash_input)
hash_value = parseInt(hash[0:8], 16)
digit = hash_value % 10
```

#### Step 2: Expiration Calculation
```
base_expiration = PRESETS[digit]  // 15-60 seconds
multiplier = VOLATILITY_MULTIPLIERS[level]  // 0.8-1.2
expiration = base_expiration * multiplier
expiration = clamp(expiration, 5, 300)
```

#### Step 3: Confidence Scoring
```
trend_score = {rising: 0.8, falling: 0.6, stable: 0.7}
spread_score = max(0, 1 - spread * 0.5)
frequency_score = 1 / (1 + variance/100)

confidence = (trend_score * 0.4) + (spread_score * 0.4) + (frequency_score * 0.2)
```

#### Step 4: Match Probability
```
match_probability = (confidence * 0.6) + (frequency_score * 0.4)
```

### 3. Unified Orchestrator
**Purpose:** Coordinate scanner and predictor

**Flow:**
1. Initialize scanner and predictor
2. Loop for specified duration:
   - Scan all markets (VolatilityScanner.scanAllMarkets())
   - Generate predictions (DigitPredictor.predictAllMarkets())
   - Store results with timestamp
   - Display to console
   - Sleep for scan interval
3. Generate JSON report

## Data Flow

```
┌─────────────────────┐
│  System Initialize  │
└──────────┬──────────┘
           ↓
    ┌──────────────┐
    │ Loop (n times)│
    └──────┬───────┘
           ↓
    ┌──────────────────┐
    │ Scan All Markets │ → VolatilityData for each market
    └──────┬───────────┘
           ↓
    ┌───────���──────────────────┐
    │ Generate All Predictions │ → DigitPrediction for each market
    └──────┬───────────────────┘
           ↓
    ┌──────────────────┐
    │ Store & Display  │
    └──────┬───────────┘
           ↓
    ┌──────────────────┐
    │ Sleep (interval) │
    └──────┬───────────┘
           ↓
           └─────────┐ (if time remaining)
                     │
                 ┌───┴────┐ (continue or exit)
                 ↓
         ┌──────────────────┐
         │ Generate Report  │
         └──────────────────┘
```

## Configuration Parameters

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|----------|
| scan_interval | 5s | 1s-60s | Time between scans |
| duration | 60s | 10s-3600s | Total run duration |
| history_window | 60s | 10s-600s | Trend analysis window |
| min_expiration | 5s | 1s-60s | Minimum trade expiration |
| max_expiration | 300s | 60s-3600s | Maximum trade expiration |

## Volatility Levels

| Level | Volatility Range | Multiplier | Use Case |
|-------|------------------|------------|-----------|
| Low | < 1.8 | 0.8x | Stable markets, fast expiration |
| Medium | 1.8-3.0 | 1.0x | Standard, baseline |
| High | > 3.0 | 1.2x | Volatile, extended expiration |

## Expiration Presets by Digit

```
Digit 0: 15s
Digit 1: 20s
Digit 2: 25s
Digit 3: 30s
Digit 4: 35s
Digit 5: 40s
Digit 6: 45s
Digit 7: 50s
Digit 8: 55s
Digit 9: 60s
```

## Confidence Scoring Weights

- **Volatility Trend (40%)**: Market direction analysis
- **Spread Efficiency (40%)**: Bid-ask spread quality
- **Frequency Balance (20%)**: Digit distribution equilibrium

## Market Symbols

| Symbol | Type | Description |
|--------|------|-------------|
| R_100 | Volatility Index | Volatility Index 100 |
| R_50 | Volatility Index | Volatility Index 50 |
| R_25 | Volatility Index | Volatility Index 25 |
| RDBULL | Digit | Bullish Direction |
| RDBEAR | Digit | Bearish Direction |

## Output Structure

```json
{
  "system": "Deriv Matcher",
  "generated_at": "2024-01-01T12:00:00.000Z",
  "total_scans": 12,
  "markets_analyzed": ["R_100", "R_50", "R_25", "RDBULL", "RDBEAR"],
  "scan_data": [
    {
      "timestamp": "12:00:05",
      "scan_number": 1,
      "predictions": {
        "R_100": { /* DigitPrediction */ },
        "R_50": { /* DigitPrediction */ },
        ...
      }
    },
    ...
  ]
}
```

## Performance Characteristics

- **Python**: ~50MB memory, ~5-10ms per scan
- **TypeScript**: ~80MB memory (with Node.js), ~5-10ms per scan
- **JSON Report Size**: ~50-100KB for 12 scans

## Future Architecture Enhancements

1. **Real API Integration**: Live WebSocket to Deriv
2. **Database Layer**: PostgreSQL for historical data
3. **Machine Learning**: TensorFlow for advanced predictions
4. **Microservices**: Separate scanner/predictor services
5. **Message Queue**: Kafka for real-time event streaming
6. **Caching Layer**: Redis for frequency data
7. **Monitoring**: Prometheus metrics and Grafana dashboards

## Extensibility

### Adding New Prediction Algorithms
1. Create new predictor class in language-specific module
2. Implement same interface as DigitPredictor
3. Integrate into orchestrator

### Adding New Languages
1. Implement Scanner class
2. Implement Predictor class
3. Implement Orchestrator class
4. Update shared types

### Custom Volatility Calculation
Override VolatilityScanner.getVolatilityLevel() method

## Error Handling

- **Null checks**: All inputs validated
- **Bounds checking**: Expiration clamped 5-300s
- **Division by zero**: Handled in frequency calculation
- **History edge cases**: Checked before trend analysis

---

**Last Updated:** 2024-01-01
**Version:** 1.0.0
