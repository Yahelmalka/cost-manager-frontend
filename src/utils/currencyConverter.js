/**
 * Currency conversion utility
 * Handles fetching exchange rates and converting between currencies
 */

// Default to local file, but can be overridden in settings
const DEFAULT_EXCHANGE_RATE_URL = '/exchange-rates.json';
const SUPPORTED_CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

/**
 * Fetches exchange rates from the configured URL
 * @param {string} url - URL to fetch exchange rates from
 * @returns {Promise<Object>} Promise that resolves to exchange rates object
 */
export async function fetchExchangeRates(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        
        // Handle different API response formats
        // Expected format: {"USD":1, "GBP":0.6, "EURO":0.7, "ILS":3.4}
        if (data.USD !== undefined && data.GBP !== undefined && 
            data.EURO !== undefined && data.ILS !== undefined) {
            return data;
        }
        
        // Handle exchangerate-api.com format
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
        // Return default rates as fallback
        return {
            USD: 1,
            ILS: 3.4,
            GBP: 0.6,
            EURO: 0.7
        };
    }
}

/**
 * Converts an amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Object} exchangeRates - Exchange rates object
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    // Convert to USD first, then to target currency
    // If exchange rates show: ILS 3.4 = USD 1, then 1 ILS = 1/3.4 USD
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Convert to USD: amount / fromRate
    // Convert from USD to target: (amount / fromRate) * toRate
    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Gets the default exchange rate URL from localStorage or returns default
 * @returns {string} Exchange rate URL
 */
export function getExchangeRateURL() {
    const stored = localStorage.getItem('exchangeRateURL');
    return stored || DEFAULT_EXCHANGE_RATE_URL;
}

/**
 * Saves the exchange rate URL to localStorage
 * @param {string} url - Exchange rate URL to save
 */
export function setExchangeRateURL(url) {
    localStorage.setItem('exchangeRateURL', url);
}

export { SUPPORTED_CURRENCIES, DEFAULT_EXCHANGE_RATE_URL };

