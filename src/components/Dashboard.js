import React from 'react';
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
  Chip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import { calculateKpisForProject } from '../utils/calculations';
import BarChart from '../Charts/BarChart';

const Dashboard = () => {
  const { projects, filters, setFilters } = useApp();

  const filteredProjects = projects.filter(project => {
    if (filters.directorate !== 'All' && project.directorate !== filters.directorate) {
      return false;
    }
    if (filters.status !== 'All' && project.status !== filters.status) {
      return false;
    }
    // Add date range filtering if needed
    return true;
  });

  const kpiData = {
    totalProjects: filteredProjects.length,
    inProgress: filteredProjects.filter(p => p.status === 'In Progress').length,
    completed: filteredProjects.filter(p => p.status === 'Completed').length,
    atRisk: filteredProjects.filter(project => {
      const { riskLevel } = calculateKpisForProject(project);
      return riskLevel === 'High' || riskLevel === 'Danger';
    }).length,
  };

  const directorateData = filteredProjects.reduce((acc, project) => {
    if (!acc[project.directorate]) {
      acc[project.directorate] = 0;
    }
    acc[project.directorate]++;
    return acc;
  }, {});

  const chartData = Object.entries(directorateData).map(([name, count]) => ({
    name,
    projects: count,
  }));

  const atRiskProjects = filteredProjects.filter(project => {
    const { riskLevel } = calculateKpisForProject(project);
    return riskLevel === 'High' || riskLevel === 'Danger';
  });

  const KpiCard = ({ title, value, icon, color }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
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
        <Box display="flex" gap={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Directorate</InputLabel>
            <Select
              value={filters.directorate}
              label="Directorate"
              onChange={(e) => setFilters({ directorate: e.target.value })}
            >
              <MenuItem value="All">All Directorates</MenuItem>
              <MenuItem value="North">North</MenuItem>
              <MenuItem value="Centre">Centre</MenuItem>
              <MenuItem value="KPK">KPK</MenuItem>
              <MenuItem value="Baluchistan">Baluchistan</MenuItem>
              <MenuItem value="Sindh">Sindh</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ status: e.target.value })}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Planning">Planning</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
            <BarChart
              data={chartData}
              xKey="name"
              yKey="projects"
              xAxisLabel="Directorate"
              yAxisLabel="Number of Projects"
              fill="#3498db"
            />
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
