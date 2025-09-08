import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import ProjectPlanning from './components/ProjectPlanning';
import ProjectMonitoring from './components/ProjectMonitoring';
import AIInsights from './components/AIInsights';
import ExecutiveReports from './components/ExecutiveReports';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import { getProjects, saveProjects } from './utils/storage';
import './styles/App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load projects from localStorage on initial load
    const savedProjects = getProjects();
    if (savedProjects) {
      setProjects(savedProjects);
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    // Save projects to localStorage whenever they change
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (updatedProject) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? createTheme({
      ...theme,
      palette: {
        mode: 'dark',
        primary: {
          main: '#3498db',
        },
        secondary: {
          main: '#2ecc71',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      },
    }) : theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation darkMode={darkMode} toggleTheme={toggleTheme} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  projects={projects} 
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              } />
              <Route path="/planning" element={
                <ProjectPlanning 
                  projects={projects}
                  addProject={addProject}
                  updateProject={updateProject}
                  deleteProject={deleteProject}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              } />
              <Route path="/monitoring" element={
                <ProjectMonitoring 
                  projects={projects}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              } />
              <Route path="/insights" element={
                <AIInsights 
                  projects={projects}
                  selectedProject={selectedProject}
                />
              } />
              <Route path="/reports" element={
                <ExecutiveReports 
                  projects={projects}
                  selectedProject={selectedProject}
                />
              } />
              <Route path="/settings" element={
                <Settings 
                  darkMode={darkMode}
                  toggleTheme={toggleTheme}
                />
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
