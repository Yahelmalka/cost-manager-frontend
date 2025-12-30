const DEFAULT_EXCHANGE_RATE_URL = '/exchange-rates.json';
const SUPPORTED_CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

export async function fetchExchangeRates(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        if (data.USD !== undefined && data.GBP !== undefined && 
            data.EURO !== undefined && data.ILS !== undefined) {
            return data;
        }
 
        if (data.rates) {
            return {
                USD: 1,
                ILS: data.rates.ILS || 3.4,
                GBP: data.rates.GBP || 0.6,
                EURO: data.rates.EUR || 0.7
            };
        }
        
        throw new Error('Invalid exchange rate format');
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return {
            USD: 1,
            ILS: 3.4,
            GBP: 0.6,
            EURO: 0.7
        };
    }
}

export function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;

    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

export function getExchangeRateURL() {
    const stored = localStorage.getItem('exchangeRateURL');
    return stored || DEFAULT_EXCHANGE_RATE_URL;
}

export function setExchangeRateURL(url) {
    localStorage.setItem('exchangeRateURL', url);
}

export { SUPPORTED_CURRENCIES, DEFAULT_EXCHANGE_RATE_URL };

