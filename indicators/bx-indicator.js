// B-Xtrender Indicator for TradingView Lightweight Charts
// Ported from TradingView: B-Xtrender @Puppytherapy v3
// Original: https://www.tradingview.com/script/YHZimEz8-B-Xtrender-Puppytherapy/

/**
 * Technical Analysis Utility Functions
 */
class TechnicalAnalysisUtils {
    /**
     * Calculate Exponential Moving Average (EMA)
     * @param {Array} data - Array of OHLCV data
     * @param {number} period - EMA period
     * @param {string} source - Source field (default: 'close')
     * @returns {Array} EMA values
     */
    static calculateEMA(data, period, source = 'close') {
        if (data.length < period) return [];
        
        const result = [];
        const multiplier = 2 / (period + 1);
        
        // First EMA value is SMA
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i][source];
        }
        const firstEMA = sum / period;
        result.push(firstEMA);
        
        // Calculate subsequent EMA values
        for (let i = period; i < data.length; i++) {
            const ema = (data[i][source] * multiplier) + (result[result.length - 1] * (1 - multiplier));
            result.push(ema);
        }
        
        return result;
    }

    /**
     * Calculate Relative Strength Index (RSI)
     * @param {Array} values - Array of values
     * @param {number} period - RSI period
     * @returns {Array} RSI values
     */
    static calculateRSI(values, period) {
        if (values.length < period + 1) return [];
        
        const result = [];
        let gains = 0;
        let losses = 0;
        
        // Calculate initial average gain and loss
        for (let i = 1; i <= period; i++) {
            const change = values[i] - values[i - 1];
            if (change > 0) {
                gains += change;
            } else {
                losses += Math.abs(change);
            }
        }
        
        let avgGain = gains / period;
        let avgLoss = losses / period;
        
        for (let i = period; i < values.length; i++) {
            const change = values[i] - values[i - 1];
            const gain = change > 0 ? change : 0;
            const loss = change < 0 ? Math.abs(change) : 0;
            
            // Smoothed moving average
            avgGain = (avgGain * (period - 1) + gain) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;
            
            const rs = avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));
            
            result.push(rsi);
        }
        
        return result;
    }

    /**
     * Calculate T3 Moving Average
     * @param {Array} values - Array of values
     * @param {number} period - T3 period
     * @returns {Array} T3 values
     */
    static calculateT3(values, period) {
        if (values.length < period * 6) return [];
        
        const b = 0.7;
        const c1 = -b * b * b;
        const c2 = 3 * b * b + 3 * b * b * b;
        const c3 = -6 * b * b - 3 * b - 3 * b * b * b;
        const c4 = 1 + 3 * b + b * b * b + 3 * b * b;
        
        // Convert values to the format expected by EMA calculation
        const valueData = values.map((value, index) => ({ close: value, time: index }));
        
        const xe1 = this.calculateEMA(valueData, period);
        const xe1Data = xe1.map((value, index) => ({ close: value, time: index }));
        
        const xe2 = this.calculateEMA(xe1Data, period);
        const xe2Data = xe2.map((value, index) => ({ close: value, time: index }));
        
        const xe3 = this.calculateEMA(xe2Data, period);
        const xe3Data = xe3.map((value, index) => ({ close: value, time: index }));
        
        const xe4 = this.calculateEMA(xe3Data, period);
        const xe4Data = xe4.map((value, index) => ({ close: value, time: index }));
        
        const xe5 = this.calculateEMA(xe4Data, period);
        const xe5Data = xe5.map((value, index) => ({ close: value, time: index }));
        
        const xe6 = this.calculateEMA(xe5Data, period);
        
        const result = [];
        const minLength = Math.min(xe3.length, xe4.length, xe5.length, xe6.length);
        
        for (let i = 0; i < minLength; i++) {
            const t3Value = c1 * (xe6[i] || 0) + c2 * (xe5[i] || 0) + c3 * (xe4[i] || 0) + c4 * (xe3[i] || 0);
            result.push(t3Value);
        }
        
        return result;
    }

    /**
     * Subtract two arrays element-wise
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array} Difference array
     */
    static subtractArrays(arr1, arr2) {
        const minLength = Math.min(arr1.length, arr2.length);
        const result = [];
        
        for (let i = 0; i < minLength; i++) {
            result.push(arr1[i] - arr2[i]);
        }
        
        return result;
    }
}

/**
 * B-Xtrender Indicator Calculator
 */
class BXIndicatorCalculator {
    constructor(config = {}) {
        this.config = {
            shortL1: config.shortL1 || 2,
            shortL2: config.shortL2 || 20,
            shortL3: config.shortL3 || 2,
            longL1: config.longL1 || 20,
            longL2: config.longL2 || 2,
            t3Period: config.t3Period || 5,
            ...config
        };
    }

