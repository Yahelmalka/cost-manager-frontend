import { convertCurrency } from './currencyConverter';

// Prepares data for pie chart by grouping costs by category
// Converts all amounts to target currency and sums by category
export function preparePieChartData(costs, targetCurrency, exchangeRates) {
    const categoryTotals = {};
    
    // Iterate through costs, convert currency, and accumulate by category
    // Each cost is converted to target currency before adding to category total
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
    
    // Transform category totals into array format for Recharts
    // Rounds values to 2 decimal places for currency precision
    return Object.keys(categoryTotals).map(function(category) {
        return {
            name: category,
            value: Math.round(categoryTotals[category] * 100) / 100
        };
    });
}

// Prepares data for bar chart by grouping costs by month
// Converts all amounts to target currency and sums by month
export function prepareBarChartData(costs, targetCurrency, exchangeRates) {
    const monthTotals = {};

    // Initialize all 12 months with zero values
    // Ensures all months appear on chart even with no expenses
    for (let i = 1; i <= 12; i++) {
        monthTotals[i] = 0;
    }
    
    // Convert each cost to target currency and add to corresponding month
    // Uses cost.month property to determine which month total to update
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
    
    // Transform month totals into array format for Recharts
    // Maps month numbers to abbreviated month names
    return Object.keys(monthTotals).map(function(month) {
        return {
            name: monthNames[parseInt(month) - 1],
            value: Math.round(monthTotals[month] * 100) / 100
        };
    });
}

