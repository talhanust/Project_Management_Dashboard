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
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Description as ReportIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Article as WordIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ExecutiveReports = () => {
  const { projects, formatCurrency, calculateProjectKPIs, calculateRiskLevels, calculateStatistics } = useApp();
  const [reportType, setReportType] = useState('overall');
  const [directorate, setDirectorate] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [tabValue, setTabValue] = useState(0);
  const [generateStatus, setGenerateStatus] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGenerateReport = () => {
    setGenerateStatus('Report generated successfully!');
    setTimeout(() => setGenerateStatus(''), 3000);
  };

  const handleDownloadReport = (format, type = reportType) => {
    // In a real application, this would generate and download the report
    alert(`Downloading ${format} report for ${type}`);
  };

  const filteredProjects = projects.filter(project => {
    if (directorate !== 'All' && project.directorate !== directorate) return false;
    if (selectedProject !== 'All' && project.id !== selectedProject) return false;
    return true;
  });

  const stats = calculateStatistics();

  const generateOverallReport = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Executive Summary
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2">Total Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{stats.highRisk}</Typography>
              <Typography variant="body2">High Risk Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{formatCurrency(stats.totalRevenue)}</Typography>
              <Typography variant="body2">Total Revenue</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{formatCurrency(stats.totalProfit)}</Typography>
              <Typography variant="body2">Total Profit</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Performance by Directorate
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Directorate</TableCell>
                <TableCell align="right">Projects</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Expenditure</TableCell>
                <TableCell align="right">Profit</TableCell>
                <TableCell align="right">Margin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {['North', 'Centre', 'KPK', 'Baluchistan', 'Sindh'].map(dir => {
                const dirProjects = projects.filter(p => p.directorate === dir);
                const dirStats = dirProjects.reduce((acc, project) => {
                  const kpis = calculateProjectKPIs(project);
                  const riskLevels = calculateRiskLevels(project, kpis);
                  return {
                    revenue: acc.revenue + (kpis.actualRevenue || 0),
                    expenditure: acc.expenditure + (riskLevels.totalExpenditure || 0),
                    projects: acc.projects + 1
                  };
                }, { revenue: 0, expenditure: 0, projects: 0 });

                const profit = dirStats.revenue - dirStats.expenditure;
                const margin = dirStats.revenue > 0 ? (profit / dirStats.revenue) * 100 : 0;

                return (
                  <TableRow key={dir}>
                    <TableCell>{dir}</TableCell>
                    <TableCell align="right">{dirStats.projects}</TableCell>
                    <TableCell align="right">{formatCurrency(dirStats.revenue)}</TableCell>
                    <TableCell align="right">{formatCurrency(dirStats.expenditure)}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={formatCurrency(profit)} 
                        color={profit >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${margin.toFixed(2)}%`} 
                        color={margin >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const generateDirectorateReport = () => {
    if (directorate === 'All') {
      return <Alert severity="info">Please select a specific directorate.</Alert>;
    }

    const dirProjects = projects.filter(p => p.directorate === directorate);
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          {directorate} Directorate Report
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{dirProjects.length}</Typography>
              <Typography variant="body2">Total Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">
                {dirProjects.filter(p => {
                  const kpis = calculateProjectKPIs(p);
                  const riskLevels = calculateRiskLevels(p, kpis);
                  return riskLevels.lagRisk === 'High' || riskLevels.lagRisk === 'Danger';
                }).length}
              </Typography>
              <Typography variant="body2">Delayed Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">
                {dirProjects.filter(p => p.status === 'Completed').length}
              </Typography>
              <Typography variant="body2">Completed Projects</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Project Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Progress</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Risk Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dirProjects.map(project => {
                const kpis = calculateProjectKPIs(project);
                const riskLevels = calculateRiskLevels(project, kpis);
                const progress = project.caValue > 0 ? (kpis.actualRevenue / project.caValue) * 100 : 0;

                return (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={project.status} 
                        color={
                          project.status === 'Completed' ? 'success' :
                          project.status === 'In Progress' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{progress.toFixed(2)}%</TableCell>
                    <TableCell align="right">{formatCurrency(kpis.actualRevenue)}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={Object.values(riskLevels).some(r => r === 'High' || r === 'Danger') ? 'High Risk' : 'Low Risk'} 
                        color={Object.values(riskLevels).some(r => r === 'High' || r === 'Danger') ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const generateProjectReport = () => {
    if (selectedProject === 'All') {
      return <Alert severity="info">Please select a specific project.</Alert>;
    }

    const project = projects.find(p => p.id === selectedProject);
    if (!project) return <Alert severity="error">Project not found.</Alert>;

    const kpis = calculateProjectKPIs(project);
    const riskLevels = calculateRiskLevels(project, kpis);

    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          {project.name} - Detailed Report
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Project Information</Typography>
            <Typography><strong>Directorate:</strong> {project.directorate}</Typography>
            <Typography><strong>Category:</strong> {project.category}</Typography>
            <Typography><strong>Location:</strong> {project.location}</Typography>
            <Typography><strong>Client:</strong> {project.client}</Typography>
            <Typography><strong>Status:</strong> {project.status}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Financial Information</Typography>
            <Typography><strong>CA Value:</strong> {formatCurrency(project.caValue)}</Typography>
            <Typography><strong>Revised CA Value:</strong> {formatCurrency(project.revisedCaValue)}</Typography>
            <Typography><strong>Actual Revenue:</strong> {formatCurrency(kpis.actualRevenue)}</Typography>
            <Typography><strong>Profitability:</strong> {riskLevels.profitability.toFixed(2)}%</Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Risk Assessment
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(riskLevels).map(([key, value]) => {
            if (key.endsWith('Risk') && value !== 'Satisfactory' && value !== 'Excellent') {
              return (
                <Grid item xs={12} md={4} key={key}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{key.replace('Risk', '')}</Typography>
                    <Chip 
                      label={value} 
                      color={
                        value === 'High' || value === 'Danger' || value === 'Risk' ? 'error' :
                        value === 'Moderate' ? 'warning' : 'default'
                      }
                    />
                  </Paper>
                </Grid>
              );
            }
            return null;
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Executive Reports
      </Typography>

      <Card elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="overall">Overall Report</MenuItem>
                <MenuItem value="directorate">Directorate Report</MenuItem>
                <MenuItem value="project">Project Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Directorate</InputLabel>
              <Select
                value={directorate}
                label="Directorate"
                onChange={(e) => setDirectorate(e.target.value)}
                disabled={reportType === 'overall'}
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
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                label="Project"
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={reportType !== 'project'}
              >
                <MenuItem value="All">All Projects</MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleGenerateReport}
              startIcon={<ReportIcon />}
              sx={{ mr: 2 }}
            >
              Generate Report
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => handleDownloadReport('word')}
              startIcon={<WordIcon />}
              sx={{ mr: 2 }}
            >
              Word Report
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => handleDownloadReport('powerpoint')}
              startIcon={<PdfIcon />}
            >
              PowerPoint Report
            </Button>
          </Grid>

          {generateStatus && (
            <Grid item xs={12}>
              <Alert severity="success">
                {generateStatus}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Card>

      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Report Preview" />
          <Tab label="Export Options" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {reportType === 'overall' && generateOverallReport()}
          {reportType === 'directorate' && generateDirectorateReport()}
          {reportType === 'project' && generateProjectReport()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Export Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Microsoft Word
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleDownloadReport('word')}
                  startIcon={<WordIcon />}
                  fullWidth
                >
                  Export to Word
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Microsoft PowerPoint
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleDownloadReport('powerpoint')}
                  startIcon={<PdfIcon />}
                  fullWidth
                >
                  Export to PowerPoint
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ExecutiveReports;
