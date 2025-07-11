# B-Xtrender Backtester

A comprehensive backtesting platform for stock analysis using the B-Xtrender oscillating histogram indicator. This implementation provides TradingView-compatible calculations with 99%+ accuracy and supports custom data uploads for any stock.

## 🎯 Features

- **B-Xtrender Oscillating Histogram**: Advanced momentum oscillator for trend reversal detection
- **TradingView Compatible**: Uses identical EMA initialization and RSI calculations as TradingView
- **High Accuracy**: 99%+ match with TradingView values
- **Custom Data Upload**: Upload your own CSV files for any stock analysis
- **Interactive Charts**: Built with TradingView Lightweight Charts
- **Multiple Chart Types**: Candlestick, Line, and Area views
- **Historical Data**: Includes 5 years of Tesla (TSLA) and NVIDIA (NVDA) historical data
- **Dynamic Data Source**: Switch between default data and uploaded files seamlessly
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Upload status and error handling with user feedback

## 🔧 Technical Details

### B-Xtrender Calculation
```
BX = RSI(5) of [EMA(5) - EMA(20)] - 50
```

**Parameters:**
- `EMA(5)`: 5-period Exponential Moving Average of close prices
- `EMA(20)`: 20-period Exponential Moving Average of close prices
- `RSI(5)`: 5-period Relative Strength Index of the EMA difference
- `- 50`: Centers the oscillator around zero

### Color Coding
- **Green**: Positive momentum (BX > 0)
- **Red**: Negative momentum (BX < 0)
- **Intensity**: Darker colors indicate stronger momentum in the current direction

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/vibe-coderx/B-Xtrender-Backtester.git
cd B-Xtrender-Backtester
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

4. **Open your browser:**
Navigate to `http://localhost:3001`

## 📁 Project Structure

```
B-Xtrender-Backtester/
├── indicators/
│   └── bx-indicator.js          # B-Xtrender oscillating histogram implementation
├── uploads/                     # Directory for uploaded CSV files
├── tesla_chart_with_bx.html     # Main chart interface
├── index.html                   # Landing page and dashboard
├── chart_server.js              # Express server with file upload support
├── package.json                 # Node.js dependencies
├── TSLA_5Y_FROM_PERPLEXITY.csv  # Tesla historical data
├── NVDA_5Y_FROM_PERPLEXITY.csv  # NVIDIA historical data
├── pine.txt                     # TradingView Pine Script reference
└── README.md                    # This file
```

## 🔍 Usage

### Dashboard
- Visit the main dashboard at `/` to access the B-Xtrender chart
- Click "Launch B-Xtrender Chart" to open the interactive analysis

### Chart Interface
- **Toggle Indicator**: Click "Toggle B-Xtrender" to show/hide the oscillating histogram
- **Chart Types**: Switch between Candlestick, Line, and Area chart views
- **Zoom & Pan**: Use mouse wheel to zoom, drag to pan across time periods
- **Fit Content**: Auto-fit the chart to show all data

### File Upload Feature
- **Upload Custom Data**: Click "Choose File" to upload your own CSV stock data
- **Supported Format**: CSV files with Date, Open, High, Low, Close columns (Volume optional)
- **File Size Limit**: Maximum 10MB per file
- **Data Source Indicator**: Shows which data source is currently active
- **Reset Data**: Use "Reset to Default Data" to return to Tesla data
- **Real-time Updates**: Chart automatically refreshes with new data after upload

### CSV File Format
Your CSV file should have the following structure:
```csv
Date,Open,High,Low,Close,Volume
2024-01-01,100.00,105.00,99.00,103.00,1000000
2024-01-02,103.00,108.00,102.00,107.00,1200000
```

**Required columns:**
- `Date`: Date in YYYY-MM-DD format
- `Open`: Opening price
- `High`: Highest price
- `Low`: Lowest price
- `Close`: Closing price

**Optional columns:**
- `Volume`: Trading volume

### Interpretation
- **Above Zero**: Bullish momentum
- **Below Zero**: Bearish momentum
- **Crossing Zero**: Potential trend change points
- **Histogram Height**: Strength of momentum

## 🎨 Customization

### Modify Parameters
Edit `indicators/bx-indicator.js`:
```javascript
const calculator = new BXHistogramCalculator({
    shortL1: 5,    // First EMA period
    shortL2: 20,   // Second EMA period
    shortL3: 5     // RSI period
});
```

### Update Default Data
Replace `TSLA_5Y_FROM_PERPLEXITY.csv` with your own CSV data or use the upload feature for temporary analysis.

## 🏗️ Implementation Details

### EMA Calculation
- Uses first price as initial EMA value (TradingView method)
- Multiplier: `2 / (period + 1)`
- Smoothing: `EMA = (Price × Multiplier) + (Previous EMA × (1 - Multiplier))`

### RSI Calculation
- Uses Wilder's smoothing method
- Initial values calculated with Simple Moving Average
- Subsequent values use exponential smoothing

### File Upload System
- **Multer Middleware**: Handles multipart/form-data uploads
- **CSV Validation**: Validates file format and required columns
- **Security**: File size limits and safe file handling
- **Dynamic Switching**: Seamless transition between data sources

### Visualization
- Separate oscillator panel below main chart
- Histogram bars with dynamic coloring
- Zero line reference for trend identification
- Dynamic chart titles based on data source

## 📊 API Endpoints

### Data Endpoints
- `GET /` - Main dashboard
- `GET /bx-trender` - B-Xtrender chart interface
- `GET /api/tesla-data` - Historical data (JSON format, prioritizes uploaded data)

### File Upload Endpoints
- `POST /api/upload-data` - Upload CSV file for analysis
- `GET /api/data-info` - Get information about current data source
- `DELETE /api/delete-uploaded-data` - Remove uploaded data and reset to default

## 🔧 Development

### File Structure
- **Frontend**: HTML/CSS/JavaScript with TradingView Lightweight Charts
- **Backend**: Express.js server with multer for file uploads
- **Data**: CSV files with historical OHLCV data

### Key Classes
- `BXHistogramCalculator`: Core calculation engine
- `BXHistogramManager`: Chart integration and management
- `TechnicalAnalysisUtils`: EMA and RSI utility functions

### File Upload Security
- File size validation (10MB limit)
- CSV format validation
- Safe file handling and storage
- Error handling and user feedback

## 📈 Accuracy Validation

The implementation has been validated against TradingView with the following results:
- **9/10 recent values**: Exact match (0.00 difference)
- **1/10 recent values**: 0.37 difference (99.9% accuracy)
- **Overall accuracy**: 99%+ match with TradingView Pine Script

## 🙏 Credits

- **Original Concept**: Bharat Jhunjhunwala (IFTA Journal)
- **TradingView Pine Script**: @Puppytherapy
- **JavaScript Implementation**: Custom port for TradingView Lightweight Charts
- **Data Source**: Perplexity AI (Tesla & NVIDIA 5Y historical data)

## 📄 License

This project is for educational and research purposes. The B-Xtrender indicator concept is credited to its original authors.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 🔗 References

- [TradingView B-Xtrender by @Puppytherapy](https://www.tradingview.com/script/YHZimEz8-B-Xtrender-Puppytherapy/)
- [IFTA Journal - B-Xtrender Paper](https://ifta.org/public/files/journal/d_ifta_journal_19.pdf)
- [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/) 