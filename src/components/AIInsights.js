import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const AIInsights = () => {
  const { projects, calculateProjectKPIs, calculateRiskLevels, formatCurrency } = useApp();
  const [filters, setFilters] = useState({
    directorate: 'All',
    project: 'All'
  });
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    if (filters.directorate === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.directorate === filters.directorate));
    }
  }, [filters.directorate, projects]);

  const calculateRiskScore = useCallback((riskLevels) => {
    let score = 0;
    if (riskLevels.lagRisk === 'High') score += 3;
    if (riskLevels.lagRisk === 'Danger') score += 5;
    if (riskLevels.scopeCreepRisk === 'High') score += 2;
    if (riskLevels.scopeCreepRisk === 'Danger') score += 4;
    if (riskLevels.profitabilityRisk === 'Risk') score += 3;
    if (riskLevels.profitabilityRisk === 'Danger') score += 5;
    if (riskLevels.slippageRisk === 'High') score += 2;
    if (riskLevels.slippageRisk === 'Danger') score += 4;
    if (riskLevels.receivableRisk === 'High') score += 2;
    if (riskLevels.receivableRisk === 'Danger') score += 4;
    return score;
  }, []);

  const getAIRecommendations = useCallback((project, riskLevels) => {
    const recommendations = [];

    // Lag recommendations
    if (riskLevels.lagRisk === 'High' || riskLevels.lagRisk === 'Danger') {
      recommendations.push({
        type: 'timeline',
        priority: 'high',
        message: `Accelerate work progress. Current lag: ${formatCurrency(riskLevels.lag)} (${riskLevels.lagPercentage.toFixed(2)}%)`,
        action: 'Review resource allocation and consider overtime/weekend work'
      });
    }

    // Cost recommendations
    if (riskLevels.costVarianceRisk === 'Over Budget') {
      recommendations.push({
        type: 'cost',
        priority: 'high',
        message: `Project is over budget by ${formatCurrency(Math.abs(riskLevels.costVariance))}`,
        action: 'Implement cost control measures and review subcontractor agreements'
      });
    }

    // Profitability recommendations
    if (riskLevels.profitabilityRisk === 'Risk' || riskLevels.profitabilityRisk === 'Danger') {
      recommendations.push({
        type: 'financial',
        priority: 'high',
        message: `Profitability at risk: ${riskLevels.profitability.toFixed(2)}% vs planned ${project.plannedProfitability || 0}%`,
        action: 'Review pricing strategy and identify cost-saving opportunities'
      });
    }

    // Slippage recommendations
    if (riskLevels.slippageRisk === 'High' || riskLevels.slippageRisk === 'Danger') {
      recommendations.push({
        type: 'billing',
        priority: 'medium',
        message: `High slippage detected: ${formatCurrency(riskLevels.slippage)} (${riskLevels.slippagePercentage.toFixed(2)}%)`,
        action: 'Improve documentation and follow up with client for timely vetting'
      });
    }

    // Receivable recommendations
    if (riskLevels.receivableRisk === 'High' || riskLevels.receivableRisk === 'Danger') {
      recommendations.push({
        type: 'cashflow',
        priority: 'high',
        message: `High receivables: ${formatCurrency(riskLevels.receivable)} (${riskLevels.receivablePercentage.toFixed(2)}%)`,
        action: 'Strengthen collection process and follow up with client payments'
      });
    }

    // Scope creep recommendations
    if (riskLevels.scopeCreepRisk === 'High' || riskLevels.scopeCreepRisk === 'Danger') {
      recommendations.push({
        type: 'scope',
        priority: 'medium',
        message: `Significant scope creep: ${formatCurrency(riskLevels.scopeCreep)} (${riskLevels.scopeCreepPercentage.toFixed(2)}%)`,
        action: 'Review change orders and negotiate additional compensation'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        message: 'Project is performing well. Maintain current operations.',
        action: 'Continue monitoring key performance indicators'
      });
    }

    return recommendations;
  }, [formatCurrency]);

  const generateInsights = useCallback(async () => {
    setLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const filteredProjects = projects.filter(project => {
      if (filters.directorate !== 'All' && project.directorate !== filters.directorate) return false;
      if (filters.project !== 'All' && project.id !== filters.project) return false;
      return true;
    });

    const generatedInsights = filteredProjects.map(project => {
      const kpis = calculateProjectKPIs(project);
      const riskLevels = calculateRiskLevels(project, kpis);
      const recommendations = getAIRecommendations(project, riskLevels);

      return {
        project,
        kpis,
        riskLevels,
        recommendations,
        riskScore: calculateRiskScore(riskLevels)
      };
    }).sort((a, b) => b.riskScore - a.riskScore);

    setInsights(generatedInsights);
    setLoading(false);
  }, [projects, calculateProjectKPIs, calculateRiskLevels, filters, getAIRecommendations, calculateRiskScore]);

  useEffect(() => {
    generateInsights();
  }, [filters, generateInsights]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Insights & Recommendations
      </Typography>

      <Card elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Directorate</InputLabel>
              <Select
                value={filters.directorate}
                label="Filter by Directorate"
                onChange={(e) => handleFilterChange('directorate', e.target.value)}
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
                value={filters.project}
                label="Select Project"
                onChange={(e) => handleFilterChange('project', e.target.value)}
              >
                <MenuItem value="All">All Projects</MenuItem>
                {filteredProjects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name} - {project.directorate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              onClick={generateInsights}
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Generating Insights...' : 'Refresh Insights'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Generating AI insights...
          </Typography>
        </Box>
      ) : insights.length === 0 ? (
        <Alert severity="info">
          No projects match the selected filters or no insights available.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {insights.map((insight, index) => (
            <Grid item xs={12} key={insight.project.id}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {insight.project.name} - {insight.project.directorate}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {insight.project.status} • {insight.project.category}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<AssessmentIcon />}
                    label={`Risk Score: ${insight.riskScore}`}
                    color={
                      insight.riskScore >= 10 ? 'error' :
                      insight.riskScore >= 5 ? 'warning' : 'success'
                    }
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Metrics:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      <Chip
                        icon={<TrendingUpIcon />}
                        label={`Progress: ${((insight.kpis.actualRevenue / insight.project.caValue) * 100).toFixed(2)}%`}
                        size="small"
                        color="info"
                      />
                      <Chip
                        label={`Lag: ${formatCurrency(insight.riskLevels.lag)}`}
                        size="small"
                        color={insight.riskLevels.lagRisk === 'High' || insight.riskLevels.lagRisk === 'Danger' ? 'error' : 'default'}
                      />
                      <Chip
                        label={`Profit: ${insight.riskLevels.profitability.toFixed(2)}%`}
                        size="small"
                        color={
                          insight.riskLevels.profitabilityRisk === 'Excellent' ? 'success' :
                          insight.riskLevels.profitabilityRisk === 'Satisfactory' ? 'warning' : 'error'
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Risk Indicators:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.entries(insight.riskLevels).map(([key, value]) => {
                        if (key.endsWith('Risk') && value !== 'Satisfactory' && value !== 'Excellent') {
                          return (
                            <Chip
                              key={key}
                              icon={<WarningIcon />}
                              label={`${key.replace('Risk', '')}: ${value}`}
                              size="small"
                              color={
                                value === 'High' || value === 'Danger' || value === 'Risk' ? 'error' :
                                value === 'Moderate' ? 'warning' : 'default'
                              }
                            />
                          );
                        }
                        return null;
                      })}
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" gutterBottom>
                  AI Recommendations:
                </Typography>
                <Box>
                  {insight.recommendations.map((recommendation, recIndex) => (
                    <Alert
                      key={recIndex}
                      severity={getPriorityColor(recommendation.priority)}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {recommendation.message}
                      </Typography>
                      <Typography variant="body2">
                        {recommendation.action}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AIInsights;
