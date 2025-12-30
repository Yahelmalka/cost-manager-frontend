import React from 'react';
import { Paper, Box } from '@mui/material';

/**
 * PrimaryCard component for consistent card styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.sx - Additional sx styles
 * @param {number} props.maxWidth - Maximum width (default: 'md')
 */
function PrimaryCard({ children, sx = {}, maxWidth = 'md' }) {
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

