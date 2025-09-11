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
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as FinanceIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import CustomBarChart from './BarChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const { projects, formatCurrency, calculateProjectKPIs, calculateRiskLevels, deleteProject } = useApp();
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
  const [selectedProject, setSelectedProject] = useState('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (projects) {
      calculateStats();
    }
  }, [projects, filter, selectedProject]);

  const calculateStats = () => {
    let filteredProjects = projects;
    
    // Apply directorate filter
    if (filter !== 'All') {
      filteredProjects = filteredProjects.filter(p => p.directorate === filter);
    }
    
    // Apply project filter
    if (selectedProject !== 'All') {
      filteredProjects = filteredProjects.filter(p => p.id === selectedProject);
    }

    const total = filteredProjects.length;
    const inProgress = filteredProjects.filter(p => p.status === 'In Progress').length;
    const completed = filteredProjects.filter(p => p.status === 'Completed').length;
    const planning = filteredProjects.filter(p => p.status === 'Planning').length;
    
    const totalCAValue = filteredProjects.reduce((sum, p) => sum + (p.caValue || 0), 0);
    
    let totalRevenue = 0;
    let totalExpenditure = 0;
    let highRiskCount = 0;
    const highRiskProjectsList = [];
    
    filteredProjects.forEach(project => {
      const kpis = calculateProjectKPIs(project);
      const riskLevels = calculateRiskLevels(project, kpis);
      
      totalRevenue += kpis.actualRevenue || 0;
      totalExpenditure += riskLevels.totalExpenditure || 0;
      
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

    const sortedProjects = [...filteredProjects]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    setRecentProjects(sortedProjects);
    setHighRiskProjects(highRiskProjectsList);
    setLoading(false);
  };

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

  const exportChartAsImage = (chartId, filename) => {
    const chartElement = document.getElementById(chartId);
    html2canvas(chartElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const exportAsPDF = () => {
    const dashboardElement = document.getElementById('dashboard-content');
    html2canvas(dashboardElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dashboard-report.pdf');
    });
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} id="dashboard-content">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          onClick={exportAsPDF}
          startIcon={<PdfIcon />}
        >
          Export as PDF
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={selectedProject}
              label="Select Project"
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <MenuItem value="All">All Projects</MenuItem>
              {projects
                .filter(p => filter === 'All' || p.directorate === filter)
                .map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {highRiskProjects.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6">Projects Needing Attention</Typography>
          {highRiskProjects.slice(0, 3).map(({ project }) => (
            <Typography key={project.id}>• {project.name} - {project.directorate}</Typography>
          ))}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={2} sx={{ background: 'linear-gradient(45deg, #2c3e50, #3498db)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography gutterBottom>
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
          <Card elevation={2} sx={{ background: 'linear-gradient(45deg, #f39c12, #f5b143)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography gutterBottom>
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
          <Card elevation={2} sx={{ background: 'linear-gradient(45deg, #27ae60, #2ecc71)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography gutterBottom>
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
          <Card elevation={2} sx={{ background: 'linear-gradient(45deg, #e74c3c, ${theme.palette.error.main})', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography gutterBottom>
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
          <Card elevation={2} sx={{ background: 'linear-gradient(45deg, #3498db, #5faee3)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FinanceIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography gutterBottom>
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(45deg, #2c3e50, #3498db)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="white">
                Projects by Directorate
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => exportChartAsImage('directorateChart', 'directorate-data')}
                startIcon={<ImageIcon />}
                sx={{ background: 'rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
              >
                Export
              </Button>
            </Box>
            <div id="directorateChart">
              <CustomBarChart
                data={directorateStats}
                title=""
                xAxisKey="name"
                barKey={['value']}
                color={['#ffffff']}
              />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(45deg, #27ae60, #2ecc71)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="white">
                Financial Performance
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => exportChartAsImage('financialChart', 'financial-data')}
                startIcon={<ImageIcon />}
                sx={{ background: 'rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
              >
                Export
              </Button>
            </Box>
            <div id="financialChart">
              <CustomBarChart
                data={directorateStats.map(dir => ({
                  name: dir.name,
                  Revenue: dir.revenue,
                  Expenditure: dir.expenditure
                }))}
                title=""
                xAxisKey="name"
                barKey={['Revenue', 'Expenditure']}
                color={['#ffffff', '#f1c40f']}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>

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
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
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
                          sx={{ ml: 2 }}
                        >
                          {project.status || 'Unknown Status'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </Button>
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
                        Directorate: {project.directorate}
                      </Typography>
                      <Typography variant="body2">
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

      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Directorate Performance Summary
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => exportChartAsImage('performanceTable', 'performance-data')}
            startIcon={<ImageIcon />}
          >
            Export
          </Button>
        </Box>
        <TableContainer id="performanceTable">
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
