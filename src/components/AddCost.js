import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    Alert
} from '@mui/material';
import { SUPPORTED_CURRENCIES } from '../utils/currencyConverter';
import PageLayout from './common/PageLayout';

const CATEGORIES = [
    'Food',
    'Transportation',
    'Education',
    'Entertainment',
    'Health',
    'Shopping',
    'Bills',
    'Other'
];

function AddCost({ db, onCostAdded }) {
    const [sum, setSum] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async function(event) {
        event.preventDefault();
        setError('');
        setSuccess(false);
        const sumValue = parseFloat(sum);
        if (isNaN(sumValue) || sumValue <= 0) {
            setError('Please enter a valid positive number for the sum');
            return;
        }
        
        if (!description.trim()) {
            setError('Please enter a description');
            return;
        }
        
        setLoading(true);
        
        try {
            const costItem = {
                sum: sumValue,
                currency: currency,
                category: category,
                description: description.trim()
            };
            
            await db.addCost(costItem);

            setSum('');
            setDescription('');
            setSuccess(true);

            if (onCostAdded) {
                onCostAdded();
            }

            setTimeout(function() {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError('Failed to add cost: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout 
            title="Add New Cost Item"
            subtitle="Track your expenses by adding cost items with details"
            maxWidth="sm"
        >
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    Cost item added successfully!
                </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Sum"
                    type="number"
                    value={sum}
                    onChange={(e) => setSum(e.target.value)}
                    margin="normal"
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="Enter the amount spent"
                    sx={{ mb: 2 }}
                />
                
                <TextField
                    fullWidth
                    select
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    margin="normal"
                    required
                    helperText="Select the currency for this expense"
                    sx={{ mb: 2 }}
                >
                    {SUPPORTED_CURRENCIES.map(function(curr) {
                        return (
                            <MenuItem key={curr} value={curr}>
                                {curr}
                            </MenuItem>
                        );
                    })}
                </TextField>
                
                <TextField
                    fullWidth
                    select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    margin="normal"
                    required
                    helperText="Choose the expense category"
                    sx={{ mb: 2 }}
                >
                    {CATEGORIES.map(function(cat) {
                        return (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        );
                    })}
                </TextField>
                
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    required
                    multiline
                    rows={3}
                    helperText="Provide a brief description of the expense"
                    sx={{ mb: 3 }}
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        backgroundColor: '#43302E',
                        color: '#FFFFFF',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: '#2A1F1D'
                        }
                    }}
                >
                    {loading ? 'Adding...' : 'Add Cost Item'}
                </Button>
            </Box>
        </PageLayout>
    );
}

export default AddCost;
