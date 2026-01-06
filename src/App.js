import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    CircularProgress
} from '@mui/material';
import { openCostsDB } from './lib/idb';
import AppHeader from './components/common/AppHeader';
import AddCost from './components/AddCost';
import Report from './components/Report';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';
import Settings from './components/Settings';

const DATABASE_NAME = 'CostManagerDB';
const DATABASE_VERSION = 1;

// Wrapper component for tab panel content
// Manages visibility of tab content based on selected tab index
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}


// Main application component with tab-based navigation
// Manages database connection and coordinates all page components
function App() {
    // State for database instance, active tab, and refresh trigger
    // Refresh key forces child components to reload when costs are added
    const [db, setDb] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);


    // Initializes IndexedDB connection on component mount
    // Opens database and stores reference for child components
    useEffect(function() {
        async function initDB() {
            try {
                const database = await openCostsDB(DATABASE_NAME, DATABASE_VERSION);
                setDb(database);
            } catch (error) {
                console.error('Failed to initialize database:', error);
            }
        }
        initDB();
    }, []);

    // Handles tab navigation when user clicks different tabs
    // Updates active tab index to show corresponding content
    const handleTabChange = function(event, newValue) {
        setTabValue(newValue);
    };

    // Callback triggered when new cost is added
    // Increments refresh key to force charts and reports to reload
    const handleCostAdded = function() {
        setRefreshKey(function(prev) {
            return prev + 1;
        });
    };

    // Show loading screen while database initializes
    // Prevents rendering components before database is ready
    if (!db) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#FAFAF7'
            }}>
                <CircularProgress sx={{ color: '#43302E', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#43302E' }}>
                    Loading database...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            flexGrow: 1, 
            minHeight: '100vh',
            backgroundColor: '#FAFAF7'
        }}>
            <AppHeader />
            
            {/* Navigation tabs container with pastel styling */}
            {/* Provides access to all main application sections */}
            <Box sx={{ 
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid rgba(193, 219, 232, 0.3)'
            }}>
                <Container maxWidth="xl">
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="navigation tabs"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FFF1B5',
                                height: 3
                            }
                        }}
                    >
                        <Tab label="Add Cost" />
                        <Tab label="Report" />
                        <Tab label="Pie Chart" />
                        <Tab label="Bar Chart" />
                        <Tab label="Settings" />
                    </Tabs>
                </Container>
            </Box>
            
            {/* Conditionally render page components based on active tab */}
            {/* Refresh key forces reload when new costs are added */}
            <TabPanel value={tabValue} index={0}>
                <AddCost db={db} onCostAdded={handleCostAdded} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
                <Report db={db} key={refreshKey} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
                <PieChart db={db} key={refreshKey} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
                <BarChart db={db} key={refreshKey} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
                <Settings />
            </TabPanel>
        </Box>
    );
}

export default App;

