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
  Alert,
  Chip,
  Paper
} from '@mui/material';
import { useApp } from '../contexts/AppContext';

const AIInsights = () => {
  const { projects, calculateProjectKPIs } = useApp();
  const [filters, setFilters] = useState({
    directorate: 'All',
    project: 'All'
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredProjects = projects.filter(project => {
    if (filters.directorate !== 'All' && project.directorate !== filters.directorate) return false;
    if (filters.project !== 'All' && project.id !== filters.project) return false;
    return true;
  });

  const getAIRecommendations = (project) => {
    const kpis = calculateProjectKPIs(project);
    const recommendations = [];

    if (kpis.lagRisk === 'High' || kpis.lagRisk === 'Danger') {
      recommendations.push('Accelerate work progress to meet planned targets');
    }

    if (kpis.costVariance < 0) {
      recommendations.push('Review and optimize cost structure to reduce overruns');
    }

    if (kpis.profitabilityRisk === 'High' || kpis.profitabilityRisk === 'Danger') {
      recommendations.push('Implement cost-saving measures and review pricing strategy');
    }

    if (kpis.slippageRisk === 'High' || kpis.slippageRisk === 'Danger') {
      recommendations.push('Improve documentation and follow-up with client for vetting');
    }

    if (kpis.receivableRisk === 'High' || kpis.receivableRisk === 'Danger') {
      recommendations.push('Strengthen accounts receivable collection process');
    }

    return recommendations.length > 0 ? recommendations : ['Project is performing well. Maintain current operations.'];
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Insights & Recommendations
      </Typography>

      <Card elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Directorate</InputLabel>
              <Select
                value={filters.directorate}
                label="Filter by Directorate"
                onChange={(e) => handleFilterChange('directorate', e.target.value)}
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={filters.project}
                label="Select Project"
                onChange={(e) => handleFilterChange('project', e.target.value)}
              >
                <MenuItem value="All">All Projects</MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name} - {project.directorate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {filteredProjects.length === 0 ? (
          <Alert severity="info">
            No projects match the selected filters.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map(project => {
              const kpis = calculateProjectKPIs(project);
              const recommendations = getAIRecommendations(project);

              return (
                <Grid item xs={12} key={project.id}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {project.name} - {project.directorate}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> {project.status}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>CA Value:</strong> {kpis.caValue}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Progress:</strong> {kpis.progressPercentage}%
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Risk Indicators:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {kpis.riskLevels && Object.entries(kpis.riskLevels).map(([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            color={
                              value === 'Low' || value === 'Satisfactory' ? 'success' :
                              value === 'Moderate' ? 'warning' :
                              value === 'High' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        AI Recommendations:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {recommendations.map((rec, index) => (
                          <li key={index}>
                            <Typography variant="body2">{rec}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Card>
    </Box>
  );
};

export default AIInsights;
