export function openCostsDB(databaseName, databaseVersion) {
    return new Promise(function(resolve, reject) {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onerror = function() {
            reject(new Error('Failed to open database: ' + request.error));
        };

        request.onsuccess = function() {
            const db = request.result;
            resolve({
                db: db,
                addCost: function(cost) {
                    return addCost(db, cost);
                },
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

function addCost(db, cost) {
    return new Promise(function(resolve, reject) {
        if (!cost || typeof cost.sum !== 'number' || 
            typeof cost.currency !== 'string' || 
            typeof cost.category !== 'string' || 
            typeof cost.description !== 'string') {
            reject(new Error('Invalid cost object. Must have sum (number), currency (string), category (string), and description (string)'));
            return;
        }

        const transaction = db.transaction(['costs'], 'readwrite');
        const objectStore = transaction.objectStore('costs');

        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1; // JavaScript months are 0-indexed
        const year = now.getFullYear();

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

function getReport(db, year, month, currency) {
    return new Promise(function(resolve, reject) {
        const transaction = db.transaction(['costs'], 'readonly');
        const objectStore = transaction.objectStore('costs');
        const index = objectStore.index('yearMonth');
        
        const range = IDBKeyRange.only([year, month]);
        const request = index.getAll(range);
        
        request.onerror = function() {
            reject(new Error('Failed to get report: ' + request.error));
        };
        
        request.onsuccess = function() {
            const costs = request.result;
            const reportCosts = costs.map(function(cost) {
                return {
                    sum: cost.sum,
                    currency: cost.currency,
                    category: cost.category,
                    description: cost.description,
                    Date: cost.Date
                };
            });

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
                    total: total 
                }
            };
            
            resolve(report);
        };
    });
}

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

