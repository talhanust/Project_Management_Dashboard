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
  Paper
} from '@mui/material';
import {
  Description as ReportIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const ExecutiveReports = () => {
  const { projects, formatCurrency, calculateProjectKPIs } = useApp();
  const [reportType, setReportType] = useState('overall');
  const [directorate, setDirectorate] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [generateStatus, setGenerateStatus] = useState('');

  const handleGenerateReport = () => {
    setGenerateStatus('Report generated successfully!');
    setTimeout(() => setGenerateStatus(''), 3000);
  };

  const handleDownloadReport = (format) => {
    // In a real application, this would generate and download the report
    alert(`Downloading ${format} report for ${reportType}`);
  };

  const filteredProjects = projects.filter(project => {
    if (directorate !== 'All' && project.directorate !== directorate) return false;
    if (selectedProject !== 'All' && project.id !== selectedProject) return false;
    return true;
  });

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
              startIcon={<DownloadIcon />}
              sx={{ mr: 2 }}
            >
              Download Word
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => handleDownloadReport('powerpoint')}
              startIcon={<DownloadIcon />}
            >
              Download PowerPoint
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

      {reportType === 'overall' && (
        <Card elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Overall Performance Summary
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Directorate</TableCell>
                  <TableCell align="right">Total Projects</TableCell>
                  <TableCell align="right">Total CA Value</TableCell>
                  <TableCell align="right">Avg. Progress</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                  <TableCell align="right">Total Expenditure</TableCell>
                  <TableCell align="right">Profitability</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['North', 'Centre', 'KPK', 'Baluchistan', 'Sindh'].map(dir => {
                  const dirProjects = projects.filter(p => p.directorate === dir);
                  const totalProjects = dirProjects.length;
                  const totalCAValue = dirProjects.reduce((sum, p) => sum + parseFloat(p.caValue || 0), 0);
                  const avgProgress = dirProjects.reduce((sum, p) => {
                    const kpis = calculateProjectKPIs(p);
                    return sum + (kpis.progressPercentage || 0);
                  }, 0) / totalProjects || 0;
                  
                  const totalRevenue = dirProjects.reduce((sum, p) => {
                    const kpis = calculateProjectKPIs(p);
                    return sum + (kpis.actualRevenue || 0);
                  }, 0);
                  
                  const totalExpenditure = dirProjects.reduce((sum, p) => {
                    const kpis = calculateProjectKPIs(p);
                    return sum + (kpis.totalExpenditure || 0);
                  }, 0);
                  
                  const profitability = totalExpenditure > 0 
                    ? ((totalRevenue - totalExpenditure) / totalExpenditure) * 100 
                    : 0;

                  return (
                    <TableRow key={dir}>
                      <TableCell>{dir}</TableCell>
                      <TableCell align="right">{totalProjects}</TableCell>
                      <TableCell align="right">{formatCurrency(totalCAValue)}</TableCell>
                      <TableCell align="right">{avgProgress.toFixed(2)}%</TableCell>
                      <TableCell align="right">{formatCurrency(totalRevenue)}</TableCell>
                      <TableCell align="right">{formatCurrency(totalExpenditure)}</TableCell>
                      <TableCell align="right">{profitability.toFixed(2)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {reportType === 'directorate' && directorate !== 'All' && (
        <Card elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {directorate} Directorate Report
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell align="right">CA Value</TableCell>
                  <TableCell align="right">Progress</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Expenditure</TableCell>
                  <TableCell align="right">Profitability</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map(project => {
                  const kpis = calculateProjectKPIs(project);
                  return (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell align="right">{formatCurrency(project.caValue)}</TableCell>
                      <TableCell align="right">{kpis.progressPercentage}%</TableCell>
                      <TableCell align="right">{formatCurrency(kpis.actualRevenue)}</TableCell>
                      <TableCell align="right">{formatCurrency(kpis.totalExpenditure)}</TableCell>
                      <TableCell align="right">{kpis.profitability}%</TableCell>
                      <TableCell align="right">{project.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {reportType === 'project' && selectedProject !== 'All' && (
        <Card elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Project Detailed Report
          </Typography>
          {filteredProjects.map(project => {
            const kpis = calculateProjectKPIs(project);
            return (
              <Box key={project.id}>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Directorate:</strong> {project.directorate}</Typography>
                    <Typography><strong>Category:</strong> {project.category}</Typography>
                    <Typography><strong>Location:</strong> {project.location}</Typography>
                    <Typography><strong>Client:</strong> {project.client}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>CA Value:</strong> {formatCurrency(project.caValue)}</Typography>
                    <Typography><strong>Revised CA Value:</strong> {formatCurrency(project.revisedCaValue)}</Typography>
                    <Typography><strong>Status:</strong> {project.status}</Typography>
                    <Typography><strong>Progress:</strong> {kpis.progressPercentage}%</Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Financial Summary
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Revenue</TableCell>
                        <TableCell align="right">{formatCurrency(kpis.actualRevenue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Expenditure</TableCell>
                        <TableCell align="right">{formatCurrency(kpis.totalExpenditure)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Profit</TableCell>
                        <TableCell align="right">{formatCurrency(kpis.actualRevenue - kpis.totalExpenditure)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Profitability</TableCell>
                        <TableCell align="right">{kpis.profitability}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Card>
      )}
    </Box>
  );
};

export default ExecutiveReports;
