import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
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
  Divider,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  ShowChart as ChartIcon
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectPlanning = ({ projects, addProject, updateProject, selectedProject, setSelectedProject }) => {
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
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

  const handleSaveProject = () => {
    const project = {
      ...projectData,
      id: selectedProject || `PROJ-${Date.now()}`
    };

    if (selectedProject) {
      updateProject(project);
    } else {
      addProject(project);
    }
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
          <Alert severity="info">
            Planned targets functionality will be implemented in the next version
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Budget Planning</Typography>
          <Alert severity="info">
            Budget planning features will be implemented in the next version
          </Alert>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProjectPlanning;
