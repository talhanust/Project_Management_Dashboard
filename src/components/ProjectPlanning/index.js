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
  Paper,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';

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
  const { addProject, updateProject, selectedProject } = useApp();
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
    status: 'Planning',
    targets: [],
    budget: {
      materials: 0,
      labor: 0,
      equipment: 0,
      subcontractors: 0,
      overhead: 0,
      contingency: 0
    }
  });

  const [targetData, setTargetData] = useState({
    month: '',
    physicalTarget: '',
    financialTarget: ''
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

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      budget: {
        ...projectData.budget,
        [name]: parseFloat(value) || 0
      }
    });
  };

  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setTargetData({ ...targetData, [name]: value });
  };

  const addTarget = () => {
    if (targetData.month && targetData.physicalTarget && targetData.financialTarget) {
      setProjectData({
        ...projectData,
        targets: [...projectData.targets, { ...targetData, id: Date.now() }]
      });
      setTargetData({
        month: '',
        physicalTarget: '',
        financialTarget: ''
      });
    }
  };

  const removeTarget = (id) => {
    setProjectData({
      ...projectData,
      targets: projectData.targets.filter(target => target.id !== id)
    });
  };

  const calculateTotalBudget = () => {
    const { materials, labor, equipment, subcontractors, overhead, contingency } = projectData.budget;
    return materials + labor + equipment + subcontractors + overhead + contingency;
  };

  const handleSaveProject = () => {
    const project = {
      ...projectData,
      id: selectedProject?.id || `PROJ-${Date.now()}`,
      createdAt: selectedProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBudget: calculateTotalBudget()
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
      status: 'Planning',
      targets: [],
      budget: {
        materials: 0,
        labor: 0,
        equipment: 0,
        subcontractors: 0,
        overhead: 0,
        contingency: 0
      }
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Planning
      </Typography>

      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project planning tabs">
          <Tab label="Project Details" />
          <Tab label="Planned Targets" />
          <Tab label="Budget Planning" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step><StepLabel>Basic Info</StepLabel></Step>
            <Step><StepLabel>Financials</StepLabel></Step>
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
              <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Client:</strong> {projectData.client}</Typography>
                      <Typography><strong>CA Value:</strong> ${projectData.caValue}</Typography>
                      <Typography><strong>Start Date:</strong> {projectData.startDate}</Typography>
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
          <Typography variant="h6" gutterBottom>Monthly Targets</Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Month"
                name="month"
                type="month"
                value={targetData.month}
                onChange={handleTargetChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Physical Target (%)"
                name="physicalTarget"
                type="number"
                value={targetData.physicalTarget}
                onChange={handleTargetChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Financial Target ($)"
                name="financialTarget"
                type="number"
                value={targetData.financialTarget}
                onChange={handleTargetChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={addTarget}
                startIcon={<AddIcon />}
              >
                Add Target
              </Button>
            </Grid>
          </Grid>

          {projectData.targets.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Physical Target (%)</TableCell>
                    <TableCell align="right">Financial Target ($)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectData.targets.map((target) => (
                    <TableRow key={target.id}>
                      <TableCell>{target.month}</TableCell>
                      <TableCell align="right">{target.physicalTarget}%</TableCell>
                      <TableCell align="right">${target.financialTarget}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error" 
                          onClick={() => removeTarget(target.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No targets added yet. Add monthly targets to track progress.
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Budget Planning</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Materials Cost ($)"
                name="materials"
                type="number"
                value={projectData.budget.materials}
                onChange={handleBudgetChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Labor Cost ($)"
                name="labor"
                type="number"
                value={projectData.budget.labor}
                onChange={handleBudgetChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Equipment Cost ($)"
                name="equipment"
                type="number"
                value={projectData.budget.equipment}
                onChange={handleBudgetChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subcontractors Cost ($)"
                name="subcontractors"
                type="number"
                value={projectData.budget.subcontractors}
                onChange={handleBudgetChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Overhead Cost ($)"
                name="overhead"
                type="number"
                value={projectData.budget.overhead}
                onChange={handleBudgetChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contingency ($)"
                name="contingency"
                type="number"
                value={projectData.budget.contingency}
                onChange={handleBudgetChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Budget Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography><strong>Total Budget:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${calculateTotalBudget().toLocaleString()}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProjectPlanning;
