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
  Chip,
  Divider
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
  const [reportType, setReportType] = useState('overall');
  const [directorate, setDirectorate] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
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

  useEffect(() => {
    // Filter projects based on directorate selection
    if (directorate === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.directorate === directorate));
    }
  }, [directorate, projects]);

  useEffect(() => {
    // Load saved progress data if available
    const savedProgress = localStorage.getItem('progressData');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Save progress data to localStorage
    localStorage.setItem('progressData', JSON.stringify(progressData));
  }, [progressData]);

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
    const escalationDuringMonth = (parseFloat(currentMonth.workDone || 0) * parseFloat(currentMonth.escalationPercentage || 0)) / 100;
    const uptoDateActualWorkDone = parseFloat(previousMonth.actualWorkDone || 0) + parseFloat(currentMonth.workDone || 0);
    const uptoDateEscalation = ((parseFloat(previousMonth.actualWorkDone || 0) * parseFloat(previousMonth.escalationPercentage || 0)) / 100) + escalationDuringMonth;
    const uptoDateActualRevenue = uptoDateActualWorkDone + uptoDateEscalation;
    const uptoDateVettedRevenue = parseFloat(previousMonth.vettedRevenue || 0) + parseFloat(currentMonth.vettedRevenue || 0);
    const uptoDateAmountReceived = parseFloat(previousMonth.amountReceived || 0) + parseFloat(currentMonth.amountReceived || 0);
    const uptoDateSlippage = uptoDateActualRevenue - uptoDateVettedRevenue;
    const uptoDateReceivable = uptoDateVettedRevenue - uptoDateAmountReceived;

    const progress = {
      date: new Date().toISOString(),
      previousMonth: {
        actualWorkDone: parseFloat(previousMonth.actualWorkDone || 0),
        escalationPercentage: parseFloat(previousMonth.escalationPercentage || 0),
        vettedRevenue: parseFloat(previousMonth.vettedRevenue || 0),
        amountReceived: parseFloat(previousMonth.amountReceived || 0)
      },
      currentMonth: {
        workDone: parseFloat(currentMonth.workDone || 0),
        escalationPercentage: parseFloat(currentMonth.escalationPercentage || 0),
        vettedRevenue: parseFloat(currentMonth.vettedRevenue || 0),
        amountReceived: parseFloat(currentMonth.amountReceived || 0)
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

  const handleReportTypeChange = (e) => {
    const newReportType = e.target.value;
    setReportType(newReportType);
    
    // Reset selections when changing report type
    if (newReportType === 'overall') {
      setDirectorate('All');
    }
  };

  const handleDirectorateChange = (e) => {
    const newDirectorate = e.target.value;
    setDirectorate(newDirectorate);
  };

  const expenditureHeads = [
    'Subcontractor Cost',
    'Material Cost',
    'Hiring Cost',
    'Engineer Facilities',
    'Pays & Allowances',
    'General Administration',
    'Other Costs'
  ];

  const calculateRiskLevel = (value, thresholds, isPercentage = true) => {
    if (isPercentage) {
      if (value <= thresholds.low) return { level: 'Low', color: 'success' };
      if (value <= thresholds.moderate) return { level: 'Moderate', color: 'warning' };
      if (value <= thresholds.high) return { level: 'High', color: 'error' };
      return { level: 'Danger', color: 'error' };
    } else {
      // For absolute values, we need different logic
      // This is a placeholder - you'll need to implement based on your specific requirements
      return { level: 'Needs Analysis', color: 'default' };
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Monitoring
      </Typography>

      {/* Add the filter controls from ExecutiveReports */}
      <Card elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="overall">Overall Report</MenuItem>
                <MenuItem value="directorate">Directorate Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Directorate</InputLabel>
              <Select
                value={directorate}
                label="Directorate"
                onChange={handleDirectorateChange}
                disabled={reportType === 'overall'}
              >
                <MenuItem value="All">All Directorates</MenuItem>
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="Centre">Centre</MenuItem>
                <MenuItem value="KPK">KPK</MenuItem>
                <MenuItem value="Baluchistan">Baluchistan</MenuItem>
                <MenuItem value="Sindh">Sindh</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project monitoring tabs">
          <Tab label="Update Progress" />
          <Tab label="Progress Tracking" />
          <Tab label="Financial Tracking" />
          <Tab label="KPIs Monitoring" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Project</InputLabel>
                <Select
                  value={selectedProjectId}
                  label="Select Project"
                  onChange={handleProjectChange}
                >
                  <MenuItem value="">Select a Project</MenuItem>
                  {filteredProjects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name} - {project.directorate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {selectedProjectId && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
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
              </Grid>

              <Grid item xs={12} md={6}>
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

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Project Status
                </Typography>
                {selectedProjectId && (
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="body1">
                      <strong>Project:</strong> {projects.find(p => p.id === selectedProjectId)?.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Directorate:</strong> {projects.find(p => p.id === selectedProjectId)?.directorate}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Status:</strong> 
                      <Chip 
                        label={projects.find(p => p.id === selectedProjectId)?.status} 
                        color={
                          projects.find(p => p.id === selectedProjectId)?.status === 'Completed' ? 'success' :
                          projects.find(p => p.id === selectedProjectId)?.status === 'In Progress' ? 'warning' : 'info'
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Paper>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Section 3 & 4: Calculated Values
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  These values will be calculated automatically when you save the progress.
                </Alert>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Progress Tracking
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Directorate</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>CA Value</TableCell>
                  <TableCell>Planned Revenue</TableCell>
                  <TableCell>Actual Revenue</TableCell>
                  <TableCell>Lag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map(project => {
                  const kpis = calculateProjectKPIs(project);
                  const plannedRevenue = project.targets ? 
                    project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.directorate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={project.status} 
                          color={
                            project.status === 'Completed' ? 'success' :
                            project.status === 'In Progress' ? 'warning' :
                            project.status === 'Planning' ? 'info' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(project.caValue || 0)}</TableCell>
                      <TableCell>{formatCurrency(plannedRevenue)}</TableCell>
                      <TableCell>{formatCurrency(kpis.actualRevenue || 0)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatCurrency(plannedRevenue - (kpis.actualRevenue || 0))} 
                          color={
                            plannedRevenue > 0 ? 
                              ((plannedRevenue - (kpis.actualRevenue || 0)) / plannedRevenue * 100 <= 5 ? 'success' :
                              (plannedRevenue - (kpis.actualRevenue || 0)) / plannedRevenue * 100 <= 10 ? 'warning' :
                              (plannedRevenue - (kpis.actualRevenue || 0)) / plannedRevenue * 100 <= 15 ? 'error' : 'default')
                              : 'default'
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
              const plannedRevenue = project.targets ? 
                project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
              
              return {
                name: project.name,
                Planned: plannedRevenue,
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
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Financial Tracking - Section 1
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Directorate</TableCell>
                  <TableCell>CA Value</TableCell>
                  <TableCell>Actual Revenue</TableCell>
                  <TableCell>Vetted Revenue</TableCell>
                  <TableCell>Amount Received</TableCell>
                  <TableCell>Slippage</TableCell>
                  <TableCell>Receivable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map(project => {
                  const kpis = calculateProjectKPIs(project);
                  return (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.directorate}</TableCell>
                      <TableCell>{formatCurrency(project.caValue || 0)}</TableCell>
                      <TableCell>{formatCurrency(kpis.actualRevenue || 0)}</TableCell>
                      <TableCell>{formatCurrency(kpis.vettedRevenue || 0)}</TableCell>
                      <TableCell>{formatCurrency(kpis.amountReceived || 0)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatCurrency(kpis.slippage || 0)} 
                          color={
                            kpis.actualRevenue > 0 ? 
                              ((kpis.slippage || 0) / kpis.actualRevenue * 100 <= 5 ? 'success' :
                              (kpis.slippage || 0) / kpis.actualRevenue * 100 <= 10 ? 'warning' :
                              (kpis.slippage || 0) / kpis.actualRevenue * 100 <= 15 ? 'error' : 'default')
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatCurrency(kpis.receivable || 0)} 
                          color={
                            kpis.amountReceived > 0 ? 
                              ((kpis.receivable || 0) / kpis.amountReceived * 100 <= 5 ? 'success' :
                              (kpis.receivable || 0) / kpis.amountReceived * 100 <= 10 ? 'warning' :
                              (kpis.receivable || 0) / kpis.amountReceived * 100 <= 15 ? 'error' : 'default')
                              : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom>
            Financial Tracking - Section 2
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Directorate</TableCell>
                  <TableCell>CA Value</TableCell>
                  <TableCell>Actual Revenue</TableCell>
                  <TableCell>Expenditure</TableCell>
                  <TableCell>Cost Variance</TableCell>
                  <TableCell>Profitability</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map(project => {
                  const kpis = calculateProjectKPIs(project);
                  const totalExpenditure = Object.values(kpis.expenditures || {}).reduce((sum, val) => sum + (val || 0), 0);
                  const costVariance = (kpis.actualRevenue || 0) - totalExpenditure;
                  const profitability = totalExpenditure > 0 ? ((kpis.actualRevenue || 0) - totalExpenditure) / totalExpenditure * 100 : 0;
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.directorate}</TableCell>
                      <TableCell>{formatCurrency(project.caValue || 0)}</TableCell>
                      <TableCell>{formatCurrency(kpis.actualRevenue || 0)}</TableCell>
                      <TableCell>{formatCurrency(totalExpenditure)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatCurrency(costVariance)} 
                          color={costVariance >= 0 ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${profitability.toFixed(2)}%`} 
                          color={
                            profitability >= (project.plannedProfitability || 0) ? 'success' :
                            profitability >= (project.plannedProfitability || 0) * 0.92 ? 'warning' :
                            profitability >= (project.plannedProfitability || 0) * 0.85 ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            KPIs Monitoring
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Directorate</TableCell>
                  <TableCell>Lag</TableCell>
                  <TableCell>Scope Creep</TableCell>
                  <TableCell>Cost Variance</TableCell>
                  <TableCell>Profitability</TableCell>
                  <TableCell>Slippage</TableCell>
                  <TableCell>Receivable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map(project => {
                  const kpis = calculateProjectKPIs(project);
                  const plannedRevenue = project.targets ? 
                    project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
                  const lag = plannedRevenue - (kpis.actualRevenue || 0);
                  const lagPercentage = plannedRevenue > 0 ? (lag / plannedRevenue) * 100 : 0;
                  
                  const scopeCreep = (project.revisedCaValue || 0) - (project.caValue || 0);
                  const scopeCreepPercentage = project.caValue > 0 ? (scopeCreep / project.caValue) * 100 : 0;
                  
                  const totalExpenditure = Object.values(kpis.expenditures || {}).reduce((sum, val) => sum + (val || 0), 0);
                  const costVariance = (kpis.actualRevenue || 0) - totalExpenditure;
                  
                  const profitability = totalExpenditure > 0 ? ((kpis.actualRevenue || 0) - totalExpenditure) / totalExpenditure * 100 : 0;
                  
                  const slippagePercentage = kpis.actualRevenue > 0 ? ((kpis.slippage || 0) / kpis.actualRevenue) * 100 : 0;
                  const receivablePercentage = kpis.amountReceived > 0 ? ((kpis.receivable || 0) / kpis.amountReceived) * 100 : 0;

                  return (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.directorate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${formatCurrency(lag)} (${lagPercentage.toFixed(2)}%)`} 
                          color={
                            lagPercentage <= 5 ? 'success' :
                            lagPercentage <= 10 ? 'warning' :
                            lagPercentage <= 15 ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${formatCurrency(scopeCreep)} (${scopeCreepPercentage.toFixed(2)}%)`} 
                          color={
                            scopeCreepPercentage <= 10 ? 'success' :
                            scopeCreepPercentage <= 15 ? 'warning' :
                            scopeCreepPercentage <= 25 ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatCurrency(costVariance)} 
                          color={costVariance >= 0 ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${profitability.toFixed(2)}%`} 
                          color={
                            profitability >= (project.plannedProfitability || 0) ? 'success' :
                            profitability >= (project.plannedProfitability || 0) * 0.92 ? 'warning' :
                            profitability >= (project.plannedProfitability || 0) * 0.85 ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${formatCurrency(kpis.slippage || 0)} (${slippagePercentage.toFixed(2)}%)`} 
                          color={
                            slippagePercentage <= 5 ? 'success' :
                            slippagePercentage <= 10 ? 'warning' :
                            slippagePercentage <= 15 ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${formatCurrency(kpis.receivable || 0)} (${receivablePercentage.toFixed(2)}%)`} 
                          color={
                            receivablePercentage <= 5 ? 'success' :
                            receivablePercentage <= 10 ? 'warning' :
                            receivablePercentage <= 15 ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProjectMonitoring;
