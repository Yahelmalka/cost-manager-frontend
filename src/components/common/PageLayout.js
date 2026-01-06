import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryCard from './PrimaryCard';

// Reusable page layout component with centered title and content card
// Provides consistent structure across all application pages
function PageLayout({ title, subtitle, children, maxWidth = 'md' }) {
    return (
        <Box sx={{ py: 4, px: 2 }}>
            {/* Centered page title with elegant serif font styling */}
            {/* Uses Playfair Display for premium editorial appearance */}
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
            {/* Content wrapped in primary card with specified max width */}
            {/* Ensures consistent card styling and responsive layout */}
            <PrimaryCard maxWidth={maxWidth}>
                {children}
            </PrimaryCard>
        </Box>
    );
}

export default PageLayout;

