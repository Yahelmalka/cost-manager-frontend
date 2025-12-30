/**
 * Main App component
 * Cost Manager Application
 */

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

/**
 * TabPanel component for rendering tab content
 * @param {Object} props - Component props
 */
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

/**
 * Main App component
 */
function App() {
    const [db, setDb] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    /**
     * Initializes the database
     */
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

    /**
     * Handles tab change
     * @param {Event} event - Change event
     * @param {number} newValue - New tab index
     */
    const handleTabChange = function(event, newValue) {
        setTabValue(newValue);
    };

    /**
     * Handles cost added callback
     */
    const handleCostAdded = function() {
        setRefreshKey(function(prev) {
            return prev + 1;
        });
    };

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

