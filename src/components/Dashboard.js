import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import CustomBarChart from './BarChart';

const Dashboard = () => {
  const { projects, formatCurrency, calculateProjectKPIs } = useApp();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    planning: 0,
    highRisk: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (projects) {
      // Calculate statistics
      const total = projects.length;
      const inProgress = projects.filter(p => p.status === 'In Progress').length;
      const completed = projects.filter(p => p.status === 'Completed').length;
      const planning = projects.filter(p => p.status === 'Planning').length;
      
      // Count high risk projects
      const highRisk = projects.filter(project => {
        const kpis = calculateProjectKPIs(project);
        return kpis.riskLevels && Object.values(kpis.riskLevels).some(level => 
          level === 'High' || level === 'Danger'
        );
      }).length;

      setStats({
        total,
        inProgress,
        completed,
        planning,
        highRisk
      });

      // Get recent projects (last 5)
      const sortedProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentProjects(sortedProjects);
      setLoading(false);
    }
  }, [projects, calculateProjectKPIs]);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.directorate === filter);

  const directorateStats = [
    'North', 'Centre', 'KPK', 'Baluchistan', 'Sindh'
  ].map(dir => ({
    name: dir,
    value: projects.filter(p => p.directorate === dir).length
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Directorate</InputLabel>
            <Select
              value={filter}
              label="Filter by Directorate"
              onChange={(e) => setFilter(e.target.value)}
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Projects
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.inProgress}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.completed}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Planning
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.planning}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    High Risk
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.highRisk}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Graphs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Projects by Directorate
            </Typography>
            <CustomBarChart
              data={directorateStats}
              title="Projects by Directorate"
              xAxisKey="name"
              barKey="value"
              color="#3498db"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Status Distribution
            </Typography>
            <CustomBarChart
              data={[
                { name: 'Planning', value: stats.planning },
                { name: 'In Progress', value: stats.inProgress },
                { name: 'Completed', value: stats.completed }
              ]}
              title="Project Status Distribution"
              xAxisKey="name"
              barKey="value"
              color="#27ae60"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Projects and High Risk Projects */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Projects
            </Typography>
            
            {recentProjects.length === 0 ? (
              <Alert severity="info">
                No projects found. Start by creating a new project in the Planning section.
              </Alert>
            ) : (
              <Box>
                {recentProjects.map((project, index) => (
                  <Box 
                    key={project.id || index} 
                    sx={{ 
                      p: 2, 
                      mb: 1, 
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {project.name || 'Unnamed Project'}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary">
                        Directorates: {project.directorate || 'Not specified'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={
                          project.status === 'Completed' ? 'success.main' :
                          project.status === 'In Progress' ? 'warning.main' :
                          project.status === 'Planning' ? 'info.main' : 'textSecondary'
                        }
                      >
                        {project.status || 'Unknown Status'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              High Risk Projects
            </Typography>
            
            {projects.filter(project => {
              const kpis = calculateProjectKPIs(project);
              return kpis.riskLevels && Object.values(kpis.riskLevels).some(level => 
                level === 'High' || level === 'Danger'
              );
            }).length === 0 ? (
              <Alert severity="success">
                No high risk projects found. All projects are performing well.
              </Alert>
            ) : (
              <Box>
                {projects.filter(project => {
                  const kpis = calculateProjectKPIs(project);
                  return kpis.riskLevels && Object.values(kpis.riskLevels).some(level => 
                    level === 'High' || level === 'Danger'
                  );
                }).slice(0, 5).map((project, index) => {
                  const kpis = calculateProjectKPIs(project);
                  return (
                    <Box 
                      key={project.id || index} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        border: '1px solid',
                        borderColor: 'error.light',
                        borderRadius: 1,
                        backgroundColor: 'error.light'
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        {project.name || 'Unnamed Project'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Risks: {Object.entries(kpis.riskLevels || {})
                          .filter(([_, level]) => level === 'High' || level === 'Danger')
                          .map(([key]) => key)
                          .join(', ')}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
