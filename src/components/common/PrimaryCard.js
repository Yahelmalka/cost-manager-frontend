import React from 'react';
import { Paper, Box } from '@mui/material';

// Reusable card component with consistent pastel minimal styling
// Provides uniform container for page content with soft shadows
function PrimaryCard({ children, sx = {}, maxWidth = 'md' }) {
    // Maps string maxWidth values to pixel values
    // Supports responsive sizing: sm, md, lg, xl or custom pixel values
    const maxWidthMap = {
        sm: 600,
        md: 800,
        lg: 1000,
        xl: 1200
    };
    
    const maxWidthValue = typeof maxWidth === 'string' ? maxWidthMap[maxWidth] : maxWidth;
    
    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                maxWidth: maxWidthValue || maxWidth,
                mx: 'auto',
                backgroundColor: '#FFFFFF',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(67, 48, 46, 0.08)',
                ...sx
            }}
        >
            {children}
        </Paper>
    );
}

export default PrimaryCard;

