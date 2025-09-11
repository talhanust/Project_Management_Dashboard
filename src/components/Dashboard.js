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
  DialogActions,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as FinanceIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ChartIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import CustomBarChart from './BarChart';
import AnimatedProgressCircle from './AnimatedProgressCircle';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const { projects, formatCurrency, calculateProjectKPIs, calculateRiskLevels, deleteProject } = useApp();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    planning: 0,
    highRisk: 0,
    totalCAValue: 0,
    totalActualRevenue: 0,
    totalVettedRevenue: 0,
    totalAmountReceived: 0,
    totalExpenditure: 0,
    totalPlannedRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const [highRiskProjects, setHighRiskProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [metrics, setMetrics] = useState({
    caValue: 0,
    actualRevenue: 0,
    vettedRevenue: 0,
    amountReceived: 0,
    netProfit: 0,
    completionPercentage: 0,
    plannedRevenue: 0
  });

  useEffect(() => {
    if (projects && projects.length > 0) {
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
    
    let totalActualRevenue = 0;
    let totalVettedRevenue = 0;
    let totalAmountReceived = 0;
    let totalExpenditure = 0;
    let totalPlannedRevenue = 0;
    let completionPercentage = 0;
    let highRiskCount = 0;
    const highRiskProjectsList = [];
    
    filteredProjects.forEach(project => {
      const kpis = calculateProjectKPIs(project);
      const riskLevels = calculateRiskLevels(project, kpis);
      
      totalActualRevenue += kpis.actualRevenue || 0;
      totalVettedRevenue += kpis.vettedRevenue || 0;
      totalAmountReceived += kpis.amountReceived || 0;
      
      // Calculate total expenditure
      if (kpis.expenditures) {
        totalExpenditure += Object.values(kpis.expenditures).reduce((sum, val) => sum + (val || 0), 0);
      }
      
      // Calculate planned revenue from targets
      if (project.targets) {
        totalPlannedRevenue += project.targets.reduce((sum, target) => sum + (target.value || 0), 0);
      }
      
      // Calculate completion percentage based on actual revenue vs CA value
      if (project.caValue > 0) {
        completionPercentage += (kpis.actualRevenue || 0) / project.caValue * 100;
      }
      
      // Check if project is high risk
      if (riskLevels.overallRisk === 'High' || riskLevels.overallRisk === 'Danger') {
        highRiskCount++;
        highRiskProjectsList.push({ project, riskLevels });
      }
    });

    // Average completion percentage
    if (filteredProjects.length > 0) {
      completionPercentage = completionPercentage / filteredProjects.length;
    }

    setStats({
      total,
      inProgress,
      completed,
      planning,
      highRisk: highRiskCount,
      totalCAValue,
      totalActualRevenue,
      totalVettedRevenue,
      totalAmountReceived,
      totalExpenditure,
      totalPlannedRevenue
    });

    setMetrics({
      caValue: totalCAValue,
      actualRevenue: totalActualRevenue,
      vettedRevenue: totalVettedRevenue,
      amountReceived: totalAmountReceived,
      netProfit: totalActualRevenue - totalExpenditure,
      completionPercentage,
      plannedRevenue: totalPlannedRevenue
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
    actualRevenue: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      const kpis = calculateProjectKPIs(p);
      return sum + (kpis.actualRevenue || 0);
    }, 0),
    vettedRevenue: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      const kpis = calculateProjectKPIs(p);
      return sum + (kpis.vettedRevenue || 0);
    }, 0),
    amountReceived: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      const kpis = calculateProjectKPIs(p);
      return sum + (kpis.amountReceived || 0);
    }, 0),
    plannedRevenue: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      return sum + (p.targets ? p.targets.reduce((targetSum, target) => targetSum + (target.value || 0), 0) : 0);
    }, 0),
    expenditure: projects.filter(p => p.directorate === dir).reduce((sum, p) => {
      const kpis = calculateProjectKPIs(p);
      return sum + (kpis.expenditures ? Object.values(kpis.expenditures).reduce((expSum, val) => expSum + (val || 0), 0) : 0);
    }, 0)
  }));

  const exportChartAsImage = (chartId, filename) => {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const exportAsPDF = () => {
    const dashboardElement = document.getElementById('dashboard-content');
    if (dashboardElement) {
      html2canvas(dashboardElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('dashboard-report.pdf');
      });
    }
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get progress trend data for selected project or all projects
  const getProgressTrendData = () => {
    if (selectedProject !== 'All') {
      const project = projects.find(p => p.id === selectedProject);
      if (project && project.progress && project.progress.length > 0) {
        return project.progress.map((progress, index) => {
          const calculations = progress.calculations || {};
          return {
            name: `Progress ${index + 1}`,
            'Actual Work Done': calculations.uptoDateActualWorkDone || 0,
            'Vetted Revenue': calculations.uptoDateVettedRevenue || 0
          };
        });
      }
    }
    
    // Return empty if no progress data
    return [];
  };

  // Get planned vs actual revenue data
  const getPlannedVsActualData = () => {
    let filteredProjects = projects;
    
    // Apply directorate filter
    if (filter !== 'All') {
      filteredProjects = filteredProjects.filter(p => p.directorate === filter);
    }
    
    // Apply project filter
    if (selectedProject !== 'All') {
      filteredProjects = filteredProjects.filter(p => p.id === selectedProject);
    }
    
    return filteredProjects.map(project => {
      const kpis = calculateProjectKPIs(project);
      const plannedRevenue = project.targets ? 
        project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
      
      return {
        name: project.name,
        'Planned Revenue': plannedRevenue,
        'Actual Revenue': kpis.actualRevenue || 0
      };
    });
  };

  // Get expenditure breakdown data
  const getExpenditureData = () => {
    const expenditureHeads = [
      'Subcontractor Cost',
      'Material Cost',
      'Hiring Cost',
      'Engineer Facilities',
      'Pays & Allowances',
      'General Administration',
      'Other Costs'
    ];
    
    const expenditureData = {};
    
    // Initialize with zero values
    expenditureHeads.forEach(head => {
      expenditureData[head] = 0;
    });
    
    let filteredProjects = projects;
    
    // Apply directorate filter
    if (filter !== 'All') {
      filteredProjects = filteredProjects.filter(p => p.directorate === filter);
    }
    
    // Apply project filter
    if (selectedProject !== 'All') {
      filteredProjects = filteredProjects.filter(p => p.id === selectedProject);
    }
    
    // Sum up expenditures
    filteredProjects.forEach(project => {
      const kpis = calculateProjectKPIs(project);
      if (kpis.expenditures) {
        expenditureHeads.forEach(head => {
          expenditureData[head] += kpis.expenditures[head] || 0;
        });
      }
    });
    
    return expenditureHeads.map(head => ({
      name: head,
      value: expenditureData[head]
    }));
  };

  // Get financial comparison data (Vetted Revenue vs Amount Received)
  const getFinancialComparisonData = () => {
    return [
      { name: 'Vetted Revenue', value: metrics.vettedRevenue },
      { name: 'Amount Received', value: metrics.amountReceived }
    ];
  };

  // Get budget vs actual data
  const getBudgetVsActualData = () => {
    if (selectedProject !== 'All') {
      const project = projects.find(p => p.id === selectedProject);
      if (project && project.budget) {
        const kpis = calculateProjectKPIs(project);
        const plannedRevenue = project.targets ? 
          project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
        
        const totalExpenditure = kpis.expenditures ? 
          Object.values(kpis.expenditures).reduce((sum, val) => sum + (val || 0), 0) : 0;
        
        // Calculate planned cost from budget
        const budget = project.budget;
        const plannedDirectCost = (budget.subcontractorCost || 0) + 
                                 (budget.materialCost || 0) + 
                                 (budget.engineerFacilityCost || 0);
        
        let plannedOverheadCost = 0;
        if (budget.overheadCalculationMethod === 'percentage') {
          plannedOverheadCost = (project.caValue || 0) * 0.1; // Default 10% for example
        } else {
          plannedOverheadCost = (budget.hrCost || 0) + (budget.generalAdmCost || 0);
        }
        
        const plannedTotalCost = plannedDirectCost + plannedOverheadCost;
        
        return [
          { name: 'Revenue', Planned: plannedRevenue, Actual: kpis.actualRevenue || 0 },
          { name: 'Direct Cost', Planned: plannedDirectCost, Actual: totalExpenditure },
          { name: 'Overhead', Planned: plannedOverheadCost, Actual: 0 }, // Actual overhead might not be tracked separately
          { name: 'Total Cost', Planned: plannedTotalCost, Actual: totalExpenditure },
          { name: 'Profit', Planned: plannedRevenue - plannedTotalCost, Actual: (kpis.actualRevenue || 0) - totalExpenditure }
        ];
      }
    }
    
    return [];
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
          Project Monitoring Dashboard
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

      {/* Real-time Metrics */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Real-time Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <FinanceIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                CA Value
              </Typography>
              <Typography variant="h5">
                {formatCurrency(metrics.caValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Actual Revenue
              </Typography>
              <Typography variant="h5">
                {formatCurrency(metrics.actualRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
               <FlagIcon color="info" sx={{ fontSize: 40, mb: 1 }} />  {/* Changed from TargetIcon to FlagIcon */}
              <Typography variant="h6" gutterBottom>
                Planned Revenue
              </Typography>
              <Typography variant="h5">
                {formatCurrency(metrics.plannedRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ChartIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Amount Received
              </Typography>
              <Typography variant="h5">
                {formatCurrency(metrics.amountReceived)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <FinanceIcon color={metrics.netProfit >= 0 ? 'success' : 'error'} sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Net Profit
              </Typography>
              <Typography variant="h5" color={metrics.netProfit >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(metrics.netProfit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for detailed views */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project monitoring tabs">
          <Tab label="Progress Tracking" />
          <Tab label="Financial Analysis" />
          <Tab label="Planning vs Actual" />
          <Tab label="Risk Assessment" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Progress Overview
              </Typography>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <AnimatedProgressCircle 
                  value={metrics.completionPercentage} 
                  size={200}
                  thickness={10}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Overall Project Completion
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Progress Trend
              </Typography>
              <Paper elevation={2} sx={{ p: 2 }}>
                {getProgressTrendData().length > 0 ? (
                  <CustomBarChart
                    data={getProgressTrendData()}
                    title="Progress Trend"
                    xAxisKey="name"
                    barKey={['Actual Work Done', 'Vetted Revenue']}
                    color={['#8884d8', '#82ca9d']}
                  />
                ) : (
                  <Alert severity="info">
                    No progress data available for the selected project.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Expenditure Breakdown
              </Typography>
              <Paper elevation={2} sx={{ p: 2 }}>
                <CustomBarChart
                  data={getExpenditureData()}
                  title="Expenditure by Category"
                  xAxisKey="name"
                  barKey={['value']}
                  color={['#ff8042']}
                  horizontal={true}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Vetted Revenue vs Amount Received
              </Typography>
              <Paper elevation={2} sx={{ p: 2 }}>
                <CustomBarChart
                  data={getFinancialComparisonData()}
                  title="Vetted Revenue vs Amount Received"
                  xAxisKey="name"
                  barKey={['value']}
                  color={['#0088fe', '#00c49f']}
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Planned vs Actual Revenue
              </Typography>
              <Paper elevation={2} sx={{ p: 2 }}>
                <CustomBarChart
                  data={getPlannedVsActualData()}
                  title="Planned vs Actual Revenue"
                  xAxisKey="name"
                  barKey={['Planned Revenue', 'Actual Revenue']}
                  color={['#8884d8', '#82ca9d']}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Budget vs Actual
              </Typography>
              <Paper elevation={2} sx={{ p: 2 }}>
                {getBudgetVsActualData().length > 0 ? (
                  <CustomBarChart
                    data={getBudgetVsActualData()}
                    title="Budget vs Actual"
                    xAxisKey="name"
                    barKey={['Planned', 'Actual']}
                    color={['#8884d8', '#82ca9d']}
                  />
                ) : (
                  <Alert severity="info">
                    No budget data available for the selected project.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Risk Overview
              </Typography>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <WarningIcon 
                  color={stats.highRisk > 0 ? 'error' : 'success'} 
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <Typography variant="h4" color={stats.highRisk > 0 ? 'error.main' : 'success.main'}>
                  {stats.highRisk} High Risk Projects
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label={`Total Projects: ${stats.total}`} color="primary" sx={{ m: 0.5 }} />
                  <Chip label={`High Risk: ${stats.highRisk}`} color="error" sx={{ m: 0.5 }} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                High Risk Projects
              </Typography>
              <Paper elevation={2} sx={{ p: 2 }}>
                {highRiskProjects.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Project</TableCell>
                          <TableCell>Directorate</TableCell>
                          <TableCell>Risk Level</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {highRiskProjects.slice(0, 5).map(({ project, riskLevels }) => (
                          <TableRow key={project.id}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.directorate}</TableCell>
                            <TableCell>
                              <Chip 
                                label={riskLevels.overallRisk} 
                                color="error" 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="success">
                    No high risk projects found. All projects are performing well.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Projects List */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {selectedProject === 'All' ? 'Projects Overview' : 'Project Details'}
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Directorate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>CA Value</TableCell>
              <TableCell>Planned Revenue</TableCell>
              <TableCell>Actual Revenue</TableCell>
              <TableCell>Variance</TableCell>
              <TableCell>Risk Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects
              .filter(p => filter === 'All' || p.directorate === filter)
              .filter(p => selectedProject === 'All' || p.id === selectedProject)
              .map(project => {
                const kpis = calculateProjectKPIs(project);
                const riskLevels = calculateRiskLevels(project, kpis);
                const plannedRevenue = project.targets ? 
                  project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
                const variance = plannedRevenue - (kpis.actualRevenue || 0);
                const variancePercentage = plannedRevenue > 0 ? (variance / plannedRevenue) * 100 : 0;
                
                return (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.directorate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={project.status} 
                        color={
                          project.status === 'Completed' ? 'success' :
                          project.status === 'In Progress' ? 'warning' : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(project.caValue || 0)}</TableCell>
                    <TableCell>{formatCurrency(plannedRevenue)}</TableCell>
                    <TableCell>{formatCurrency(kpis.actualRevenue || 0)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${formatCurrency(variance)} (${variancePercentage.toFixed(2)}%)`} 
                        color={variance <= 0 ? 'success' : variance <= plannedRevenue * 0.1 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={riskLevels.overallRisk} 
                        color={
                          riskLevels.overallRisk === 'High' ? 'error' : 
                          riskLevels.overallRisk === 'Medium' ? 'warning' : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

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
