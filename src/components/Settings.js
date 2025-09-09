import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  TextField
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const Settings = () => {
  const { darkMode, setDarkMode, currency, setCurrency, formatCurrency } = useApp();
  const [settings, setSettings] = useState({
    currency,
    darkMode,
    numberFormat: 'en-PK',
    dateFormat: 'dd/MM/yyyy',
    autoSave: true,
    apiKey: ''
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    setCurrency(settings.currency);
    setDarkMode(settings.darkMode);
    
    // Save other settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Card elevation={2} sx={{ p: 3 }}>
        {saveStatus && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {saveStatus}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Currency Format</InputLabel>
              <Select
                value={settings.currency}
                label="Currency Format"
                onChange={(e) => handleSettingChange('currency', e.target.value)}
              >
                <MenuItem value="PKR">PKR (₨ 1,000,000)</MenuItem>
                <MenuItem value="RsMn">Rs. Mn (₨ 1.00 Mn)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Number Format</InputLabel>
              <Select
                value={settings.numberFormat}
                label="Number Format"
                onChange={(e) => handleSettingChange('numberFormat', e.target.value)}
              >
                <MenuItem value="en-PK">1,000,000.00 (International)</MenuItem>
                <MenuItem value="ur-PK">۱٬۰۰۰٬۰۰۰٫۰۰ (Urdu)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.dateFormat}
                label="Date Format"
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              >
                <MenuItem value="dd/MM/yyyy">DD/MM/YYYY (31/12/2023)</MenuItem>
                <MenuItem value="MM/dd/yyyy">MM/DD/YYYY (12/31/2023)</MenuItem>
                <MenuItem value="yyyy-MM-dd">YYYY-MM-DD (2023-12-31)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleSettingChange('apiKey', e.target.value)}
              helperText="Enter your API key for AI insights"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                />
              }
              label="Auto Save Changes"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSaveSettings}
              startIcon={<SaveIcon />}
            >
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example Formatting
        </Typography>
        <Typography variant="body2" gutterBottom>
          Currency: {formatCurrency(1000000)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Number: {new Intl.NumberFormat(settings.numberFormat).format(1000000.50)}
        </Typography>
        <Typography variant="body2">
          Date: {new Date().toLocaleDateString(settings.numberFormat, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </Typography>
      </Card>
    </Box>
  );
};

export default Settings;
