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
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SUPPORTED_CURRENCIES } from '../utils/currencyConverter';
import { fetchExchangeRates, getExchangeRateURL } from '../utils/currencyConverter';
import { prepareBarChartData } from '../utils/chartData';
import PageLayout from './common/PageLayout';
import PrimaryCard from './common/PrimaryCard';
import TotalSummary from './common/TotalSummary';

function BarChart({ db }) {
    const [year, setYear] = useState(new Date().getFullYear());
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
            const costs = await db.getCostsByYear(year);
            
            if (costs.length === 0) {
                setChartData([]);
                setError('No costs found for this year');
                setLoading(false);
                return;
            }
            
            const data = prepareBarChartData(costs, currency, exchangeRates);
            setChartData(data);
        } catch (err) {
            setError('Failed to generate chart: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const total = chartData.reduce(function(sum, item) {
        return sum + (item.value || 0);
    }, 0);
    
    const hasNoData = chartData.length === 0 && (error && error.includes('No costs'));

    return (
        <PageLayout 
            title="Monthly Costs by Year"
            subtitle="View your spending trends across all months in a year"
            maxWidth="lg"
        >
            <TotalSummary
                total={total}
                currency={currency}
                label="Total for selected year"
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
                            <RechartsBarChart data={chartData}>
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="rgba(193, 219, 232, 0.3)"
                                />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fill: '#43302E', fontSize: 12 }}
                                    axisLine={{ stroke: '#C1DBE8' }}
                                />
                                <YAxis 
                                    tick={{ fill: '#43302E', fontSize: 12 }}
                                    axisLine={{ stroke: '#C1DBE8' }}
                                />
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
                                        paddingTop: '10px',
                                        fontSize: '14px',
                                        color: '#43302E'
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#C1DBE8" 
                                    name={`Total (${currency})`}
                                    radius={[8, 8, 0, 0]}
                                />
                            </RechartsBarChart>
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
                            Generate a chart to see your monthly spending trends
                        </Typography>
                    </Box>
                </PrimaryCard>
            )}
        </PageLayout>
    );
}

export default BarChart;