    /**
     * Calculate B-Xtrender indicators
     * @param {Array} data - OHLCV data
     * @returns {Object} BX indicator data
     */
    calculate(data) {
        if (data.length < Math.max(this.config.shortL2, this.config.longL1) + 50) {
            return { shortTerm: [], longTerm: [], smoothed: [], signals: [] };
        }

        try {
            // Calculate short-term B-Xtrender
            const ema1 = TechnicalAnalysisUtils.calculateEMA(data, this.config.shortL1);
            const ema2 = TechnicalAnalysisUtils.calculateEMA(data, this.config.shortL2);
            
            // Align arrays (take the shorter length)
            const minLength = Math.min(ema1.length, ema2.length);
            const emaDiff = [];
            
            for (let i = 0; i < minLength; i++) {
                emaDiff.push(ema1[i] - ema2[i]);
            }
            
            const rsiData = TechnicalAnalysisUtils.calculateRSI(emaDiff, this.config.shortL3);
            const shortTermXtrender = rsiData.map(value => value - 50);
            
            // Calculate long-term B-Xtrender
            const longEma = TechnicalAnalysisUtils.calculateEMA(data, this.config.longL1);
            const longRsiData = TechnicalAnalysisUtils.calculateRSI(longEma, this.config.longL2);
            const longTermXtrender = longRsiData.map(value => value - 50);
            
            // Calculate T3 smoothed short-term
            const t3Smoothed = TechnicalAnalysisUtils.calculateT3(shortTermXtrender, this.config.t3Period);
            
            // Generate signals
            const signals = this.generateSignals(t3Smoothed);
            
            return {
                shortTerm: shortTermXtrender,
                longTerm: longTermXtrender,
                smoothed: t3Smoothed,
                signals: signals
            };
        } catch (error) {
            console.error('Error calculating BX indicator:', error);
            return { shortTerm: [], longTerm: [], smoothed: [], signals: [] };
        }
    }

    /**
     * Generate bull/bear switch signals
     * @param {Array} smoothedData - T3 smoothed data
     * @returns {Object} Bull and bear signals
     */
    generateSignals(smoothedData) {
        const bullSignals = [];
        const bearSignals = [];
        
        if (smoothedData.length < 3) {
            return { bull: bullSignals, bear: bearSignals };
        }
        
        for (let i = 2; i < smoothedData.length; i++) {
            const current = smoothedData[i];
            const previous = smoothedData[i - 1];
            const twoBefore = smoothedData[i - 2];
            
            // Bull signal: current > previous and previous < twoBefore
            if (current > previous && previous < twoBefore) {
                bullSignals.push({ index: i, value: current });
            }
            
            // Bear signal: current < previous and previous > twoBefore
            if (current < previous && previous > twoBefore) {
                bearSignals.push({ index: i, value: current });
            }
        }
        
        return { bull: bullSignals, bear: bearSignals };
    }

    /**
     * Convert indicator data to chart format
     * @param {Array} indicatorData - Raw indicator data
     * @param {Array} timeData - Time data from original OHLCV
     * @param {number} offset - Offset for alignment
     * @returns {Array} Chart-formatted data
     */
    formatForChart(indicatorData, timeData, offset = 0) {
        const result = [];
        
        for (let i = 0; i < indicatorData.length; i++) {
            const timeIndex = i + offset;
            if (timeIndex < timeData.length) {
                result.push({
                    time: timeData[timeIndex].time,
                    value: indicatorData[i]
                });
            }
        }
        
        return result;
    }
}

/**
 * B-Xtrender Indicator Manager
 */
class BXIndicatorManager {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.chart = null;
        this.bxSeries = new Map();
        this.isActive = false;
        this.calculator = new BXIndicatorCalculator();
        this.chartContainer = null;
        
