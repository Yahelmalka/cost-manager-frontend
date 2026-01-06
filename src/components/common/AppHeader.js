import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
// Application header component with centered title
// Displays main application name with elegant serif typography
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
                {/* Centered app title with elegant serif font */}
                {/* Uses Playfair Display for premium brand appearance */}
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

