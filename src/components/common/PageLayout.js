import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryCard from './PrimaryCard';

/**
 * PageLayout component for consistent page structure
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional page subtitle
 * @param {React.ReactNode} props.children - Page content
 * @param {string|number} props.maxWidth - Maximum width for content
 */
function PageLayout({ title, subtitle, children, maxWidth = 'md' }) {
    return (
        <Box sx={{ py: 4, px: 2 }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    align="center"
                    sx={{ 
                        fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", serif',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        color: '#43302E',
                        mb: subtitle ? 2 : 4
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography 
                        variant="body1" 
                        align="center"
                        sx={{ 
                            color: '#6B5B58',
                            mb: 3
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <PrimaryCard maxWidth={maxWidth}>
                {children}
            </PrimaryCard>
        </Box>
    );
}

export default PageLayout;

