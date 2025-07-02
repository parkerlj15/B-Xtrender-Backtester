const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static('.'));

// Serve the main chart page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tesla_chart.html'));
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
    console.log('   • 5 years of Tesla (TSLA) historical data');
    console.log('   • Zoom and pan functionality');
    console.log('   • Responsive design');
    console.log('\nPress Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Tesla Chart Server...');
    process.exit(0);
});

module.exports = app; 