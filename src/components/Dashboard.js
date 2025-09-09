import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { projects } = useApp();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    planning: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    if (projects) {
      // Calculate statistics
      const total = projects.length;
      const inProgress = projects.filter(p => p.status === 'In Progress').length;
      const completed = projects.filter(p => p.status === 'Completed').length;
      const planning = projects.filter(p => p.status === 'Planning').length;

      setStats({
        total,
        inProgress,
        completed,
        planning
      });

      // Get recent projects (last 5)
      const sortedProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentProjects(sortedProjects);
      setLoading(false);
    }
  }, [projects]);

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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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
      </Grid>

      {/* Recent Projects */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Create a new project
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • View project reports
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Monitor ongoing projects
              </Typography>
              <Typography variant="body2">
                • Generate executive reports
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
