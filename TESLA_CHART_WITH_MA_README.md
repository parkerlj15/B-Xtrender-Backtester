# Tesla Stock Chart with Moving Averages

An enhanced Tesla stock chart application featuring Simple Moving Averages (SMA) built with TradingView Lightweight Charts. This implementation follows the best practices from the lightweight-charts library for technical indicator development.

## 🚀 Features

- **Interactive Stock Chart**: Candlestick, line, and area chart types
- **Moving Averages**: SMA 20, 50, and 200 period indicators
- **Real-time Toggling**: Enable/disable moving averages with interactive buttons
- **Dynamic Legend**: Shows active moving averages with color coding
- **Responsive Design**: Works on desktop and mobile devices
- **5 Years of Data**: Historical Tesla (TSLA) stock data
- **Professional Styling**: Modern UI with gradient backgrounds and smooth animations

## 📁 Project Structure

```
B-Xtrender-Backtester/
├── chart_server.js                    # Express server
├── tesla_chart.html                   # Original chart (basic)
├── tesla_chart_with_ma.html           # Enhanced chart with moving averages
├── indicators/
│   └── moving-average.js              # Modular MA utility (for future use)
├── TSLA_5Y_FROM_PERPLEXITY.csv       # Tesla stock data
└── README files...
```

## 🔧 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   node chart_server.js
   ```

3. **Access the Charts**:
   - Enhanced chart with MAs: http://localhost:3001
   - Basic chart: http://localhost:3001/basic

## 📊 Moving Average Implementation

### Architecture

The moving average implementation follows lightweight-charts best practices:

#### 1. **Modular Design**
- Separate `MovingAverageCalculator` class for calculations
- `MovingAverageManager` class for series management
- Clean separation of concerns

#### 2. **Calculation Logic**
```javascript
class MovingAverageCalculator {
    static calculateSMA(data, period, source = 'close') {
        if (data.length < period) return [];
        
        const result = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j][source];
            }
            const average = sum / period;
            
            result.push({
                time: data[i].time,
                value: average
            });
        }
        
        return result;
    }
}
```

#### 3. **Series Management**
- Dynamic addition/removal of MA series
- Proper cleanup when switching chart types
- Memory leak prevention

#### 4. **Visual Configuration**
```javascript
maConfigs = {
    20: { color: '#FF6B6B', lineWidth: 2, title: 'SMA 20' },
    50: { color: '#4ECDC4', lineWidth: 2, title: 'SMA 50' },
    200: { color: '#45B7D1', lineWidth: 2, title: 'SMA 200' }
};
```

### Key Features

#### **Interactive Controls**
- Toggle buttons for each MA period
- Visual feedback with active/inactive states
- Color-coded border indicators

#### **Dynamic Legend**
- Shows only active moving averages
- Color-coded legend items
- Positioned overlay on chart

#### **Chart Type Compatibility**
- Moving averages work with all chart types (candlestick, line, area)
- Automatic restoration when switching chart types
- No data loss during transitions

## 🎨 UI/UX Design

### Control Groups
- **Chart Type**: Toggle between candlestick, line, and area
- **Moving Averages**: Enable/disable SMA 20, 50, 200
- **Navigation**: Fit content and reset zoom controls

### Visual Elements
- **Grouped Controls**: Organized control sections with borders
- **Color Coding**: Each MA has a unique color and matching button border
- **Smooth Animations**: CSS transitions for interactive elements
- **Professional Styling**: Modern gradient header and clean layout

## 📈 Technical Analysis Features

### Moving Average Periods
- **SMA 20**: Short-term trend (red) - Good for day trading signals
- **SMA 50**: Medium-term trend (teal) - Popular for swing trading
- **SMA 200**: Long-term trend (blue) - Major support/resistance levels

### Trading Signals
- **Golden Cross**: When SMA 50 crosses above SMA 200 (bullish)
- **Death Cross**: When SMA 50 crosses below SMA 200 (bearish)
- **Price vs MA**: Price above/below MA indicates trend direction

## 🛠️ Best Practices Implemented

### 1. **Performance Optimization**
- Efficient SMA calculation algorithm
- Minimal DOM manipulation
- Proper series cleanup

### 2. **Code Organization**
- Class-based architecture
- Separation of concerns
- Modular components

### 3. **Memory Management**
- Proper event listener cleanup
- Series removal on chart type switches
- No memory leaks

### 4. **Error Handling**
- Graceful fallbacks for missing data
- Console error logging
- User-friendly error messages

### 5. **Responsive Design**
- Auto-resizing charts
- Mobile-friendly controls
- Flexible layout system

## 🔮 Future Enhancements

### Additional Indicators
- **EMA (Exponential Moving Average)**: More responsive to recent prices
- **RSI (Relative Strength Index)**: Momentum oscillator
- **MACD**: Moving Average Convergence Divergence
- **Bollinger Bands**: Volatility indicators

### Advanced Features
- **Volume Analysis**: Volume-based indicators
- **Drawing Tools**: Trend lines and annotations
- **Alerts**: Price and indicator-based alerts
- **Multiple Timeframes**: 1D, 1W, 1M chart views

### Data Integration
- **Real-time Data**: Live price updates
- **Multiple Symbols**: Compare different stocks
- **Extended History**: More historical data

## 🔧 Customization

### Adding New Moving Averages
1. Update `maConfigs` object with new period
2. Add corresponding button in HTML
3. Update CSS for new button styling
4. Add event listener for new button

### Styling Customization
- Modify colors in `maConfigs`
- Update CSS variables for theme changes
- Adjust chart height and responsive breakpoints

## 📊 Data Format

The application expects Tesla stock data in CSV format:
```csv
Date,Open,High,Low,Close,Volume
2024-01-01,250.00,255.00,248.00,253.00,25000000
```

## 🚨 Known Limitations

1. **Data Dependency**: Requires complete historical data for accurate MA calculations
2. **Client-side Processing**: All calculations performed in browser
3. **Fixed Periods**: Currently supports only 20, 50, and 200-period SMAs
4. **Single Symbol**: Only displays Tesla (TSLA) data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes following the established patterns
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational purposes and uses TradingView Lightweight Charts library.

## 🙏 Acknowledgments

- **TradingView**: For the excellent Lightweight Charts library
- **Lightweight Charts Examples**: For implementation patterns and best practices
- **Trading Community**: For moving average calculation methods and trading insights

---

*Built with ❤️ for technical analysis and stock trading education* 