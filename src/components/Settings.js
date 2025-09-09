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
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import { sampleProjects } from '../data/sampleData';

const Settings = () => {
  const { darkMode, setDarkMode, currency, setCurrency, formatCurrency, resetToSampleData, deleteProject, projects } = useApp();
  const [settings, setSettings] = useState({
    currency,
    darkMode,
    numberFormat: 'en-PK',
    dateFormat: 'dd/MM/yyyy',
    autoSave: true,
    apiKey: ''
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

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

  const handleResetToSampleData = () => {
    resetToSampleData(sampleProjects);
    setConfirmOpen(false);
    setSaveStatus('Sample data loaded successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      setSaveStatus('Project deleted successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
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
              sx={{ mr: 2 }}
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

      <Card elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Project Management
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
          Manage your projects directly from settings.
        </Typography>
        
        {projects.length > 0 ? (
          <Box>
            {projects.map(project => (
              <Box 
                key={project.id} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {project.name}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip label={project.directorate} size="small" />
                    <Chip 
                      label={project.status} 
                      color={
                        project.status === 'Completed' ? 'success' :
                        project.status === 'In Progress' ? 'warning' : 'info'
                      }
                      size="small"
                    />
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => handleDeleteProject(project.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="info">No projects found. Create your first project in the Planning section.</Alert>
        )}
      </Card>

      <Card elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
          These actions are irreversible. Use with caution.
        </Typography>
        
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmOpen(true)}
          startIcon={<RefreshIcon />}
        >
          Reset to Sample Data
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          This will replace all current projects with sample data. Your settings will be preserved.
        </Typography>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all project data? This action cannot be undone.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            This will:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Replace all current projects with sample data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Clear any unsaved changes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Preserve your settings and preferences" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleResetToSampleData} color="error" variant="contained">
            Reset Data
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
