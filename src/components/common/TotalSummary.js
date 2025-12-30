import React from 'react';
import { Box, Typography } from '@mui/material';

function TotalSummary({ total, currency, label, showInfo = false }) {
    const displayTotal = total || 0;
    const hasData = total > 0;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 241, 181, 0.45)',
                border: '1px solid rgba(67, 48, 46, 0.10)',
                borderRadius: 2,
                px: 2,
                py: 1.5,
                mb: 3,
                maxWidth: 420,
                mx: 'auto'
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: '#6B5B58',
                    mb: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    opacity: 0.8
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: '#43302E',
                    fontWeight: 500,
                    fontSize: '1.25rem',
                    lineHeight: 1.4
                }}
            >
                {displayTotal.toFixed(2)} {currency}
            </Typography>
            {!hasData && showInfo && (
                <Typography
                    variant="caption"
                    sx={{
                        color: '#6B5B58',
                        mt: 0.75,
                        fontSize: '0.7rem',
                        opacity: 0.6,
                        fontStyle: 'italic'
                    }}
                >
                    No costs found for this period
                </Typography>
            )}
        </Box>
    );
}

export default TotalSummary;

