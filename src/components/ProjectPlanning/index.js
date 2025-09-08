import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import ProjectForm from './ProjectForm';
import TargetsForm from './TargetsForm';
import BudgetForm from './BudgetForm';
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
    budget: {},
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
      status: 'Planning',
      targets: [],
      budget: {},
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

          <ProjectForm
            projectData={projectData}
            setProjectData={setProjectData}
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            handleSaveProject={handleSaveProject}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TargetsForm
            projectData={projectData}
            setProjectData={setProjectData}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <BudgetForm
            projectData={projectData}
            setProjectData={setProjectData}
          />
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProjectPlanning;
