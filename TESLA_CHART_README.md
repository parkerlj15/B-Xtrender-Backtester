# 📈 Tesla Stock Chart - TradingView Lightweight Charts

A beautiful, interactive Tesla (TSLA) stock chart application built with TradingView Lightweight Charts library, displaying 5 years of historical stock data.

## ✨ Features

- **Interactive Candlestick Charts** - Full OHLC (Open, High, Low, Close) data visualization
- **Multiple Chart Types** - Switch between Candlestick, Line, and Area charts
- **5 Years of Data** - Tesla stock data from 2019-2025
- **Zoom & Pan** - Interactive chart navigation
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Performance** - Smooth 60fps rendering with thousands of data points
- **Professional UI** - Clean, modern interface with gradient header

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

1. **Navigate to the BX_backtester folder:**
   ```bash
   cd BX_backtester
   ```

2. **Start the server:**
   ```bash
   node chart_server.js
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001`

4. **Enjoy the charts!**
   The application will automatically load and display Tesla's stock data.

## 📊 Chart Controls

- **Chart Type Buttons**: Switch between Candlestick, Line, and Area views
- **Fit Content**: Auto-scale the chart to show all data
- **Reset Zoom**: Return to the original view
- **Mouse Controls**: 
  - Drag to pan
  - Scroll to zoom
  - Hover for crosshair and price details

## 🏗️ Technical Implementation

### Built With
- **TradingView Lightweight Charts™** - Professional financial charting library
- **Express.js** - Node.js web server
- **Vanilla JavaScript** - No additional frameworks
- **CSS3** - Modern styling with gradients and responsive design

### Architecture
- `tesla_chart.html` - Main chart application with embedded JavaScript
- `chart_server.js` - Express server serving the HTML and CSV data
- `TSLA_5Y_FROM_PERPLEXITY.csv` - Tesla historical stock data

### API Endpoints
- `GET /` - Serves the main chart application
- `GET /api/tesla-data` - Returns formatted JSON data from CSV

## 📋 Data Format

The application uses CSV data with the following structure:
```csv
Date,Open,High,Low,Close,Volume
2025-07-01,298.42,305.87,293.21,301.79,117329622
```

Data is automatically:
- Parsed from CSV to JSON
- Sorted chronologically (oldest first)
- Formatted for TradingView charts
- Cached for performance

## 🎨 Customization

### Chart Styling
You can customize the chart appearance by modifying the series options in `tesla_chart.html`:

```javascript
// Candlestick colors
this.candlestickSeries = this.chart.addSeries(LightweightCharts.CandlestickSeries, {
    upColor: '#26a69a',      // Green for up days
    downColor: '#ef5350',    // Red for down days
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
});

// Line chart colors
this.lineSeries = this.chart.addSeries(LightweightCharts.LineSeries, {
    color: '#2962FF',        // Blue line
    lineWidth: 2,
});
```

### Adding New Features
The modular architecture makes it easy to add:
- Volume indicators
- Moving averages
- Technical indicators
- Multiple timeframes
- Real-time data feeds

## 📚 TradingView Lightweight Charts Documentation

This application follows the official TradingView documentation:
- [Getting Started Guide](https://tradingview.github.io/lightweight-charts/docs)
- [API Reference](https://tradingview.github.io/lightweight-charts/docs/api)
- [Tutorials](https://tradingview.github.io/lightweight-charts/tutorials)

## 🔧 Development

### File Structure
```
BX_backtester/
├── tesla_chart.html                 # Main chart application
├── chart_server.js                 # Express server
├── TSLA_5Y_FROM_PERPLEXITY.csv     # Tesla stock data
├── TESLA_CHART_README.md           # This file
└── BX.js                           # Existing backtester file
```

### Making Changes
1. Edit `tesla_chart.html` for frontend changes
2. Edit `chart_server.js` for backend changes
3. Restart the server to see changes
4. No build process required - pure HTML/JS/CSS

## 📄 License & Attribution

This application includes the required TradingView attribution:
- Charts powered by [TradingView](https://www.tradingview.com)
- Built with TradingView Lightweight Charts™

## 🚨 Troubleshooting

### Common Issues

**Server won't start:**
```bash
# Check if port 3001 is already in use
lsof -i :3001

# Kill any existing process
kill -9 <PID>
```

**Chart not loading:**
- Check browser console for errors
- Ensure CSV file exists at `TSLA_5Y_FROM_PERPLEXITY.csv` (in the same folder)
- Verify server is running on port 3001

**Performance issues:**
- The chart handles 3,776 data points efficiently
- If slow, check browser memory usage
- Consider data pagination for larger datasets

## 🔮 Future Enhancements

- [ ] Volume indicator overlay
- [ ] Moving average lines
- [ ] RSI and MACD indicators
- [ ] Multiple stock symbols
- [ ] Real-time data integration
- [ ] Export chart as image
- [ ] Dark/light theme toggle
- [ ] Mobile touch gestures

---

**Enjoy trading! 📈💰** 