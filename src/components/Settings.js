import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert
} from '@mui/material';
import { getExchangeRateURL, setExchangeRateURL, DEFAULT_EXCHANGE_RATE_URL } from '../utils/currencyConverter';
import PageLayout from './common/PageLayout';

// Component allows users to configure exchange rate API endpoint
// Settings are persisted in localStorage for future sessions
function Settings() {
    // State for URL input, validation feedback, and save confirmation
    // Tracks user input and provides visual feedback on actions
    const [url, setUrl] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    // Loads current URL from localStorage on component mount
    useEffect(function() {
        const currentUrl = getExchangeRateURL();
        setUrl(currentUrl);
    }, []);


    // Validates and saves the exchange rate URL to localStorage
    // Checks URL format and provides error feedback if invalid
    const handleSubmit = function(event) {
        event.preventDefault();
        setError('');
        setSuccess(false);

        if (!url.trim()) {
            setError('Please enter a valid URL');
            return;
        }
        
        try {
            new URL(url);
            setExchangeRateURL(url.trim());
            setSuccess(true);
    
            setTimeout(function() {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError('Please enter a valid URL');
        }
    };

    // Resets URL to default server endpoint
    // Restores original configuration and saves to localStorage
    const handleReset = function() {
        setUrl(DEFAULT_EXCHANGE_RATE_URL);
        setExchangeRateURL(DEFAULT_EXCHANGE_RATE_URL);
        setSuccess(true);
        setTimeout(function() {
            setSuccess(false);
        }, 3000);
    };

    return (
        <PageLayout 
            title="Settings"
            subtitle="Configure currency exchange rate source"
            maxWidth="sm"
        >
            <Typography 
                variant="body2" 
                sx={{ 
                    color: '#6B5B58',
                    mb: 4,
                    lineHeight: 1.7
                }}
            >
                Configure the URL for fetching currency exchange rates. The URL should return a JSON object
                with the following structure: {'{"USD":1, "GBP":0.6, "EURO":0.7, "ILS":3.4}'}
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    Settings saved successfully!
                </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Exchange Rate URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    margin="normal"
                    required
                    placeholder="https://example.com/exchange-rates.json"
                    helperText="Enter a valid URL that returns exchange rates in JSON format"
                    sx={{ mb: 4 }}
                />
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        sx={{
                            borderColor: '#C1DBE8',
                            color: '#43302E',
                            '&:hover': {
                                borderColor: '#9BC4D3',
                                backgroundColor: 'rgba(193, 219, 232, 0.1)'
                            }
                        }}
                    >
                        Reset to Default
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#43302E',
                            color: '#FFFFFF',
                            px: 4,
                            '&:hover': {
                                backgroundColor: '#2A1F1D'
                            }
                        }}
                    >
                        Save Settings
                    </Button>
                </Box>
            </Box>
        </PageLayout>
    );
}

export default Settings;
