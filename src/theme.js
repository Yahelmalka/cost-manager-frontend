import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#43302E', 
            light: '#6B5B58',
            dark: '#2A1F1D',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#C1DBE8', 
            light: '#E0F0F5',
            dark: '#9BC4D3',
            contrastText: '#43302E'
        },
        background: {
            default: '#FAFAF7', 
            paper: '#FFFFFF' 
        },
        text: {
            primary: '#43302E', 
            secondary: '#6B5B58' 
        },
        accent: {
            buttermilk: '#FFF1B5', 
            pastelBlue: '#C1DBE8',
            oldBurgundy: '#43302E'
        },
        error: {
            main: '#D32F2F',
            light: '#EF5350',
            dark: '#C62828'
        },
        success: {
            main: '#2E7D32',
            light: '#4CAF50',
            dark: '#1B5E20'
        },
        info: {
            main: '#C1DBE8',
            light: '#E0F0F5',
            dark: '#9BC4D3'
        },
        warning: {
            main: '#FFF1B5',
            light: '#FFF8DC',
            dark: '#FFE082'
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
        h1: {
            fontWeight: 700,
            color: '#43302E'
        },
        h2: {
            fontWeight: 700,
            color: '#43302E'
        },
        h3: {
            fontWeight: 600,
            color: '#43302E'
        },
        h4: {
            fontWeight: 600,
            color: '#43302E'
        },
        h5: {
            fontWeight: 600,
            color: '#43302E'
        },
        h6: {
            fontWeight: 600,
            color: '#43302E'
        },
        body1: {
            fontWeight: 400,
            color: '#43302E'
        },
        body2: {
            fontWeight: 400,
            color: '#6B5B58'
        },
        button: {
            fontWeight: 500,
            textTransform: 'none' 
        }
    },
    shape: {
        borderRadius: 16 
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    fontWeight: 500
                },
                contained: {
                    boxShadow: '0 2px 8px rgba(67, 48, 46, 0.15)',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(67, 48, 46, 0.25)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(67, 48, 46, 0.08)'
                },
                elevation3: {
                    boxShadow: '0 4px 16px rgba(67, 48, 46, 0.12)'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        '&:hover fieldset': {
                            borderColor: '#C1DBE8'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#43302E'
                        }
                    }
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    minHeight: 64,
                    color: '#6B5B58',
                    '&.Mui-selected': {
                        color: '#43302E',
                        fontWeight: 600
                    },
                    '&:hover': {
                        color: '#43302E',
                        backgroundColor: 'rgba(193, 219, 232, 0.1)'
                    }
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: '2px solid rgba(193, 219, 232, 0.3)'
                },
                indicator: {
                    height: 3,
                    backgroundColor: '#FFF1B5',
                    borderRadius: '3px 3px 0 0'
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12
                },
                standardSuccess: {
                    backgroundColor: '#F1F8E9',
                    color: '#2E7D32',
                    '& .MuiAlert-icon': {
                        color: '#2E7D32'
                    }
                },
                standardError: {
                    backgroundColor: '#FFEBEE',
                    color: '#C62828',
                    '& .MuiAlert-icon': {
                        color: '#C62828'
                    }
                },
                standardInfo: {
                    backgroundColor: '#E0F0F5',
                    color: '#43302E',
                    '& .MuiAlert-icon': {
                        color: '#43302E'
                    }
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FAFAF7',
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        color: '#43302E'
                    }
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 500
                }
            }
        }
    }
});

export default theme;

