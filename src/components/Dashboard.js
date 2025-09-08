import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateKpisForProject } from '../utils/calculations';

const Dashboard = ({ projects, selectedProject, setSelectedProject }) => {
  const [regionFilter, setRegionFilter] = useState('All');

  const kpiData = useMemo(() => {
    const totalProjects = projects.length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    
    // Calculate at-risk projects
    const atRisk = projects.filter(project => {
      const { lagPercent, riskLevel } = calculateKpisForProject(project);
      return riskLevel === 'High' || riskLevel === 'Danger';
    }).length;

    return { totalProjects, inProgress, completed, atRisk };
  }, [projects]);

  const directorateData = useMemo(() => {
    const directors = {};
    projects.forEach(project => {
      if (!directors[project.directorate]) {
        directors[project.directorate] = 0;
      }
      directors[project.directorate]++;
    });

    return Object.entries(directors).map(([name, count]) => ({
      name,
      projects: count
    }));
  }, [projects]);

  const atRiskProjects = useMemo(() => {
    return projects.filter(project => {
      const { lagPercent, riskLevel } = calculateKpisForProject(project);
      return riskLevel === 'High' || riskLevel === 'Danger';
    });
  }, [projects]);

  const KpiCard = ({ title, value, icon, color }) => (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        {React.cloneElement(icon, { sx: { fontSize: 40, mb: 1, color } })}
        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>
        <Typography color="text.secondary" variant="h6">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Project Management Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Region</InputLabel>
          <Select
            value={regionFilter}
            label="Filter by Region"
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <MenuItem value="All">All Regions</MenuItem>
            <MenuItem value="North">North</MenuItem>
            <MenuItem value="Centre">Centre</MenuItem>
            <MenuItem value="KPK">KPK</MenuItem>
            <MenuItem value="Baluchistan">Baluchistan</MenuItem>
            <MenuItem value="Sindh">Sindh</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Total Projects"
            value={kpiData.totalProjects}
            icon={<AssignmentIcon />}
            color="#2c3e50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="In Progress"
            value={kpiData.inProgress}
            icon={<TrendingUpIcon />}
            color="#3498db"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Completed"
            value={kpiData.completed}
            icon={<CheckCircleIcon />}
            color="#27ae60"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="At Risk"
            value={kpiData.atRisk}
            icon={<WarningIcon />}
            color="#e74c3c"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Projects by Directorate
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={directorateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" fill="#3498db" name="Number of Projects" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              At-Risk Projects
            </Typography>
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              {atRiskProjects.length > 0 ? (
                atRiskProjects.map(project => {
                  const { lagPercent, riskLevel } = calculateKpisForProject(project);
                  return (
                    <Alert 
                      key={project.id} 
                      severity={riskLevel === 'Danger' ? 'error' : 'warning'} 
                      sx={{ mb: 1 }}
                    >
                      <Box>
                        <Typography fontWeight="bold">{project.name}</Typography>
                        <Typography variant="body2">{project.directorate}</Typography>
                        <Chip 
                          label={`Lag: ${lagPercent.toFixed(1)}%`} 
                          size="small" 
                          color={riskLevel === 'Danger' ? 'error' : 'warning'}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Alert>
                  );
                })
              ) : (
                <Alert severity="success">
                  No projects are currently at risk!
                </Alert>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
