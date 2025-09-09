import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import CustomBarChart from './BarChart';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectMonitoring = () => {
  const [tabValue, setTabValue] = useState(0);
  const { projects, updateProject, addProgress, addExpenditure, formatCurrency, calculateProjectKPIs } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [progressData, setProgressData] = useState({
    previousMonth: {
      actualWorkDone: '',
      escalationPercentage: '',
      vettedRevenue: '',
      amountReceived: ''
    },
    currentMonth: {
      workDone: '',
      escalationPercentage: '',
      vettedRevenue: '',
      amountReceived: ''
    },
    expenditures: {}
  });

  const [filters, setFilters] = useState({
    directorate: 'All',
    status: 'All'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };

  const handleProgressChange = (section, field, value) => {
    setProgressData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleExpenditureChange = (head, value) => {
    setProgressData(prev => ({
      ...prev,
      expenditures: {
        ...prev.expenditures,
        [head]: value
      }
    }));
  };

  const handleSaveProgress = () => {
    if (!selectedProjectId) return;

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    const previousMonth = progressData.previousMonth;
    const currentMonth = progressData.currentMonth;

    // Calculate values
    const escalationDuringMonth = (parseFloat(currentMonth.workDone) * parseFloat(currentMonth.escalationPercentage)) / 100;
    const uptoDateActualWorkDone = parseFloat(previousMonth.actualWorkDone) + parseFloat(currentMonth.workDone);
    const uptoDateEscalation = (parseFloat(previousMonth.actualWorkDone) * parseFloat(previousMonth.escalationPercentage) / 100) + escalationDuringMonth;
    const uptoDateActualRevenue = uptoDateActualWorkDone + uptoDateEscalation;
    const uptoDateVettedRevenue = parseFloat(previousMonth.vettedRevenue) + parseFloat(currentMonth.vettedRevenue);
    const uptoDateAmountReceived = parseFloat(previousMonth.amountReceived) + parseFloat(currentMonth.amountReceived);
    const uptoDateSlippage = uptoDateActualRevenue - uptoDateVettedRevenue;
    const uptoDateReceivable = uptoDateVettedRevenue - uptoDateAmountReceived;

    const progress = {
      date: new Date().toISOString(),
      previousMonth: {
        actualWorkDone: parseFloat(previousMonth.actualWorkDone),
        escalationPercentage: parseFloat(previousMonth.escalationPercentage),
        vettedRevenue: parseFloat(previousMonth.vettedRevenue),
        amountReceived: parseFloat(previousMonth.amountReceived)
      },
      currentMonth: {
        workDone: parseFloat(currentMonth.workDone),
        escalationPercentage: parseFloat(currentMonth.escalationPercentage),
        vettedRevenue: parseFloat(currentMonth.vettedRevenue),
        amountReceived: parseFloat(currentMonth.amountReceived)
      },
      calculations: {
        escalationDuringMonth,
        uptoDateActualWorkDone,
        uptoDateEscalation,
        uptoDateActualRevenue,
        uptoDateVettedRevenue,
        uptoDateAmountReceived,
        uptoDateSlippage,
        uptoDateReceivable
      },
      expenditures: progressData.expenditures
    };

    addProgress(selectedProjectId, progress);

    // Reset form
    setProgressData({
      previousMonth: {
        actualWorkDone: '',
        escalationPercentage: '',
        vettedRevenue: '',
        amountReceived: ''
      },
      currentMonth: {
        workDone: '',
        escalationPercentage: '',
        vettedRevenue: '',
        amountReceived: ''
      },
      expenditures: {}
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredProjects = projects.filter(project => {
    if (filters.directorate !== 'All' && project.directorate !== filters.directorate) return false;
    if (filters.status !== 'All' && project.status !== filters.status) return false;
    return true;
  });

  const expenditureHeads = [
    'Subcontractor Cost',
    'Material Cost',
    'Hiring Cost',
    'Engineer Facilities',
    'Pays & Allowances',
    'General Administration',
    'Other Costs'
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Monitoring
      </Typography>

      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project monitoring tabs">
          <Tab label="Update Progress" />
          <Tab label="Progress Tracking" />
          <Tab label="Financial Tracking" />
          <Tab label="KPIs Monitoring" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Project</InputLabel>
                <Select
                  value={selectedProjectId}
                  label="Select Project"
                  onChange={handleProjectChange}
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name} - {project.directorate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedProjectId && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Section 1: Previous Month Data
                  </Typography>
                  <TextField
                    fullWidth
                    label="Upto Date Actual Work Done Previous Month"
                    type="number"
                    value={progressData.previousMonth.actualWorkDone}
                    onChange={(e) => handleProgressChange('previousMonth', 'actualWorkDone', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Escalation Percentage Upto Previous Month (%)"
                    type="number"
                    value={progressData.previousMonth.escalationPercentage}
                    onChange={(e) => handleProgressChange('previousMonth', 'escalationPercentage', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Total Vetted Revenue Upto Previous Month"
                    type="number"
                    value={progressData.previousMonth.vettedRevenue}
                    onChange={(e) => handleProgressChange('previousMonth', 'vettedRevenue', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Total Amount Received Upto Previous Month"
                    type="number"
                    value={progressData.previousMonth.amountReceived}
                    onChange={(e) => handleProgressChange('previousMonth', 'amountReceived', e.target.value)}
                    margin="normal"
                  />

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Section 2: Current Month Data
                  </Typography>
                  <TextField
                    fullWidth
                    label="Work Done During Month"
                    type="number"
                    value={progressData.currentMonth.workDone}
                    onChange={(e) => handleProgressChange('currentMonth', 'workDone', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Escalation Percentage During Month (%)"
                    type="number"
                    value={progressData.currentMonth.escalationPercentage}
                    onChange={(e) => handleProgressChange('currentMonth', 'escalationPercentage', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Vetted Revenue During Month"
                    type="number"
                    value={progressData.currentMonth.vettedRevenue}
                    onChange={(e) => handleProgressChange('currentMonth', 'vettedRevenue', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Amount Received During Month"
                    type="number"
                    value={progressData.currentMonth.amountReceived}
                    onChange={(e) => handleProgressChange('currentMonth', 'amountReceived', e.target.value)}
                    margin="normal"
                  />

                  <Button
                    variant="contained"
                    onClick={handleSaveProgress}
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    Save Progress
                  </Button>
                </>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              {selectedProjectId && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Section 5: Expenditures
                  </Typography>
                  {expenditureHeads.map(head => (
                    <TextField
                      key={head}
                      fullWidth
                      label={head}
                      type="number"
                      value={progressData.expenditures[head] || ''}
                      onChange={(e) => handleExpenditureChange(head, e.target.value)}
                      margin="normal"
                    />
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Filter by Directorate</InputLabel>
                <Select
                  value={filters.directorate}
                  label="Filter by Directorate"
                  onChange={(e) => handleFilterChange('directorate', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="North">North</MenuItem>
                  <MenuItem value="Centre">Centre</MenuItem>
                  <MenuItem value="KPK">KPK</MenuItem>
                  <MenuItem value="Baluchistan">Baluchistan</MenuItem>
                  <MenuItem value="Sindh">Sindh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Filter by Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Progress Tracking
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>CA Value</TableCell>
                  <TableCell>Planned Revenue</TableCell>
                  <TableCell>Actual Revenue</TableCell>
                  <TableCell>Lag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map(project => {
                  const kpis = calculateProjectKPIs(project);
                  return (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{formatCurrency(project.caValue)}</TableCell>
                      <TableCell>{formatCurrency(kpis.plannedRevenue || 0)}</TableCell>
                      <TableCell>{formatCurrency(kpis.actualRevenue || 0)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatCurrency(kpis.lag || 0)} 
                          color={
                            kpis.lagRisk === 'Low' ? 'success' :
                            kpis.lagRisk === 'Moderate' ? 'warning' :
                            kpis.lagRisk === 'High' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Progress Comparison Chart
          </Typography>
          <CustomBarChart
            data={filteredProjects.map(project => {
              const kpis = calculateProjectKPIs(project);
              return {
                name: project.name,
                Planned: kpis.plannedRevenue || 0,
                Actual: kpis.actualRevenue || 0
              };
            })}
            title="Progress Comparison"
            xAxisKey="name"
            barKey={['Planned', 'Actual']}
            color={['#3498db', '#27ae60']}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Financial Tracking
          </Typography>
          <Alert severity="info">
            Detailed financial tracking features will be implemented soon.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            KPIs Monitoring
          </Typography>
          <Alert severity="info">
            KPIs monitoring features will be implemented soon.
          </Alert>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProjectMonitoring;
