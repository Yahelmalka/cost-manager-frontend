/**
 * Chart data utility functions
 * Prepares data for pie charts and bar charts
 */

import { convertCurrency } from './currencyConverter';

/**
 * Prepares data for pie chart showing costs by category for a specific month/year
 * @param {Array} costs - Array of cost items
 * @param {string} targetCurrency - Target currency for conversion
 * @param {Object} exchangeRates - Exchange rates object
 * @returns {Array} Array of objects with category and total for pie chart
 */
export function preparePieChartData(costs, targetCurrency, exchangeRates) {
    const categoryTotals = {};
    
    costs.forEach(function(cost) {
        const convertedAmount = convertCurrency(
            cost.sum, 
            cost.currency, 
            targetCurrency, 
            exchangeRates
        );
        
        if (!categoryTotals[cost.category]) {
            categoryTotals[cost.category] = 0;
        }
        categoryTotals[cost.category] += convertedAmount;
    });
    
    return Object.keys(categoryTotals).map(function(category) {
        return {
            name: category,
            value: Math.round(categoryTotals[category] * 100) / 100
        };
    });
}

/**
 * Prepares data for bar chart showing monthly costs for a year
 * @param {Array} costs - Array of cost items for the year
 * @param {string} targetCurrency - Target currency for conversion
 * @param {Object} exchangeRates - Exchange rates object
 * @returns {Array} Array of objects with month and total for bar chart
 */
export function prepareBarChartData(costs, targetCurrency, exchangeRates) {
    const monthTotals = {};
    
    // Initialize all months to 0
    for (let i = 1; i <= 12; i++) {
        monthTotals[i] = 0;
    }
    
    costs.forEach(function(cost) {
        const convertedAmount = convertCurrency(
            cost.sum, 
            cost.currency, 
            targetCurrency, 
            exchangeRates
        );
        
        monthTotals[cost.month] += convertedAmount;
    });
    
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return Object.keys(monthTotals).map(function(month) {
        return {
            name: monthNames[parseInt(month) - 1],
            value: Math.round(monthTotals[month] * 100) / 100
        };
    });
}

