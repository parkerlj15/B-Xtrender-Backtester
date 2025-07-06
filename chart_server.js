const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static('.'));

// Serve the main dashboard page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the moving averages chart page  
app.get('/moving-averages', (req, res) => {
    res.sendFile(path.join(__dirname, 'tesla_chart_with_ma.html'));
});

// Serve the original chart page (without moving averages)
app.get('/basic', (req, res) => {
    res.sendFile(path.join(__dirname, 'tesla_chart.html'));
});

// Serve the BX trender chart page
app.get('/bx-trender', (req, res) => {
    res.sendFile(path.join(__dirname, 'tesla_chart_with_bx.html'));
});

// API endpoint to serve CSV data as JSON
app.get('/api/tesla-data', (req, res) => {
    try {
        const csvPath = path.join(__dirname, 'TSLA_5Y_FROM_PERPLEXITY.csv');
        const csvData = fs.readFileSync(csvPath, 'utf8');
        
        const lines = csvData.trim().split('\n');
        const data = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const [date, open, high, low, close, volume] = lines[i].split(',');
            
            if (date && open && high && low && close) {
                data.push({
                    time: date,
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close),
                    volume: parseInt(volume) || 0
                });
            }
        }
        
        // Sort by date (oldest first) since data appears to be newest first
        data.reverse();
        
        res.json({
            success: true,
            symbol: 'TSLA',
            dataPoints: data.length,
            data: data
        });
        
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load Tesla data'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Tesla Stock Chart Server running at http://localhost:${PORT}`);
    console.log('📊 Features:');
    console.log('   • Interactive candlestick charts');
    console.log('   • Line and area chart views');
    console.log('   • Simple Moving Averages (SMA 20, 50, 200)');
    console.log('   • B-Xtrender momentum oscillator');
    console.log('   • 5 years of Tesla (TSLA) historical data');
    console.log('   • Zoom and pan functionality');
    console.log('   • Responsive design');
    console.log('\n🔗 Available endpoints:');
    console.log('   • / - Dashboard with chart selection');
    console.log('   • /moving-averages - Enhanced chart with moving averages');
    console.log('   • /bx-trender - Chart with B-Xtrender indicator');
    console.log('   • /basic - Original chart without indicators');
    console.log('\nPress Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Tesla Chart Server...');
    process.exit(0);
});

module.exports = app; 