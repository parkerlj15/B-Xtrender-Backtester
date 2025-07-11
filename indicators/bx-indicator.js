// B-Xtrender Oscillating Histogram Indicator for TradingView Lightweight Charts
// Simplified version - only shows oscillating histogram
// Uses 3 parameters: shortL1 (5), shortL2 (20), shortL3 (5)

/**
 * Technical Analysis Utility Functions
 */
class TechnicalAnalysisUtils {
    /**
     * Calculate Exponential Moving Average (EMA) - TradingView compatible
     * @param {Array} data - Array of OHLCV data
     * @param {number} period - EMA period
     * @param {string} source - Source field (default: 'close')
     * @returns {Array} EMA values
     */
    static calculateEMA(data, period, source = 'close') {
        if (data.length < 1) return [];
        
        const result = [];
        const multiplier = 2 / (period + 1);
        
        // TradingView uses the first price as the initial EMA value
        result.push(data[0][source]);
        
        // Calculate subsequent EMA values
        for (let i = 1; i < data.length; i++) {
            const ema = (data[i][source] * multiplier) + (result[result.length - 1] * (1 - multiplier));
            result.push(ema);
        }
        
        return result;
    }

    /**
     * Calculate Relative Strength Index (RSI) using Wilder's smoothing method (TradingView compatible)
     * @param {Array} values - Array of values
     * @param {number} period - RSI period
     * @returns {Array} RSI values
     */
    static calculateRSI(values, period) {
        if (values.length < period + 1) return [];
        
        const result = [];
        
        // Calculate initial gains and losses
        let sumGain = 0;
        let sumLoss = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = values[i] - values[i - 1];
            if (change > 0) {
                sumGain += change;
            } else {
                sumLoss += Math.abs(change);
            }
        }
        
        // Initial average gain and loss using SMA
        let avgGain = sumGain / period;
        let avgLoss = sumLoss / period;
        
        // Calculate first RSI value
        let rs = avgGain / avgLoss;
        let rsi = 100 - (100 / (1 + rs));
        result.push(rsi);
        
        // Calculate subsequent RSI values using Wilder's smoothing
        for (let i = period + 1; i < values.length; i++) {
            const change = values[i] - values[i - 1];
            const gain = change > 0 ? change : 0;
            const loss = change < 0 ? Math.abs(change) : 0;
            
            // Wilder's smoothing method (EMA with alpha = 1/period)
            avgGain = (avgGain * (period - 1) + gain) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;
            
            rs = avgLoss !== 0 ? avgGain / avgLoss : 0;
            rsi = avgLoss !== 0 ? 100 - (100 / (1 + rs)) : 100;
            
            result.push(rsi);
        }
        
        return result;
    }
}

/**
 * B-Xtrender Oscillating Histogram Calculator
 */
class BXHistogramCalculator {
    constructor(config = {}) {
        this.config = {
            shortL1: config.shortL1 || 5,    // First EMA period
            shortL2: config.shortL2 || 20,   // Second EMA period  
            shortL3: config.shortL3 || 5,    // RSI period
            ...config
        };
    }

    /**
     * Calculate B-Xtrender oscillating histogram
     * @param {Array} data - OHLCV data
     * @returns {Array} Histogram values
     */
    calculate(data) {
        if (data.length < this.config.shortL2 + this.config.shortL3 + 10) {
            return [];
        }

        try {
            // Calculate EMAs
            const ema1 = TechnicalAnalysisUtils.calculateEMA(data, this.config.shortL1);
            const ema2 = TechnicalAnalysisUtils.calculateEMA(data, this.config.shortL2);
            
            // Calculate EMA difference (align arrays)
            const minLength = Math.min(ema1.length, ema2.length);
            const emaDiff = [];
            
            for (let i = 0; i < minLength; i++) {
                emaDiff.push(ema1[i] - ema2[i]);
            }
            
            // Calculate RSI of EMA difference
            const rsiData = TechnicalAnalysisUtils.calculateRSI(emaDiff, this.config.shortL3);
            
            // Center around zero (subtract 50)
            const histogramData = rsiData.map(value => value - 50);
            
            return histogramData;
            
        } catch (error) {
            console.error('Error calculating BX histogram:', error);
            return [];
        }
    }

    /**
     * Convert histogram data to chart format
     * @param {Array} histogramData - Raw histogram data
     * @param {Array} timeData - Time data from original OHLCV
     * @returns {Array} Chart-formatted data
     */
    formatForChart(histogramData, timeData) {
        const result = [];
        const offset = timeData.length - histogramData.length;
        
        for (let i = 0; i < histogramData.length; i++) {
            const timeIndex = i + offset;
            if (timeIndex < timeData.length) {
                result.push({
                    time: timeData[timeIndex].time,
                    value: histogramData[i]
                });
            }
        }
        
        return result;
    }
}

/**
 * B-Xtrender Oscillating Histogram Manager
 */
