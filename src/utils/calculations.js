// KPI and financial calculations

export const calculateProjectKPIs = (project) => {
  const latestProgress = project.progress && project.progress.length > 0 
    ? project.progress[project.progress.length - 1] 
    : null;
  
  const actualRevenue = latestProgress ? latestProgress.calculations?.uptoDateActualRevenue || 0 : 0;
  const vettedRevenue = latestProgress ? latestProgress.calculations?.uptoDateVettedRevenue || 0 : 0;
  const amountReceived = latestProgress ? latestProgress.calculations?.uptoDateAmountReceived || 0 : 0;
  const slippage = latestProgress ? latestProgress.calculations?.uptoDateSlippage || 0 : 0;
  const receivable = latestProgress ? latestProgress.calculations?.uptoDateReceivable || 0 : 0;
  const expenditures = latestProgress ? latestProgress.expenditures || {} : {};
  
  return {
    actualRevenue,
    vettedRevenue,
    amountReceived,
    slippage,
    receivable,
    expenditures
  };
};

export const calculateRiskLevels = (project, kpis, thresholds) => {
  // Calculate planned revenue from targets
  const plannedRevenue = project.targets ? 
    project.targets.reduce((sum, target) => sum + (target.value || 0), 0) : 0;
  
  // Calculate lag
  const lag = plannedRevenue - (kpis.actualRevenue || 0);
  const lagPercentage = plannedRevenue > 0 ? (lag / plannedRevenue) * 100 : 0;
  
  // Calculate scope creep
  const scopeCreep = (project.revisedCaValue || 0) - (project.caValue || 0);
  const scopeCreepPercentage = project.caValue > 0 ? (scopeCreep / project.caValue) * 100 : 0;
  
  // Calculate total expenditure
  const totalExpenditure = Object.values(kpis.expenditures || {}).reduce((sum, val) => sum + (val || 0), 0);
  
  // Calculate cost variance
  const costVariance = (kpis.actualRevenue || 0) - totalExpenditure;
  
  // Calculate profitability
  const profitability = totalExpenditure > 0 ? ((kpis.actualRevenue || 0) - totalExpenditure) / totalExpenditure * 100 : 0;
  
  // Calculate slippage percentage
  const slippagePercentage = kpis.actualRevenue > 0 ? (kpis.slippage / kpis.actualRevenue) * 100 : 0;
  
  // Calculate receivable percentage
  const receivablePercentage = kpis.amountReceived > 0 ? (kpis.receivable / kpis.amountReceived) * 100 : 0;
  
  // Determine risk levels based on thresholds
  const lagRisk = lagPercentage <= thresholds.lag.low ? 'Low' :
                  lagPercentage <= thresholds.lag.moderate ? 'Moderate' :
                  lagPercentage <= thresholds.lag.high ? 'High' : 'Danger';
  
  const scopeCreepRisk = scopeCreepPercentage <= thresholds.scopeCreep.low ? 'Low' :
                         scopeCreepPercentage <= thresholds.scopeCreep.moderate ? 'Moderate' :
                         scopeCreepPercentage <= thresholds.scopeCreep.high ? 'High' : 'Danger';
  
  const costVarianceRisk = costVariance >= 0 ? 'Under Budget' : 'Over Budget';
  
  const profitabilityRisk = profitability >= (project.plannedProfitability || 0) ? 'Excellent' :
                            profitability >= (project.plannedProfitability || 0) * 0.92 ? 'Satisfactory' :
                            profitability >= (project.plannedProfitability || 0) * 0.85 ? 'Risk' : 'Danger';
  
  const slippageRisk = slippagePercentage <= thresholds.slippage.low ? 'Satisfactory' :
                       slippagePercentage <= thresholds.slippage.moderate ? 'Low' :
                       slippagePercentage <= thresholds.slippage.high ? 'High' : 'Danger';
  
  const receivableRisk = receivablePercentage <= thresholds.receivable.low ? 'Satisfactory' :
                         receivablePercentage <= thresholds.receivable.moderate ? 'Low' :
                         receivablePercentage <= thresholds.receivable.high ? 'High' : 'Danger';
  
  return {
    lag,
    lagPercentage,
    lagRisk,
    scopeCreep,
    scopeCreepPercentage,
    scopeCreepRisk,
    costVariance,
    costVarianceRisk,
    profitability,
    profitabilityRisk,
    slippage: kpis.slippage || 0,
    slippagePercentage,
    slippageRisk,
    receivable: kpis.receivable || 0,
    receivablePercentage,
    receivableRisk,
    totalExpenditure,
    plannedRevenue,
    actualRevenue: kpis.actualRevenue || 0
  };
};

export const calculateProgressPercentage = (project) => {
  if (!project.caValue || project.caValue === 0) return 0;
  
  const kpis = calculateProjectKPIs(project);
  return kpis.actualRevenue > 0 ? (kpis.actualRevenue / project.caValue) * 100 : 0;
};

export const calculateStatistics = (projects, calculateProjectKPIs, calculateRiskLevels, thresholds) => {
  const total = projects.length;
  const inProgress = projects.filter(p => p.status === 'In Progress').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const planning = projects.filter(p => p.status === 'Planning').length;
  
  // Calculate financial totals
  const totalCAValue = projects.reduce((sum, p) => sum + (p.caValue || 0), 0);
  
  let totalRevenue = 0;
  let totalExpenditure = 0;
  let highRiskCount = 0;
  
  projects.forEach(project => {
    const kpis = calculateProjectKPIs(project);
    const riskLevels = calculateRiskLevels(project, kpis, thresholds);
    
    totalRevenue += kpis.actualRevenue || 0;
    totalExpenditure += riskLevels.totalExpenditure || 0;
    
    // Check if project is high risk
    if (riskLevels.lagRisk === 'High' || riskLevels.lagRisk === 'Danger' ||
        riskLevels.scopeCreepRisk === 'High' || riskLevels.scopeCreepRisk === 'Danger' ||
        riskLevels.profitabilityRisk === 'Risk' || riskLevels.profitabilityRisk === 'Danger' ||
        riskLevels.slippageRisk === 'High' || riskLevels.slippageRisk === 'Danger' ||
        riskLevels.receivableRisk === 'High' || riskLevels.receivableRisk === 'Danger') {
      highRiskCount++;
    }
  });

  return {
    total,
    inProgress,
    completed,
    planning,
    highRisk: highRiskCount,
    totalCAValue,
    totalRevenue,
    totalExpenditure,
    totalProfit: totalRevenue - totalExpenditure
  };
};