        this.seriesConfigs = {
            shortTerm: {
                color: '#FF6B6B',
                lineWidth: 1,
                title: 'BX Short-term',
                style: 'histogram'
            },
            longTerm: {
                color: '#45B7D1',
                lineWidth: 3,
                title: 'BX Long-term',
                style: 'line'
            },
            smoothed: {
                color: '#4ECDC4',
                lineWidth: 2,
                title: 'BX Smoothed',
                style: 'line'
            }
        };
    }

    /**
     * Add B-Xtrender indicator to chart
     * @param {Array} data - OHLCV data
     * @param {Object} options - Display options
     */
    addBXIndicator(data, options = {}) {
        if (this.isActive) {
            return;
        }

        try {
            // Calculate BX indicator
            const bxData = this.calculator.calculate(data);
            
            // Create a separate chart container for the oscillator
            this.createOscillatorChart();

            // Add series based on options
            if (options.showShortTerm !== false) {
                this.addShortTermSeries(bxData.shortTerm, data);
            }
            
            if (options.showLongTerm !== false) {
                this.addLongTermSeries(bxData.longTerm, data);
            }
            
            if (options.showSmoothed !== false) {
                this.addSmoothedSeries(bxData.smoothed, data);
            }
            
            // Add zero line
            this.addZeroLine(data);
            
            this.isActive = true;
            
            console.log('BX Indicator added successfully');
            
        } catch (error) {
            console.error('Error adding BX indicator:', error);
        }
    }

    /**
     * Create separate chart for oscillator
     */
    createOscillatorChart() {
        // Create container div
        this.chartContainer = document.createElement('div');
        this.chartContainer.id = 'bx-oscillator-chart';
        this.chartContainer.style.width = '100%';
        this.chartContainer.style.height = '200px';
        this.chartContainer.style.marginTop = '10px';
        this.chartContainer.style.border = '1px solid #ddd';
        this.chartContainer.style.borderRadius = '4px';
        
        // Add title
        const title = document.createElement('div');
        title.textContent = 'B-Xtrender Oscillator';
        title.style.padding = '8px';
        title.style.backgroundColor = '#f8f9fa';
        title.style.borderBottom = '1px solid #ddd';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        
        this.chartContainer.appendChild(title);
        
        // Create chart div
        const chartDiv = document.createElement('div');
        chartDiv.id = 'bx-chart';
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
     * Add short-term histogram series
     */
    addShortTermSeries(shortTermData, originalData) {
        const config = this.seriesConfigs.shortTerm;
        
        // Create histogram series
        const series = this.chart.addSeries(LightweightCharts.HistogramSeries, {
            color: config.color,
            priceFormat: {
                type: 'volume',
                precision: 2,
                minMove: 0.01,
            },
            title: config.title
        });

        // Calculate offset for alignment
        const offset = originalData.length - shortTermData.length;
        const histogramData = this.calculator.formatForChart(shortTermData, originalData, offset);
        
        // Convert to histogram format with colors
        const coloredHistogramData = histogramData.map((point, index) => ({
            time: point.time,
            value: point.value,
            color: this.getHistogramColor(point.value, index > 0 ? histogramData[index - 1].value : 0)
        }));
        
        series.setData(coloredHistogramData);
        this.bxSeries.set('shortTerm', series);
    }

    /**
     * Add long-term line series
     */
    addLongTermSeries(longTermData, originalData) {
        const config = this.seriesConfigs.longTerm;
        
        const series = this.chart.addSeries(LightweightCharts.LineSeries, {
            color: config.color,
            lineWidth: config.lineWidth,
            priceFormat: {
                type: 'volume',
                precision: 2,
                minMove: 0.01,
            },
            title: config.title
        });

        const offset = originalData.length - longTermData.length;
        const lineData = this.calculator.formatForChart(longTermData, originalData, offset);
        
        series.setData(lineData);
        this.bxSeries.set('longTerm', series);
    }

    /**
     * Add smoothed line series
     */
    addSmoothedSeries(smoothedData, originalData) {
        const config = this.seriesConfigs.smoothed;
        
        const series = this.chart.addSeries(LightweightCharts.LineSeries, {
            color: config.color,
            lineWidth: config.lineWidth,
            priceFormat: {
                type: 'volume',
                precision: 2,
                minMove: 0.01,
            },
            title: config.title
        });

        const offset = originalData.length - smoothedData.length;
        const lineData = this.calculator.formatForChart(smoothedData, originalData, offset);
        
        series.setData(lineData);
        this.bxSeries.set('smoothed', series);
    }

    /**
     * Add zero line reference
     */
    addZeroLine(originalData) {
        const series = this.chart.addSeries(LightweightCharts.LineSeries, {
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

        // Create zero line data for the entire time range
        const zeroLineData = originalData.map(point => ({
            time: point.time,
            value: 0
        }));
        
        series.setData(zeroLineData);
        this.bxSeries.set('zeroLine', series);
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
     * Remove BX indicator from chart
     */
    removeBXIndicator() {
        if (!this.isActive) {
            return;
        }

        try {
            // Remove all series
            this.bxSeries.forEach((series, key) => {
                this.chart.removeSeries(series);
            });
            
            // Remove the chart container
            if (this.chartContainer && this.chartContainer.parentElement) {
                this.chartContainer.parentElement.removeChild(this.chartContainer);
                this.chartContainer = null;
            }
            
            // Dispose of the chart
            if (this.chart) {
                this.chart.remove();
                this.chart = null;
            }
            
            this.bxSeries.clear();
            this.isActive = false;
            
            console.log('BX Indicator removed successfully');
            
        } catch (error) {
            console.error('Error removing BX indicator:', error);
        }
    }

    /**
     * Toggle BX indicator
     */
    toggleBXIndicator(data, options = {}) {
        if (this.isActive) {
            this.removeBXIndicator();
            return false;
        } else {
            this.addBXIndicator(data, options);
            return true;
        }
    }

    /**
     * Update BX indicator with new data
     */
    updateBXIndicator(data, options = {}) {
        if (!this.isActive) {
            return;
        }

        this.removeBXIndicator();
        this.addBXIndicator(data, options);
    }

    /**
     * Check if indicator is active
     */
    isIndicatorActive() {
        return this.isActive;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TechnicalAnalysisUtils,
        BXIndicatorCalculator,
        BXIndicatorManager
    };
} 