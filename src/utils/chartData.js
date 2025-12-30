import { convertCurrency } from './currencyConverter';

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

export function prepareBarChartData(costs, targetCurrency, exchangeRates) {
    const monthTotals = {};

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

