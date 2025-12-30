# Cost Manager Front-End Application

Final Project in Front-End Development

## Overview

This is a Cost Manager application built with React and Material-UI (MUI) that allows users to track their expenses, view detailed reports, and visualize spending patterns through charts.

## Features

1. **Add Cost Items**: Users can add new cost items with sum, currency, category, and description
2. **Monthly Reports**: Generate detailed reports for specific months and years in selected currencies
3. **Pie Chart**: Visualize costs by category for a specific month and year
4. **Bar Chart**: View total costs for each month in a selected year
5. **Currency Conversion**: Support for USD, ILS, GBP, and EURO with exchange rate conversion
6. **Settings**: Configure the URL for fetching currency exchange rates

## Technology Stack

- **React 18.2.0**: Front-end framework
- **Material-UI (MUI) 5.14.20**: UI component library
- **Recharts 2.10.3**: Charting library
- **IndexedDB**: Client-side database

## Project Structure

```
front_proj/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── exchange-rates.json (sample exchange rates)
├── src/
│   ├── components/
│   │   ├── AddCost.js
│   │   ├── Report.js
│   │   ├── PieChart.js
│   │   ├── BarChart.js
│   │   └── Settings.js
│   ├── lib/
│   │   └── idb.js (React module version)
│   ├── utils/
│   │   ├── currencyConverter.js
│   │   └── chartData.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── idb.js (vanilla version for testing)
├── test-idb.html (test file for idb.js)
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Database

The application uses IndexedDB to store cost items locally in the browser. The database name is `CostManagerDB` with version 1.

## Exchange Rates

The application fetches exchange rates from a configurable URL. By default, it uses a sample JSON file. Users can configure a custom URL in the Settings page.

Expected JSON format:
```json
{
  "USD": 1,
  "GBP": 0.6,
  "EURO": 0.7,
  "ILS": 3.4
}
```

## Testing idb.js

To test the vanilla version of idb.js, open `test-idb.html` in a web browser and check the browser console for test results.

## Deployment

The application can be deployed to any static hosting service (e.g., Render.com, Netlify, Vercel). 

### Steps for Deployment:

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

3. Ensure the exchange rates JSON file is accessible:
   - The `public/exchange-rates.json` file will be included in the build
   - It will be accessible at `/exchange-rates.json` after deployment
   - Users can configure a custom URL in the Settings page if needed

### Example Deployment on Render.com:

1. Create a new Static Site on Render
2. Connect your repository
3. Build command: `npm run build`
4. Publish directory: `build`
5. The site will be live at your Render URL

### Testing:

Before deployment, test locally:
1. Run `npm start` to start the development server
2. Open http://localhost:3000 in your browser
3. Test all features: adding costs, generating reports, viewing charts
4. Test the exchange rate URL configuration in Settings

## Browser Compatibility

The application is designed to work with modern web browsers, with primary testing on Google Chrome (latest version).

## License

This project is created for educational purposes as part of a Front-End Development course.

