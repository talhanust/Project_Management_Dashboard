import React, { useState, useEffect } from 'react';
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
  Tab,
  CircularProgress
} from '@mui/material';
import {
  Description as ReportIcon,
  PictureAsPdf as PdfIcon,
  Article as WordIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import * as docx from 'docx';
import { saveAs } from 'file-saver';
import PPTXGenJS from 'pptxgenjs';

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
  const [generating, setGenerating] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    // Filter projects based on directorate selection
    if (directorate === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.directorate === directorate));
    }
  }, [directorate, projects]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (e) => {
    const newReportType = e.target.value;
    setReportType(newReportType);
    
    // Reset selections when changing report type
    if (newReportType === 'overall') {
      setDirectorate('All');
      setSelectedProject('All');
    } else if (newReportType === 'directorate') {
      setSelectedProject('All');
    }
  };

  const handleDirectorateChange = (e) => {
    const newDirectorate = e.target.value;
    setDirectorate(newDirectorate);
    
    // Reset project selection when changing directorate
    if (reportType === 'project') {
      setSelectedProject('All');
    }
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerateStatus('Report generated successfully!');
      setGenerating(false);
      setTimeout(() => setGenerateStatus(''), 3000);
    }, 1500);
  };

  const handleDownloadReport = async (format, type = reportType) => {
    setGenerating(true);
    try {
      if (format === 'word') {
        await generateWordReport(type);
      } else if (format === 'powerpoint') {
        await generatePowerPointReport(type);
      }
      setGenerateStatus(`${format.charAt(0).toUpperCase() + format.slice(1)} report downloaded successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      setGenerateStatus('Error generating report. Please try again.');
    } finally {
      setGenerating(false);
      setTimeout(() => setGenerateStatus(''), 3000);
    }
  };

  const generateWordReport = async (type) => {
    // Create a new document
    const doc = new docx.Document();

    // Add title
    doc.addSection({
      properties: {},
      children: [
        new docx.Paragraph({
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} Project Report`,
          heading: docx.HeadingLevel.HEADING_1,
        }),
        new docx.Paragraph({
          text: `Generated on ${new Date().toLocaleDateString()}`,
        }),
        new docx.Paragraph({ text: '' }),
      ],
    });

    // Add content based on report type
    if (type === 'overall') {
      const stats = calculateStatistics();
      doc.addSection({
        properties: {},
        children: [
          new docx.Paragraph({
            text: 'Executive Summary',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: `Total Projects: ${stats.total}`,
          }),
          new docx.Paragraph({
            text: `High Risk Projects: ${stats.highRisk}`,
          }),
          new docx.Paragraph({
            text: `Total Revenue: ${formatCurrency(stats.totalRevenue)}`,
          }),
          new docx.Paragraph({
            text: `Total Profit: ${formatCurrency(stats.totalProfit)}`,
          }),
        ],
      });
    }

    // Generate the document
    const buffer = await docx.Packer.toBuffer(doc);
    saveAs(new Blob([buffer]), `${type}-report.docx`);
  };

  const generatePowerPointReport = async (type) => {
    const pptx = new PPTXGenJS();
    const slide = pptx.addSlide();

    // Add title
    slide.addText(`${type.charAt(0).toUpperCase() + type.slice(1)} Project Report`, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 1,
      fontSize: 24,
      bold: true,
      color: '2c3e50',
    });

    // Add date
    slide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: 0.5,
      y: 1.5,
      w: '90%',
      h: 0.5,
      fontSize: 14,
      color: '7f8c8d',
    });

    // Add content based on report type
    if (type === 'overall') {
      const stats = calculateStatistics();
      slide.addText(`Total Projects: ${stats.total}`, {
        x: 0.5,
        y: 2.5,
        w: '40%',
        h: 0.5,
        fontSize: 16,
      });
      slide.addText(`High Risk Projects: ${stats.highRisk}`, {
        x: 0.5,
        y: 3.0,
        w: '40%',
        h: 0.5,
        fontSize: 16,
      });
      slide.addText(`Total Revenue: ${formatCurrency(stats.totalRevenue)}`, {
        x: 0.5,
        y: 3.5,
        w: '40%',
        h: 0.5,
        fontSize: 16,
      });
      slide.addText(`Total Profit: ${formatCurrency(stats.totalProfit)}`, {
        x: 0.5,
        y: 4.0,
        w: '40%',
        h: 0.5,
        fontSize: 16,
      });
    }

    // Save the presentation
    pptx.writeFile({ fileName: `${type}-report.pptx` });
  };

  const stats = calculateStatistics();

  const generateOverallReport = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Executive Summary
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #2c3e50, #3498db)', color: 'white' }}>
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2">Total Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #e74c3c, #ec7063)', color: 'white' }}>
              <Typography variant="h4">{stats.highRisk}</Typography>
              <Typography variant="body2">High Risk Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #27ae60, #2ecc71)', color: 'white' }}>
              <Typography variant="h4">{formatCurrency(stats.totalRevenue)}</Typography>
              <Typography variant="body2">Total Revenue</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #3498db, #5faee3)', color: 'white' }}>
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
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #2c3e50, #3498db)', color: 'white' }}>
              <Typography variant="h4">{dirProjects.length}</Typography>
              <Typography variant="body2">Total Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #e74c3c, #ec7063)', color: 'white' }}>
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
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(45deg, #27ae60, #2ecc71)', color: 'white' }}>
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
            <Typography><strong>Status:</strong> 
              <Chip 
                label={project.status} 
                color={
                  project.status === 'Completed' ? 'success' :
                  project.status === 'In Progress' ? 'warning' : 'info'
                }
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Financial Information</Typography>
            <Typography><strong>CA Value:</strong> {formatCurrency(project.caValue)}</Typography>
            <Typography><strong>Revised CA Value:</strong> {formatCurrency(project.revisedCaValue)}</Typography>
            <Typography><strong>Actual Revenue:</strong> {formatCurrency(kpis.actualRevenue)}</Typography>
            <Typography><strong>Profitability:</strong> 
              <Chip 
                label={`${riskLevels.profitability.toFixed(2)}%`} 
                color={
                  riskLevels.profitability >= (project.plannedProfitability || 0) ? 'success' :
                  riskLevels.profitability >= (project.plannedProfitability || 0) * 0.92 ? 'warning' :
                  riskLevels.profitability >= (project.plannedProfitability || 0) * 0.85 ? 'error' : 'default'
                }
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
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
                onChange={handleReportTypeChange}
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
                onChange={handleDirectorateChange}
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
                {filteredProjects.map(project => (
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
              startIcon={generating ? <CircularProgress size={20} /> : <ReportIcon />}
              disabled={generating}
              sx={{ mr: 2 }}
            >
              {generating ? 'Generating Report...' : 'Generate Report'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => handleDownloadReport('word')}
              startIcon={generating ? <CircularProgress size={20} /> : <WordIcon />}
              disabled={generating}
              sx={{ mr: 2 }}
            >
              Word Report
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => handleDownloadReport('powerpoint')}
              startIcon={generating ? <CircularProgress size={20} /> : <PdfIcon />}
              disabled={generating}
            >
              PowerPoint Report
            </Button>
          </Grid>

          {generateStatus && (
            <Grid item xs={12}>
              <Alert severity={generateStatus.includes('Error') ? 'error' : 'success'}>
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
                  disabled={generating}
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
                  disabled={generating}
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
