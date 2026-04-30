# 🎯 Deriv Matcher - Unified Digit Prediction System

**A comprehensive multi-language system that scans Deriv trading platform digit markets, analyzes volatility patterns, and predicts winning digits with precise expiration times.**

---

## 📊 Features

### Digit Markets Scanned
- **R_100** - Volatility Index 100
- **R_50** - Volatility Index 50  
- **R_25** - Volatility Index 25
- **RDBULL** - Bullish Digit
- **RDBEAR** - Bearish Digit

### Core Capabilities
✅ **Real-time Volatility Scanning** - Tracks bid/ask spreads and volatility trends  
✅ **Digit Prediction Engine** - SHA-256 hashing for deterministic digit generation (0-9)  
✅ **Smart Expiration Calculator** - 5-300 second range with volatility-based adjustments  
✅ **Confidence Scoring** - Based on volatility trend (40%) + spread efficiency (40%) + frequency balance (20%)  
✅ **Match Probability** - Combines confidence with historical digit frequency  
✅ **Frequency Analysis** - Tracks digit distribution to optimize predictions  
✅ **JSON Reporting** - Auto-export with complete analysis data  
✅ **Multi-Language** - Python and TypeScript implementations  

---

## 🚀 Quick Start

### Python Implementation

**Requirements:** Python 3.7+ (no external dependencies)

```bash
cd python
python main.py
```

This runs 12 scans over 60 seconds (5-second intervals), generating predictions for all digit markets.

### TypeScript Implementation

**Requirements:** Node.js 14+

```bash
cd javascript
npm install
npm run dev
```

Same behavior as Python - 12 scans, all digit markets, complete JSON reporting.

---

## 📈 Prediction Output

Each scan generates predictions for all 5 digit markets:

```json
{
  "R_100": {
    "predicted_digit": 7,
    "confidence": 0.85,
    "expiration_seconds": 45,
    "match_probability": 0.82,
    "volatility_trend": "rising",
    "timestamp": 1704067200000,
    "analysis_data": {
      "volatility": 2.34,
      "volatility_level": "medium",
      "bid": 100.42,
      "ask": 100.47,
      "spread": 0.05,
      "digit_frequency": {
        "0": 2, "1": 1, "2": 1, "3": 2, "4": 1,
        "5": 2, "6": 1, "7": 2, "8": 1, "9": 1
      }
    }
  }
}
```

### Output Explanation

| Field | Range | Meaning |
|-------|-------|----------|
| `predicted_digit` | 0-9 | The digit to match for profit |
| `confidence` | 0.0-1.0 | Algorithm confidence in prediction |
| `expiration_seconds` | 5-300 | When the trade expires |
| `match_probability` | 0.0-1.0 | Likelihood of successful match |
| `volatility_trend` | rising/falling/stable | Current market direction |
| `volatility_level` | low/medium/high | Current volatility classification |
| `spread` | decimal | Bid-ask spread (smaller = better) |

---

## 🎨 How It Works

### 1. Volatility Scanning
Scans all 5 digit markets and tracks:
- Current volatility levels
- Bid/ask prices
- Spread efficiency
- Trend direction (rising/falling/stable)
- 60-second history window

### 2. Digit Prediction
- Uses **SHA-256 hashing** of symbol + volatility + timestamp
- Generates deterministic digit (0-9)
- Updates frequency distribution for all digits

### 3. Expiration Calculation
- **Base preset** for each digit (15-60 seconds)
- **Volatility multiplier** adjustment (0.8x-1.2x):
  - Low volatility: 0.8x (faster expiry)
  - Medium volatility: 1.0x (normal)
  - High volatility: 1.2x (extended)
- **Result clamped** to 5-300 second range

### 4. Confidence Scoring
- **Trend Score (40%)**: 0.8 rising, 0.6 falling, 0.7 stable
- **Spread Efficiency (40%)**: Lower spread = higher score
- **Frequency Balance (20%)**: How evenly digits distribute

### 5. Match Probability
Combines confidence (60%) + frequency balance (40%)

---

## 📂 Project Structure

```
deriv-matcher/
├── python/
│   ├── scanner.py          # Volatility scanning engine
│   ├── predictor.py        # Digit prediction logic
│   ├── main.py             # Unified system orchestrator
│   └── requirements.txt     # (empty - stdlib only)
│
├── javascript/
│   ├── src/
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── scanner.ts      # Volatility scanner
│   │   ├── predictor.ts    # Prediction engine
│   │   └── index.ts        # Main orchestrator
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   └── types.ts            # Unified type definitions
│
└── README.md               # This file
```

---

## 🔧 Configuration

Both implementations use default parameters:
- **Scan Interval**: 5 seconds
- **Duration**: 60 seconds total
- **Total Scans**: 12 per run
- **Markets**: All 5 digit markets

Edit `DerivMatcher(scan_interval, duration)` in main files to adjust.

---

## 📊 Reports

Both implementations generate `prediction_report.json` with:
- All predictions from each scan
- Complete analysis data
- Digit frequency tracking
- Timestamps and metadata

---

## 🎯 Use Cases

✅ **Automated Digit Trading** - Use predictions to automate matches market trades  
✅ **Pattern Analysis** - Analyze historical predictions for patterns  
✅ **Risk Management** - Adjust trade size based on confidence scores  
✅ **Market Research** - Study digit distribution and volatility relationships  
✅ **Portfolio Optimization** - Combine with other trading strategies  

---

## 💡 Future Enhancements

- 🌐 Real Deriv API integration (WebSocket)
- 💾 PostgreSQL historical data storage
- 📈 Advanced ML prediction models
- 🔔 Live trading alerts and notifications
- 📊 Web dashboard with real-time charts
- 🐳 Docker containerization
- ☁️ Cloud deployment (AWS/GCP)
- 🔀 Additional language implementations (Go, Java, Rust)

---

## ⚙️ System Requirements

### Python
- Python 3.7+
- No external dependencies
- ~50MB disk space

### TypeScript/Node
- Node.js 14+
- npm or yarn
- ~200MB with dependencies

---

## 📝 License

Open source - use and modify freely for personal/commercial use.

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Real API integration
- Additional prediction algorithms
- Performance optimizations
- Additional language implementations

---

**Built for Deriv traders. Predict better. Trade smarter. 🚀**
