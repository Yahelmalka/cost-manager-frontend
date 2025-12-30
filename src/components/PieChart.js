import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { SUPPORTED_CURRENCIES } from '../utils/currencyConverter';
import { fetchExchangeRates, getExchangeRateURL } from '../utils/currencyConverter';
import { preparePieChartData } from '../utils/chartData';
import PageLayout from './common/PageLayout';
import PrimaryCard from './common/PrimaryCard';
import TotalSummary from './common/TotalSummary';

const CHART_COLORS = [
    '#C1DBE8',
    '#FFF1B5',
    '#E8D5C4',
    '#D4C5E8',
    '#B5E8D1',
    '#E8C5B5',
    '#C5D4E8',
    '#E8D4B5'
];

function PieChart({ db }) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [currency, setCurrency] = useState('USD');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [exchangeRates, setExchangeRates] = useState(null);

    useEffect(function() {
        async function loadRates() {
            const url = getExchangeRateURL();
            const rates = await fetchExchangeRates(url);
            setExchangeRates(rates);
        }
        loadRates();
    }, []);

    const handleGenerateChart = async function() {
        if (!exchangeRates) {
            setError('Exchange rates not loaded yet. Please wait...');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const costs = await db.getCostsByYearMonth(year, month);
            
            if (costs.length === 0) {
                setChartData([]);
                setError('No costs found for this period');
                setLoading(false);
                return;
            }
            
            const data = preparePieChartData(costs, currency, exchangeRates);
            setChartData(data);
        } catch (err) {
            setError('Failed to generate chart: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const total = chartData.reduce(function(sum, item) {
        return sum + (item.value || 0);
    }, 0);
    
    const hasNoData = chartData.length === 0 && (error && error.includes('No costs'));

    return (
        <PageLayout 
            title="Costs by Category"
            subtitle="Visualize your spending breakdown by category for any month"
            maxWidth="lg"
        >
            <TotalSummary
                total={total}
                currency={currency}
                label="Total for selected period"
                showInfo={hasNoData}
            />
            
            <PrimaryCard sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#43302E' }}>
                    Chart Options
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <TextField
                        label="Year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        inputProps={{ min: 2000, max: 2100 }}
                        sx={{ minWidth: 120 }}
                    />
                    
                    <TextField
                        select
                        label="Month"
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        sx={{ minWidth: 180 }}
                    >
                        {months.map(function(monthName, index) {
                            return (
                                <MenuItem key={index + 1} value={index + 1}>
                                    {monthName}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                    
                    <TextField
                        select
                        label="Currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        sx={{ minWidth: 140 }}
                    >
                        {SUPPORTED_CURRENCIES.map(function(curr) {
                            return (
                                <MenuItem key={curr} value={curr}>
                                    {curr}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                    
                    <Button
                        variant="contained"
                        onClick={handleGenerateChart}
                        disabled={loading || !exchangeRates}
                        sx={{
                            backgroundColor: '#43302E',
                            color: '#FFFFFF',
                            px: 4,
                            '&:hover': {
                                backgroundColor: '#2A1F1D'
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Chart'}
                    </Button>
                </Box>
            </PrimaryCard>
            
            {error && (
                <Alert 
                    severity={error.includes('No costs') ? 'info' : 'error'} 
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    {error}
                </Alert>
            )}
            
            {chartData.length > 0 ? (
                <PrimaryCard>
                    <Box sx={{ width: '100%', height: 450, mt: 2 }}>
                        <ResponsiveContainer>
                            <RechartsPieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={function(entry) {
                                        return entry.name + ': ' + entry.value.toFixed(2) + ' ' + currency;
                                    }}
                                    outerRadius={140}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map(function(entry, index) {
                                        return (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={CHART_COLORS[index % CHART_COLORS.length]} 
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip 
                                    formatter={function(value) {
                                        return value.toFixed(2) + ' ' + currency;
                                    }}
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid rgba(193, 219, 232, 0.5)',
                                        borderRadius: 8,
                                        color: '#43302E'
                                    }}
                                />
                                <Legend 
                                    wrapperStyle={{
                                        paddingTop: '20px',
                                        fontSize: '14px',
                                        color: '#43302E'
                                    }}
                                />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </Box>
                </PrimaryCard>
            ) : !loading && !error && (
                <PrimaryCard>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" sx={{ color: '#6B5B58', mb: 1 }}>
                            No chart data available
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B5B58' }}>
                            Generate a chart to see your spending breakdown
                        </Typography>
                    </Box>
                </PrimaryCard>
            )}
        </PageLayout>
    );
}

export default PieChart;
