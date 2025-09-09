import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AppProvider, useApp } from './contexts/AppContext';
import Dashboard from './components/Dashboard';
import ProjectPlanning from './components/ProjectPlanning';
import ProjectMonitoring from './components/ProjectMonitoring';
import AIInsights from './components/AIInsights';
import ExecutiveReports from './components/ExecutiveReports';
import Settings from './components/Settings';
import Navigation from './components/Navigation';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#2c3e50',
            light: '#3c4c5e',
            dark: '#1c2a38',
          },
          secondary: {
            main: '#3498db',
            light: '#5faee3',
            dark: '#1d6fa5',
          },
          background: {
            default: '#f8f9fa',
            paper: '#ffffff',
          },
        }
      : {
          primary: {
            main: '#3498db',
            light: '#5faee3',
            dark: '#1d6fa5',
          },
          secondary: {
            main: '#2c3e50',
            light: '#3c4c5e',
            dark: '#1c2a38',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        }),
    success: {
      main: '#27ae60',
      light: '#52c47e',
      dark: '#1e7d45',
    },
    warning: {
      main: '#f39c12',
      light: '#f5b143',
      dark: '#aa6d09',
    },
    error: {
      main: '#e74c3c',
      light: '#ec7063',
      dark: '#a2352a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          border: '1px solid #eaeaea',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#2c3e50' : '#1c2a38',
        },
      },
    },
  },
});

function AppContent() {
  const { darkMode } = useApp();
  const theme = React.useMemo(() => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` } }}>
            <Box sx={{ mt: 8 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/planning" element={<ProjectPlanning />} />
                <Route path="/monitoring" element={<ProjectMonitoring />} />
                <Route path="/insights" element={<AIInsights />} />
                <Route path="/reports" element={<ExecutiveReports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
