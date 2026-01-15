// javascript
import { fetchExchangeRates, getExchangeRateURL } from '../utils/currencyConverter';

// Opens IndexedDB database and returns promise with database wrapper object
// Creates database schema on first run with object store and indexes
export function openCostsDB(databaseName, databaseVersion) {
    return new Promise(function(resolve, reject) {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onerror = function() {
            reject(new Error('Failed to open database: ' + request.error));
        };

        // Returns database wrapper with methods for cost operations
        // Provides interface for adding costs and querying by date/category
        request.onsuccess = function() {
            const db = request.result;
            resolve({
                db: db,
                addCost: function(cost) {
                    return addCost(db, cost);
                },
                // updated signature: no exchangeRates param required
                getReport: function(year, month, currency) {
                    return getReport(db, year, month, currency);
                },
                getAllCosts: function() {
                    return getAllCosts(db);
                },
                getCostsByYearMonth: function(year, month) {
                    return getCostsByYearMonth(db, year, month);
                },
                getCostsByYear: function(year) {
                    return getCostsByYear(db, year);
                }
            });
        };

        // Creates database schema on first initialization
        // Sets up object store with auto-increment ID and indexes for queries
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('costs')) {
                const objectStore = db.createObjectStore('costs', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                objectStore.createIndex('year', 'year', { unique: false });
                objectStore.createIndex('month', 'month', { unique: false });
                objectStore.createIndex('yearMonth', ['year', 'month'], { unique: false });
                objectStore.createIndex('category', 'category', { unique: false });
            }
        };
    });
}

// Adds new cost item to database with validation and date handling
// Uses provided date or falls back to current date if not specified
function addCost(db, cost) {
    return new Promise(function(resolve, reject) {
        // Validates cost object has required fields with correct types
        // Ensures data integrity before database insertion
        if (!cost || typeof cost.sum !== 'number' ||
            typeof cost.currency !== 'string' ||
            typeof cost.category !== 'string' ||
            typeof cost.description !== 'string') {
            reject(new Error('Invalid cost object. Must have sum (number), currency (string), category (string), and description (string)'));
            return;
        }

        const transaction = db.transaction(['costs'], 'readwrite');
        const objectStore = transaction.objectStore('costs');

        // Uses provided date or current date as fallback
        // Extracts day, month, and year for database storage
        const now = new Date();
        const day = cost.day !== undefined ? cost.day : now.getDate();
        const month = cost.month !== undefined ? cost.month : (now.getMonth() + 1);
        const year = cost.year !== undefined ? cost.year : now.getFullYear();

        const costItem = {
            sum: cost.sum,
            currency: cost.currency,
            category: cost.category,
            description: cost.description,
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            Date: { day: now.getDate() }
        };

        const request = objectStore.add(costItem);

        request.onerror = function() {
            reject(new Error('Failed to add cost: ' + request.error));
        };

        // Returns added cost item without database ID
        // Provides confirmation of successful insertion
        request.onsuccess = function() {
            resolve({
                sum: costItem.sum,
                currency: costItem.currency,
                category: costItem.category,
                description: costItem.description
            });
        };
    });
}

// Converts currency amount using exchange rates
// Helper function for currency conversion in getReport
function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;
    return Math.round(convertedAmount * 100) / 100;
}

// Retrieves monthly report with all costs for specified year and month
// Fetches exchange rates internally and converts all costs to the specified currency
function getReport(db, year, month, currency) {
    return new Promise(function(resolve, reject) {
        // Fetch exchange rates first
        const url = getExchangeRateURL();
        fetchExchangeRates(url).then(function(exchangeRates) {
            if (!exchangeRates || typeof exchangeRates !== 'object') {
                reject(new Error('Exchange rates must be provided for currency conversion'));
                return;
            }

            const transaction = db.transaction(['costs'], 'readonly');
            const objectStore = transaction.objectStore('costs');
            const index = objectStore.index('yearMonth');

            // Queries costs matching exact year and month combination
            // Uses composite index for optimal performance
            const range = IDBKeyRange.only([year, month]);
            const request = index.getAll(range);

            request.onerror = function() {
                reject(new Error('Failed to get report: ' + request.error));
            };

            // Transforms costs, converts to target currency, and calculates total
            // Returns report object with converted costs array and total amount
            request.onsuccess = function() {
                const costs = request.result;

                // Convert each cost to the target currency
                const reportCosts = costs.map(function(cost) {
                    const convertedSum = convertCurrency(
                        cost.sum,
                        cost.currency,
                        currency,
                        exchangeRates
                    );
                    return {
                        sum: convertedSum,
                        currency: currency,
                        category: cost.category,
                        description: cost.description,
                        Date: cost.Date
                    };
                });

                // Calculate total sum of all converted costs
                let total = 0;
                reportCosts.forEach(function(cost) {
                    total += cost.sum;
                });

                const report = {
                    year: year,
                    month: month,
                    costs: reportCosts,
                    total: {
                        currency: currency,
                        total: Math.round(total * 100) / 100
                    }
                };

                resolve(report);
            };
        }).catch(function(err) {
            reject(new Error('Failed to fetch exchange rates: ' + (err && err.message ? err.message : err)));
        });
    });
}

// Retrieves all cost items from database without filtering
// Used for comprehensive data retrieval and chart generation
function getAllCosts(db) {
    return new Promise(function(resolve, reject) {
        const transaction = db.transaction(['costs'], 'readonly');
        const objectStore = transaction.objectStore('costs');
        const request = objectStore.getAll();

        request.onerror = function() {
            reject(new Error('Failed to get costs: ' + request.error));
        };

        request.onsuccess = function() {
            resolve(request.result);
        };
    });
}

// Retrieves costs filtered by specific year and month
// Uses composite index for efficient date-based querying
function getCostsByYearMonth(db, year, month) {
    return new Promise(function(resolve, reject) {
        const transaction = db.transaction(['costs'], 'readonly');
        const objectStore = transaction.objectStore('costs');
        const index = objectStore.index('yearMonth');

        const range = IDBKeyRange.only([year, month]);
        const request = index.getAll(range);

        request.onerror = function() {
            reject(new Error('Failed to get costs: ' + request.error));
        };

        request.onsuccess = function() {
            resolve(request.result);
        };
    });
}

// Retrieves all costs for a specific year across all months
// Used for bar chart generation showing monthly totals
function getCostsByYear(db, year) {
    return new Promise(function(resolve, reject) {
        const transaction = db.transaction(['costs'], 'readonly');
        const objectStore = transaction.objectStore('costs');
        const index = objectStore.index('year');

        const range = IDBKeyRange.only(year);
        const request = index.getAll(range);

        request.onerror = function() {
            reject(new Error('Failed to get costs: ' + request.error));
        };

        request.onsuccess = function() {
            resolve(request.result);
        };
    });
}
