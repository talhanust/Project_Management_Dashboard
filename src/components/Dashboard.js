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
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as FinanceIcon
} from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';
import CustomBarChart from './BarChart';

const Dashboard = () => {
  const { projects, formatCurrency, calculateProjectKPIs, calculateRiskLevels } = useAppContext();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    planning: 0,
    highRisk: 0,
    totalCAValue: 0,
    totalRevenue: 0,
    totalExpenditure: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const [highRiskProjects, setHighRiskProjects] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (projects) {
      // Calculate statistics
      const total = projects.length;
      const inProgress = projects.filter(p => p.status === 'In Progress').length;
      const completed = projects.filter(p => p.status === 'Completed').length;
      const planning = projects.filter(p => p.status === 'Planning').length;
      
      // Calculate financial totals
      const totalCAValue = projects.reduce((sum, p) => sum + (p.caValue || 0), 0);
      
      let totalRevenue = 0;
      let totalExpenditure = 0;
      let highRiskCount = 0;
      const highRiskProjectsList = [];
      
      projects.forEach(project => {
        const kpis = calculateProjectKPIs(project);
        const riskLevels = calculateRiskLevels(project, kpis);
        
        totalRevenue += kpis.actualRevenue || 0;
        totalExpenditure += riskLevels.totalExpenditure || 0;
        
        // Check if project is high risk
        if (riskLevels.lagRisk === 'High' || riskLevels.lagRisk === 'Danger' ||
            riskLevels.scopeCreepRisk === 'High' || riskLevels.scopeCreepRisk === 'Danger' ||
            riskLevels.profitabilityRisk === 'Risk' || riskLevels.profitabilityRisk === 'Danger' ||
            riskLevels.slippageRisk === 'High' || riskLevels.slippageRisk === 'Danger' ||
            riskLevels.receivableRisk === 'High' || riskLevels.receivableRisk === 'Danger') {
          highRiskCount++;
          highRiskProjectsList.push({ project, riskLevels });
        }
      });

      setStats({
        total,
        inProgress,
        completed,
        planning,
        highRisk: highRiskCount,
        totalCAValue,
        totalRevenue,
        totalExpenditure
      });

      // Get recent projects (last 5)
      const sortedProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentProjects(sortedProjects);
      setHighRiskProjects(highRiskProjectsList);
      setLoading(false);
    }
  }, [projects, calculateProjectKPIs, calculateRiskLevels]);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.directorate === filter);

  const directorateStats = [
    'North', 'Centre', 'KPK', 'Baluchistan', 'Sindh'
  ].map(dir => ({
    name: dir,
    value: projects.filter(p => p.directorate === dir).length,
    revenue: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      const kpis = calculateProjectKPIs(p);
      return sum + (kpis.actualRevenue || 0);
    }, 0),
    expenditure: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      const kpis = calculateProjectKPIs(p);
      const riskLevels = calculateRiskLevels(p, kpis);
      return sum + (riskLevels.totalExpenditure || 0);
    }, 0)
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

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FinanceIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Profit
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(stats.totalRevenue - stats.totalExpenditure)}
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
              Financial Performance by Directorate
            </Typography>
            <CustomBarChart
              data={directorateStats.map(dir => ({
                name: dir.name,
                Revenue: dir.revenue,
                Expenditure: dir.expenditure
              }))}
              title="Revenue vs Expenditure"
              xAxisKey="name"
              barKey={['Revenue', 'Expenditure']}
              color={['#27ae60', '#e74c3c']}
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
                        Directorate: {project.directorate || 'Not specified'}
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
            
            {highRiskProjects.length === 0 ? (
              <Alert severity="success">
                No high risk projects found. All projects are performing well.
              </Alert>
            ) : (
              <Box>
                {highRiskProjects.slice(0, 5).map(({ project, riskLevels }, index) => {
                  const riskFactors = [];
                  if (riskLevels.lagRisk === 'High' || riskLevels.lagRisk === 'Danger') riskFactors.push('Lag');
                  if (riskLevels.scopeCreepRisk === 'High' || riskLevels.scopeCreepRisk === 'Danger') riskFactors.push('Scope Creep');
                  if (riskLevels.profitabilityRisk === 'Risk' || riskLevels.profitabilityRisk === 'Danger') riskFactors.push('Profitability');
                  if (riskLevels.slippageRisk === 'High' || riskLevels.slippageRisk === 'Danger') riskFactors.push('Slippage');
                  if (riskLevels.receivableRisk === 'High' || riskLevels.receivableRisk === 'Danger') riskFactors.push('Receivable');
                  
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
                        Risks: {riskFactors.join(', ')}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Directorate Performance Table */}
      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Directorate Performance Summary
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Directorate</TableCell>
                <TableCell align="right">Projects</TableCell>
                <TableCell align="right">CA Value</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Expenditure</TableCell>
                <TableCell align="right">Profit</TableCell>
                <TableCell align="right">Profit Margin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {directorateStats.map(dir => {
                const profit = dir.revenue - dir.expenditure;
                const profitMargin = dir.revenue > 0 ? (profit / dir.revenue) * 100 : 0;
                
                return (
                  <TableRow key={dir.name}>
                    <TableCell>{dir.name}</TableCell>
                    <TableCell align="right">{dir.value}</TableCell>
                    <TableCell align="right">{formatCurrency(dir.value * 1000000)}</TableCell>
                    <TableCell align="right">{formatCurrency(dir.revenue)}</TableCell>
                    <TableCell align="right">{formatCurrency(dir.expenditure)}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={formatCurrency(profit)} 
                        color={profit >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${profitMargin.toFixed(2)}%`} 
                        color={profitMargin >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
