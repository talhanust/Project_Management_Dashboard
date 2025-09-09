// Utility functions for project calculations

export const calculateKpisForProject = (project) => {
  if (!project.targets || project.targets.length === 0) {
    return { lagPercent: 0, riskLevel: 'No data' };
  }
  
  const totalPlanned = project.targets.reduce((sum, target) => sum + (target.plannedAmount || 0), 0);
  const totalActual = project.progress 
    ? project.progress.reduce((sum, prog) => sum + (prog.workDone || 0), 0)
    : 0;
  
  const lagAmount = totalPlanned - totalActual;
  const lagPercent = totalPlanned > 0 ? (lagAmount / totalPlanned) * 100 : 0;
  
  // Determine risk level
  let riskLevel = 'Low';
  if (lagPercent <= 5) {
    riskLevel = 'Low';
  } else if (lagPercent <= 10) {
    riskLevel = 'Moderate';
  } else if (lagPercent <= 15) {
    riskLevel = 'High';
  } else {
    riskLevel = 'Danger';
  }
  
  return { lagPercent, riskLevel };
};

export const calculateFinancialsForProject = (project) => {
  if (!project.progress || project.progress.length === 0) {
    return {};
  }
  
  const totalActualRevenue = project.progress.reduce((sum, prog) => sum + (prog.workDone || 0), 0);
  const totalVettedRevenue = project.progress.reduce((sum, prog) => sum + (prog.vettedRevenue || 0), 0);
  const totalReceived = project.progress.reduce((sum, prog) => sum + (prog.amountReceived || 0), 0);
  const totalExpenditure = project.expenditures 
    ? project.expenditures.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    : 0;
  
  const slippage = totalActualRevenue - totalVettedRevenue;
  const receivable = totalVettedRevenue - totalReceived;
  const costVariance = totalActualRevenue - totalExpenditure;
  const profitability = totalExpenditure > 0 
    ? ((totalActualRevenue - totalExpenditure) / totalExpenditure) * 100 
    : 0;
  
  const scopeCreep = project.revisedCaValue - project.caValue || 0;
  const scopeCreepPercent = project.caValue > 0 
    ? (scopeCreep / project.caValue) * 100 
    : 0;
  
  return {
    totalActualRevenue,
    totalVettedRevenue,
    totalReceived,
    totalExpenditure,
    slippage,
    receivable,
    costVariance,
    profitability,
    scopeCreep,
    scopeCreepPercent
  };
};

export const generateScurveData = (targets) => {
  if (!targets || targets.length === 0) {
    return [];
  }
  
  return targets.map((target, index) => {
    const cumulative = targets
      .slice(0, index + 1)
      .reduce((sum, t) => sum + (t.plannedAmount || 0), 0);
    
    return {
      month: target.month,
      planned: target.plannedAmount || 0,
      cumulative
    };
  });
};

export const calculateProjectHealth = (project) => {
  const { lagPercent } = calculateKpisForProject(project);  // removed riskLevel
  const financials = calculateFinancialsForProject(project);
  
  let healthScore = 100;
  
  // Deduct points based on lag
  healthScore -= Math.min(lagPercent * 2, 50);
  
  // Deduct points based on cost variance (if negative)
  if (financials.costVariance < 0) {
    healthScore -= Math.min(Math.abs(financials.costVariance) / project.caValue * 100, 25);
  }
  
  // Deduct points based on slippage
  if (financials.slippage > 0) {
    healthScore -= Math.min(financials.slippage / project.caValue * 100, 15);
  }
  
  // Deduct points based on receivables
  if (financials.receivable > 0) {
    healthScore -= Math.min(financials.receivable / project.caValue * 100, 10);
  }
  
  return Math.max(0, Math.round(healthScore));
};

