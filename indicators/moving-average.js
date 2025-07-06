/**
 * Moving Average Indicator Utility
 * Following TradingView Lightweight Charts best practices
 */

/**
 * Simple Moving Average calculation
 * @param {Array} data - Array of price data objects
 * @param {number} period - Period for SMA calculation
 * @param {string} source - Source field ('close', 'open', 'high', 'low')
 * @returns {Array} Array of SMA data points
 */
function calculateSMA(data, period, source = 'close') {
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

/**
 * Exponential Moving Average calculation
 * @param {Array} data - Array of price data objects
 * @param {number} period - Period for EMA calculation
 * @param {string} source - Source field ('close', 'open', 'high', 'low')
 * @returns {Array} Array of EMA data points
 */
function calculateEMA(data, period, source = 'close') {
    if (data.length < period) return [];
    
    const result = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for the first value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i][source];
    }
    let ema = sum / period;
    
    result.push({
        time: data[period - 1].time,
        value: ema
    });
    
    // Calculate EMA for remaining values
    for (let i = period; i < data.length; i++) {
        ema = (data[i][source] * multiplier) + (ema * (1 - multiplier));
        result.push({
            time: data[i].time,
            value: ema
        });
    }
    
    return result;
}

/**
 * Moving Average Series Manager
 * Manages multiple moving average series on a chart
 */
class MovingAverageManager {
    constructor(chart) {
        this.chart = chart;
        this.maSeries = new Map();
        this.maConfigs = {
            // SMA configurations
            sma_20: { color: '#FF6B6B', lineWidth: 2, title: 'SMA 20', type: 'sma', period: 20 },
            sma_50: { color: '#4ECDC4', lineWidth: 2, title: 'SMA 50', type: 'sma', period: 50 },
            sma_200: { color: '#45B7D1', lineWidth: 2, title: 'SMA 200', type: 'sma', period: 200 },
            
            // EMA configurations
            ema_12: { color: '#96CEB4', lineWidth: 2, title: 'EMA 12', type: 'ema', period: 12 },
            ema_26: { color: '#FFEAA7', lineWidth: 2, title: 'EMA 26', type: 'ema', period: 26 },
            ema_50: { color: '#DDA0DD', lineWidth: 2, title: 'EMA 50', type: 'ema', period: 50 }
        };
        this.activeMA = new Set();
    }

    /**
     * Add a moving average to the chart
     * @param {string} maKey - Moving average key (e.g., 'sma_20', 'ema_12')
     * @param {Array} data - Price data array
     * @returns {Object} The created series
     */
    addMA(maKey, data) {
        if (this.maSeries.has(maKey)) {
            return; // Already exists
        }

        const config = this.maConfigs[maKey];
        if (!config) {
            console.warn(`Unknown moving average configuration: ${maKey}`);
            return;
        }

        const series = this.chart.addSeries(LightweightCharts.LineSeries, {
            color: config.color,
            lineWidth: config.lineWidth,
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
            title: config.title,
            lastValueVisible: false,
            priceLineVisible: false
        });

        // Calculate moving average based on type
        let maData;
        if (config.type === 'sma') {
            maData = calculateSMA(data, config.period);
        } else if (config.type === 'ema') {
            maData = calculateEMA(data, config.period);
        }

        series.setData(maData);
        
        this.maSeries.set(maKey, series);
        this.activeMA.add(maKey);
        
        return series;
    }

    /**
     * Remove a moving average from the chart
     * @param {string} maKey - Moving average key
     */
    removeMA(maKey) {
        if (!this.maSeries.has(maKey)) {
            return;
        }

        this.chart.removeSeries(this.maSeries.get(maKey));
        this.maSeries.delete(maKey);
        this.activeMA.delete(maKey);
    }

    /**
     * Toggle a moving average on/off
     * @param {string} maKey - Moving average key
     * @param {Array} data - Price data array
     * @returns {boolean} True if added, false if removed
     */
    toggleMA(maKey, data) {
        if (this.activeMA.has(maKey)) {
            this.removeMA(maKey);
            return false;
        } else {
            this.addMA(maKey, data);
            return true;
        }
    }

    /**
     * Update all active moving averages with new data
     * @param {Array} data - Updated price data array
     */
    updateAllMA(data) {
        for (const maKey of this.activeMA) {
            const series = this.maSeries.get(maKey);
            const config = this.maConfigs[maKey];
            
            if (series && config) {
                let maData;
                if (config.type === 'sma') {
                    maData = calculateSMA(data, config.period);
                } else if (config.type === 'ema') {
                    maData = calculateEMA(data, config.period);
                }
                
                series.setData(maData);
            }
        }
    }

    /**
     * Remove all moving averages
     */
    removeAllMA() {
        for (const maKey of this.activeMA) {
            this.removeMA(maKey);
        }
    }

    /**
     * Get list of active moving averages
     * @returns {Array} Array of active MA keys
     */
    getActiveMA() {
        return Array.from(this.activeMA);
    }

    /**
     * Get configuration for a moving average
     * @param {string} maKey - Moving average key
     * @returns {Object} Configuration object
     */
    getMAConfig(maKey) {
        return this.maConfigs[maKey];
    }

    /**
     * Get all available moving average configurations
     * @returns {Object} All MA configurations
     */
    getAllMAConfigs() {
        return this.maConfigs;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSMA,
        calculateEMA,
        MovingAverageManager
    };
}

// Global export for browser usage
if (typeof window !== 'undefined') {
    window.MovingAverageUtils = {
        calculateSMA,
        calculateEMA,
        MovingAverageManager
    };
} 