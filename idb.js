// Vanilla JavaScript version of idb library for IndexedDB operations
// Wraps IndexedDB API with Promise-based interface for easier usage
(function() {
    'use strict';
    // Opens IndexedDB database and returns promise with database wrapper
    // Creates schema on first run with object store and indexes
    function openCostsDB(databaseName, databaseVersion) {
        return new Promise(function(resolve, reject) {
            const request = indexedDB.open(databaseName, databaseVersion);

            request.onerror = function() {
                reject(new Error('Failed to open database: ' + request.error));
            };

            // Returns database wrapper with addCost and getReport methods
            // Provides clean interface for cost management operations
            request.onsuccess = function() {
                const db = request.result;
         
                resolve({
                    db: db,
                    addCost: function(cost) {
                        return addCost(db, cost);
                    },
                    getReport: function(year, month, currency, exchangeRates) {
                        return getReport(db, year, month, currency, exchangeRates);
                    }
                });
            };

            // Creates database schema on first initialization
            // Sets up object store with auto-increment ID and query indexes
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


    // Adds new cost item to database with validation
    // Uses current date if no date is provided in cost object
    function addCost(db, cost) {
        return new Promise(function(resolve, reject) {
            // Validates cost object structure and field types
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

            // Extracts date components from current date or provided date
            // JavaScript months are 0-indexed, so add 1 for storage
            const now = new Date();
            const day = cost.day !== undefined ? cost.day : now.getDate();
            const month = cost.month !== undefined ? cost.month : (now.getMonth() + 1);
            const year = cost.year !== undefined ? cost.year : now.getFullYear();
            
            const costItem = {
                sum: cost.sum,
                currency: cost.currency,
                category: cost.category,
                description: cost.description,
                year: year,
                month: month,
                Date: {
                    day: day
                }
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

    // Retrieves monthly report with all costs for specified period
    // Converts all costs to the specified currency using exchange rates
    function getReport(db, year, month, currency, exchangeRates) {
        return new Promise(function(resolve, reject) {
            // Validate exchange rates are provided
            if (!exchangeRates || typeof exchangeRates !== 'object') {
                reject(new Error('Exchange rates must be provided for currency conversion'));
                return;
            }

            const transaction = db.transaction(['costs'], 'readonly');
            const objectStore = transaction.objectStore('costs');
            const index = objectStore.index('yearMonth');
            
            // Queries costs matching exact year and month combination
            // Composite index enables fast date-based filtering
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
        });
    }
    
    // Exposes idb object to global window for vanilla JavaScript usage
    // Allows library to be used without module system
    if (typeof window !== 'undefined') {
        window.idb = {
            openCostsDB: openCostsDB
        };
    }
})();