class BXHistogramManager {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.chart = null;
        this.histogramSeries = null;
        this.zeroLineSeries = null;
        this.isActive = false;
        this.calculator = new BXHistogramCalculator();
        this.chartContainer = null;
    }

    /**
     * Add B-Xtrender oscillating histogram to chart
     * @param {Array} data - OHLCV data
     * @param {Object} options - Display options
     */
    addBXHistogram(data, options = {}) {
        if (this.isActive) {
            return;
        }

        try {
            // Calculate histogram data
            const histogramData = this.calculator.calculate(data);
            
            if (histogramData.length === 0) {
                console.warn('Not enough data to calculate BX histogram');
                return;
            }
            
            // Create oscillator chart
            this.createOscillatorChart();
            
            // Add histogram series
            this.addHistogramSeries(histogramData, data);
            
            // Add zero line
            this.addZeroLine(data);
            
            this.isActive = true;
            
            console.log('BX Oscillating Histogram added successfully');
            
        } catch (error) {
            console.error('Error adding BX histogram:', error);
        }
    }

    /**
     * Create separate chart for oscillator
     */
    createOscillatorChart() {
        // Create container div
        this.chartContainer = document.createElement('div');
        this.chartContainer.id = 'bx-histogram-chart';
        this.chartContainer.style.width = '100%';
        this.chartContainer.style.height = '200px';
        this.chartContainer.style.marginTop = '10px';
        this.chartContainer.style.border = '1px solid #ddd';
        this.chartContainer.style.borderRadius = '4px';
        
        // Add title
        const title = document.createElement('div');
        title.textContent = 'B-Xtrender Oscillating Histogram';
        title.style.padding = '8px';
        title.style.backgroundColor = '#f8f9fa';
        title.style.borderBottom = '1px solid #ddd';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        
        this.chartContainer.appendChild(title);
        
        // Create chart div
        const chartDiv = document.createElement('div');
        chartDiv.id = 'bx-histogram';
        chartDiv.style.width = '100%';
        chartDiv.style.height = '170px';
        this.chartContainer.appendChild(chartDiv);
        
        // Append to parent
        this.parentElement.appendChild(this.chartContainer);
        
        // Create the chart
        const chartOptions = {
            layout: {
                textColor: '#333',
                background: { type: 'solid', color: 'white' }
            },
            width: 0,
            height: 170,
            timeScale: {
                borderColor: '#D1D4DC',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: '#D1D4DC',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            grid: {
                vertLines: { color: '#F0F3FA' },
                horzLines: { color: '#F0F3FA' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
        };

        this.chart = LightweightCharts.createChart(chartDiv, chartOptions);
        
        // Auto-resize
        window.addEventListener('resize', () => {
            if (this.chart) {
                this.chart.applyOptions({ width: 0 });
            }
        });
    }

    /**
     * Add histogram series
     */
    addHistogramSeries(histogramData, originalData) {
        this.histogramSeries = this.chart.addSeries(LightweightCharts.HistogramSeries, {
            color: '#FF6B6B',
            priceFormat: {
                type: 'volume',
                precision: 2,
                minMove: 0.01,
            },
            title: 'BX Histogram'
        });

        // Format data for chart
        const chartData = this.calculator.formatForChart(histogramData, originalData);
        
        // Add colors based on value and trend
        const coloredData = chartData.map((point, index) => ({
            time: point.time,
            value: point.value,
            color: this.getHistogramColor(point.value, index > 0 ? chartData[index - 1].value : 0)
        }));
        
        this.histogramSeries.setData(coloredData);
    }

    /**
     * Add zero line reference
     */
    addZeroLine(originalData) {
        this.zeroLineSeries = this.chart.addSeries(LightweightCharts.LineSeries, {
            color: '#666666',
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            priceFormat: {
                type: 'volume',
                precision: 2,
                minMove: 0.01,
            },
            title: 'Zero Line'
        });

        // Create zero line data
        const zeroLineData = originalData.map(point => ({
            time: point.time,
            value: 0
        }));
        
        this.zeroLineSeries.setData(zeroLineData);
    }

    /**
     * Get histogram color based on value and trend
     */
    getHistogramColor(value, prevValue) {
        if (value > 0) {
            return value > prevValue ? 'rgba(0, 230, 118, 0.8)' : 'rgba(34, 138, 34, 0.8)';
        } else {
            return value > prevValue ? 'rgba(255, 82, 82, 0.8)' : 'rgba(139, 0, 0, 0.8)';
        }
    }

    /**
     * Remove BX histogram from chart
     */
    removeBXHistogram() {
        if (!this.isActive) {
            return;
        }

        try {
            // Remove series
            if (this.histogramSeries) {
                this.chart.removeSeries(this.histogramSeries);
                this.histogramSeries = null;
            }
            
            if (this.zeroLineSeries) {
                this.chart.removeSeries(this.zeroLineSeries);
                this.zeroLineSeries = null;
            }
            
            // Remove chart container
            if (this.chartContainer && this.chartContainer.parentElement) {
                this.chartContainer.parentElement.removeChild(this.chartContainer);
                this.chartContainer = null;
            }
            
            // Dispose of chart
            if (this.chart) {
                this.chart.remove();
                this.chart = null;
            }
            
            this.isActive = false;
            
            console.log('BX Histogram removed successfully');
            
        } catch (error) {
            console.error('Error removing BX histogram:', error);
        }
    }

    /**
     * Toggle BX histogram
     */
    toggleBXHistogram(data, options = {}) {
        if (this.isActive) {
            this.removeBXHistogram();
            return false;
        } else {
            this.addBXHistogram(data, options);
            return true;
        }
    }

    /**
     * Update BX histogram with new data
     */
    updateBXHistogram(data, options = {}) {
        if (!this.isActive) {
            return;
        }

        this.removeBXHistogram();
        this.addBXHistogram(data, options);
    }

    /**
     * Check if histogram is active
     */
    isHistogramActive() {
        return this.isActive;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TechnicalAnalysisUtils,
        BXHistogramCalculator,
        BXHistogramManager
    };
} 