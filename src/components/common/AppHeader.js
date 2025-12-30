import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
function AppHeader() {
    return (
        <AppBar 
            position="static" 
            elevation={0}
            sx={{
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid rgba(193, 219, 232, 0.3)',
                color: '#43302E'
            }}
        >
            <Toolbar 
                sx={{ 
                    minHeight: { xs: 64, sm: 64 },
                    justifyContent: 'center'
                }}
            >
                <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                        fontFamily: '"Playfair Display", "Cormorant Garamond", "Libre Baskerville", serif',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        color: '#43302E',
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                        textAlign: 'center'
                    }}
                >
                    Cost Manager
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;

