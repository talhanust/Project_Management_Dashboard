import React, { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
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
  Paper
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

const ProjectPlanning = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const { projects, addProject, updateProject, selectedProject, addTarget, addBudget, formatCurrency } = useApp();
  
  const [projectData, setProjectData] = useState({
    name: '',
    directorate: '',
    category: '',
    location: '',
    scope: '',
    client: '',
    consultant: '',
    caValue: '',
    revisedCaValue: '',
    startDate: '',
    completionDate: '',
    revisedCompletionDate: '',
    status: 'Planning'
  });

  const [targetData, setTargetData] = useState({
    projectId: '',
    month: '',
    value: ''
  });

  const [budgetData, setBudgetData] = useState({
    projectId: '',
    tentativeEscalation: '',
    subcontractorCost: '',
    materialCost: '',
    engineerFacilityCost: '',
    hrCost: '',
    generalAdmCost: '',
    overheadCalculationMethod: 'percentage'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setTargetData({ ...targetData, [name]: value });
  };

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setBudgetData({ ...budgetData, [name]: value });
  };

  const handleSaveProject = () => {
    const project = {
      ...projectData,
      id: selectedProject?.id || `PROJ-${Date.now()}`,
      createdAt: selectedProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedProject) {
      updateProject(project);
    } else {
      addProject(project);
    }
    
    // Reset form
    setActiveStep(0);
    setProjectData({
      name: '',
      directorate: '',
      category: '',
      location: '',
      scope: '',
      client: '',
      consultant: '',
      caValue: '',
      revisedCaValue: '',
      startDate: '',
      completionDate: '',
      revisedCompletionDate: '',
      status: 'Planning'
    });
  };

  const handleAddTarget = () => {
    if (targetData.projectId && targetData.month && targetData.value) {
      addTarget(targetData.projectId, {
        month: targetData.month,
        value: parseFloat(targetData.value),
        createdAt: new Date().toISOString()
      });
      
      // Reset target form
      setTargetData({
        ...targetData,
        month: '',
        value: ''
      });
    }
  };

  const handleSaveBudget = () => {
    if (budgetData.projectId) {
      const budget = {
        tentativeEscalation: parseFloat(budgetData.tentativeEscalation || 0),
        subcontractorCost: parseFloat(budgetData.subcontractorCost || 0),
        materialCost: parseFloat(budgetData.materialCost || 0),
        engineerFacilityCost: parseFloat(budgetData.engineerFacilityCost || 0),
        hrCost: parseFloat(budgetData.hrCost || 0),
        generalAdmCost: parseFloat(budgetData.generalAdmCost || 0),
        overheadCalculationMethod: budgetData.overheadCalculationMethod,
        createdAt: new Date().toISOString()
      };
      
      addBudget(budgetData.projectId, budget);
    }
  };

  // Calculate budget totals
  const calculateBudgetTotals = (budget, project) => {
    const caValue = parseFloat(project?.caValue || 0);
    const tentativeEscalationAmount = caValue * (parseFloat(budget?.tentativeEscalation || 0) / 100);
    const totalPlannedRevenue = caValue + tentativeEscalationAmount;
    
    const totalDirectCost = parseFloat(budget?.subcontractorCost || 0) + 
                           parseFloat(budget?.materialCost || 0) + 
                           parseFloat(budget?.engineerFacilityCost || 0);
    
    let totalOverheadCost = 0;
    if (budget?.overheadCalculationMethod === 'percentage') {
      totalOverheadCost = caValue * 0.1; // Default 10% for example
    } else {
      totalOverheadCost = parseFloat(budget?.hrCost || 0) + parseFloat(budget?.generalAdmCost || 0);
    }
    
    const totalPlannedCost = totalDirectCost + totalOverheadCost;
    const plannedGrossProfit = totalPlannedRevenue - totalDirectCost;
    const plannedNetProfit = plannedGrossProfit - totalOverheadCost;
    
    return {
      totalPlannedRevenue,
      totalDirectCost,
      totalOverheadCost,
      totalPlannedCost,
      plannedGrossProfit,
      plannedNetProfit
    };
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Planning
      </Typography>

      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project planning tabs">
          <Tab label="Project Salients" />
          <Tab label="Planned Targets" />
          <Tab label="Planned Budget" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step><StepLabel>Basic Information</StepLabel></Step>
            <Step><StepLabel>Financial Details</StepLabel></Step>
            <Step><StepLabel>Timeline</StepLabel></Step>
            <Step><StepLabel>Review</StepLabel></Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="name"
                  value={projectData.name}
                  onChange={handleProjectChange}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Directorate</InputLabel>
                  <Select
                    name="directorate"
                    value={projectData.directorate}
                    label="Directorate"
                    onChange={handleProjectChange}
                  >
                    <MenuItem value="North">North</MenuItem>
                    <MenuItem value="Centre">Centre</MenuItem>
                    <MenuItem value="KPK">KPK</MenuItem>
                    <MenuItem value="Baluchistan">Baluchistan</MenuItem>
                    <MenuItem value="Sindh">Sindh</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={projectData.category}
                    label="Category"
                    onChange={handleProjectChange}
                  >
                    <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                    <MenuItem value="Building">Building</MenuItem>
                    <MenuItem value="Road">Road</MenuItem>
                    <MenuItem value="Bridge">Bridge</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Location (City)"
                  name="location"
                  value={projectData.location}
                  onChange={handleProjectChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Client"
                  name="client"
                  value={projectData.client}
                  onChange={handleProjectChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Consultant"
                  name="consultant"
                  value={projectData.consultant}
                  onChange={handleProjectChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Project Scope"
                  name="scope"
                  value={projectData.scope}
                  onChange={handleProjectChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CA Value"
                  name="caValue"
                  type="number"
                  value={projectData.caValue}
                  onChange={handleProjectChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Revised CA Value"
                  name="revisedCaValue"
                  type="number"
                  value={projectData.revisedCaValue}
                  onChange={handleProjectChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={projectData.status}
                    label="Status"
                    onChange={handleProjectChange}
                  >
                    <MenuItem value="Planning">Planning</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                    <MenuItem value="Transferred to Claims & Recovery">Transferred to Claims & Recovery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Planned Start Date"
                  name="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={handleProjectChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  fullWidth
                  label="Planned Completion Date"
                  name="completionDate"
                  type="date"
                  value={projectData.completionDate}
                  onChange={handleProjectChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Revised Completion Date"
                  name="revisedCompletionDate"
                  type="date"
                  value={projectData.revisedCompletionDate}
                  onChange={handleProjectChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Review your project details before saving
                </Alert>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Project Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Name:</strong> {projectData.name}</Typography>
                      <Typography><strong>Directorate:</strong> {projectData.directorate}</Typography>
                      <Typography><strong>Category:</strong> {projectData.category}</Typography>
                      <Typography><strong>Location:</strong> {projectData.location}</Typography>
                      <Typography><strong>Scope:</strong> {projectData.scope}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Client:</strong> {projectData.client}</Typography>
                      <Typography><strong>Consultant:</strong> {projectData.consultant}</Typography>
                      <Typography><strong>CA Value:</strong> {formatCurrency(projectData.caValue)}</Typography>
                      <Typography><strong>Revised CA Value:</strong> {formatCurrency(projectData.revisedCaValue)}</Typography>
                      <Typography><strong>Start Date:</strong> {projectData.startDate}</Typography>
                      <Typography><strong>Completion Date:</strong> {projectData.completionDate}</Typography>
                      <Typography><strong>Status:</strong> {projectData.status}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSaveProject}
                    startIcon={<SaveIcon />}
                  >
                    Save Project
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Project</InputLabel>
                <Select
                  name="projectId"
                  value={targetData.projectId}
                  label="Select Project"
                  onChange={handleTargetChange}
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name} - {project.directorate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {targetData.projectId && (
                <>
                  <TextField
                    fullWidth
                    label="Month"
                    name="month"
                    type="month"
                    value={targetData.month}
                    onChange={handleTargetChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Target Value"
                    name="value"
                    type="number"
                    value={targetData.value}
                    onChange={handleTargetChange}
                    margin="normal"
                    required
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTarget}
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Add Target
                  </Button>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {targetData.projectId && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Monthly Targets
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell align="right">Target Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projects.find(p => p.id === targetData.projectId)?.targets?.map((target, index) => (
                          <TableRow key={index}>
                            <TableCell>{target.month}</TableCell>
                            <TableCell align="right">{formatCurrency(target.value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Generate S-Curve
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Project</InputLabel>
                <Select
                  name="projectId"
                  value={budgetData.projectId}
                  label="Select Project"
                  onChange={handleBudgetChange}
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name} - {project.directorate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {budgetData.projectId && (
                <>
                  <TextField
                    fullWidth
                    label="Tentative Escalation (%)"
                    name="tentativeEscalation"
                    type="number"
                    value={budgetData.tentativeEscalation}
                    onChange={handleBudgetChange}
                    margin="normal"
                  />
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Direct Costs
                  </Typography>
                  <TextField
                    fullWidth
                    label="Subcontractor Cost"
                    name="subcontractorCost"
                    type="number"
                    value={budgetData.subcontractorCost}
                    onChange={handleBudgetChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Material Cost"
                    name="materialCost"
                    type="number"
                    value={budgetData.materialCost}
                    onChange={handleBudgetChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Engineer Facility Cost"
                    name="engineerFacilityCost"
                    type="number"
                    value={budgetData.engineerFacilityCost}
                    onChange={handleBudgetChange}
                    margin="normal"
                  />
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Overhead Costs
                  </Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Calculation Method</InputLabel>
                    <Select
                      name="overheadCalculationMethod"
                      value={budgetData.overheadCalculationMethod}
                      label="Calculation Method"
                      onChange={handleBudgetChange}
                    >
                      <MenuItem value="percentage">Percentage of CA Value</MenuItem>
                      <MenuItem value="detailed">Detailed Breakdown</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {budgetData.overheadCalculationMethod === 'detailed' && (
                    <>
                      <TextField
                        fullWidth
                        label="HR Cost"
                        name="hrCost"
                        type="number"
                        value={budgetData.hrCost}
                        onChange={handleBudgetChange}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        label="General Administration Cost"
                        name="generalAdmCost"
                        type="number"
                        value={budgetData.generalAdmCost}
                        onChange={handleBudgetChange}
                        margin="normal"
                      />
                    </>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={handleSaveBudget}
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    Save Budget
                  </Button>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {budgetData.projectId && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Budget Summary
                  </Typography>
                  {(() => {
                    const project = projects.find(p => p.id === budgetData.projectId);
                    const budget = project?.budget;
                    const totals = budget ? calculateBudgetTotals(budget, project) : null;
                    
                    return totals ? (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell><strong>Total Planned Revenue</strong></TableCell>
                              <TableCell align="right">{formatCurrency(totals.totalPlannedRevenue)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Total Direct Cost</strong></TableCell>
                              <TableCell align="right">{formatCurrency(totals.totalDirectCost)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Total Overhead Cost</strong></TableCell>
                              <TableCell align="right">{formatCurrency(totals.totalOverheadCost)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Total Planned Cost</strong></TableCell>
                              <TableCell align="right">{formatCurrency(totals.totalPlannedCost)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Planned Gross Profit</strong></TableCell>
                              <TableCell align="right">{formatCurrency(totals.plannedGrossProfit)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Planned Net Profit</strong></TableCell>
                              <TableCell align="right">{formatCurrency(totals.plannedNetProfit)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Planned Profit Margin</strong></TableCell>
                              <TableCell align="right">
                                {totals.totalPlannedRevenue > 0 
                                  ? `${((totals.plannedNetProfit / totals.totalPlannedRevenue) * 100).toFixed(2)}%` 
                                  : '0%'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info">No budget data available for this project.</Alert>
                    );
                  })()}
                </>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProjectPlanning;
