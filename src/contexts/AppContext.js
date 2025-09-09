import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  projects: [],
  selectedProject: null,
  darkMode: false,
  currency: 'PKR',
  filters: {
    directorate: 'All',
    status: 'All',
    dateRange: {
      start: null,
      end: null,
    },
  },
  kpiThresholds: {
    lag: { low: 5, moderate: 10, high: 15 },
    scopeCreep: { low: 10, moderate: 15, high: 25 },
    slippage: { low: 5, moderate: 10, high: 15 },
    receivable: { low: 5, moderate: 10, high: 15 },
  }
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        selectedProject: state.selectedProject?.id === action.payload ? null : state.selectedProject,
      };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case 'ADD_TARGET':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              targets: [...(project.targets || []), action.payload.target],
            };
          }
          return project;
        }),
      };
    case 'ADD_PROGRESS':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              progress: [...(project.progress || []), action.payload.progress],
            };
          }
          return project;
        }),
      };
    case 'ADD_EXPENDITURE':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              expenditures: [...(project.expenditures || []), action.payload.expenditure],
            };
          }
          return project;
        }),
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === action.payload.projectId) {
            return {
              ...project,
              budget: action.payload.budget,
            };
          }
          return project;
        }),
      };
    default:
      return state;
  }
};

// Local storage functions
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      projects: state.projects,
      currency: state.currency,
      filters: state.filters,
      kpiThresholds: state.kpiThresholds
    });
    localStorage.setItem('appState', serializedState);
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      if (savedState.projects) dispatch({ type: 'SET_PROJECTS', payload: savedState.projects });
      if (savedState.currency) dispatch({ type: 'SET_CURRENCY', payload: savedState.currency });
      if (savedState.filters) dispatch({ type: 'SET_FILTERS', payload: savedState.filters });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state.projects, state.currency, state.filters, state.kpiThresholds]);

  // Context actions
  const addProject = (project) => {
    const projectWithId = {
      ...project,
      id: `PROJ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: projectWithId });
    return projectWithId.id;
  };

  const updateProject = (project) => {
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
  };

  const deleteProject = (projectId) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
  };

  const setSelectedProject = (project) => {
    dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
  };

  const setDarkMode = (isDark) => {
    dispatch({ type: 'SET_DARK_MODE', payload: isDark });
  };

  const setCurrency = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const addTarget = (projectId, target) => {
    dispatch({ type: 'ADD_TARGET', payload: { projectId, target } });
  };

  const addProgress = (projectId, progress) => {
    dispatch({ type: 'ADD_PROGRESS', payload: { projectId, progress } });
  };

  const addExpenditure = (projectId, expenditure) => {
    dispatch({ type: 'ADD_EXPENDITURE', payload: { projectId, expenditure } });
  };

  const addBudget = (projectId, budget) => {
    dispatch({ type: 'ADD_BUDGET', payload: { projectId, budget } });
  };

  // Helper functions for calculations
  const formatCurrency = (value) => {
    if (state.currency === 'PKR') {
      return `PKR ${Number(value).toLocaleString('en-PK')}`;
    } else {
      return `Rs ${(Number(value) / 1000000).toLocaleString('en-PK')} Mn`;
    }
  };

  const calculateProjectKPIs = (project) => {
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

  const calculateRiskLevels = (project, kpis) => {
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
    const slippagePercentage = kpis.actualRevenue > 0 ? ((kpis.slippage || 0) / kpis.actualRevenue) * 100 : 0;
    
    // Calculate receivable percentage
    const receivablePercentage = kpis.amountReceived > 0 ? ((kpis.receivable || 0) / kpis.amountReceived) * 100 : 0;
    
    // Determine risk levels based on thresholds
    const lagRisk = lagPercentage <= state.kpiThresholds.lag.low ? 'Low' :
                    lagPercentage <= state.kpiThresholds.lag.moderate ? 'Moderate' :
                    lagPercentage <= state.kpiThresholds.lag.high ? 'High' : 'Danger';
    
    const scopeCreepRisk = scopeCreepPercentage <= state.kpiThresholds.scopeCreep.low ? 'Low' :
                           scopeCreepPercentage <= state.kpiThresholds.scopeCreep.moderate ? 'Moderate' :
                           scopeCreepPercentage <= state.kpiThresholds.scopeCreep.high ? 'High' : 'Danger';
    
    const costVarianceRisk = costVariance >= 0 ? 'Under Budget' : 'Over Budget';
    
    const profitabilityRisk = profitability >= (project.plannedProfitability || 0) ? 'Excellent' :
                              profitability >= (project.plannedProfitability || 0) * 0.92 ? 'Satisfactory' :
                              profitability >= (project.plannedProfitability || 0) * 0.85 ? 'Risk' : 'Danger';
    
    const slippageRisk = slippagePercentage <= state.kpiThresholds.slippage.low ? 'Satisfactory' :
                         slippagePercentage <= state.kpiThresholds.slippage.moderate ? 'Low' :
                         slippagePercentage <= state.kpiThresholds.slippage.high ? 'High' : 'Danger';
    
    const receivableRisk = receivablePercentage <= state.kpiThresholds.receivable.low ? 'Satisfactory' :
                           receivablePercentage <= state.kpiThresholds.receivable.moderate ? 'Low' :
                           receivablePercentage <= state.kpiThresholds.receivable.high ? 'High' : 'Danger';
    
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

  // Calculate progress percentage for a project
  const calculateProgressPercentage = (project) => {
    if (!project.caValue || project.caValue === 0) return 0;
    
    const kpis = calculateProjectKPIs(project);
    return kpis.actualRevenue > 0 ? (kpis.actualRevenue / project.caValue) * 100 : 0;
  };

  // Get projects filtered by current filters
  const getFilteredProjects = () => {
    return state.projects.filter(project => {
      if (state.filters.directorate !== 'All' && project.directorate !== state.filters.directorate) return false;
      if (state.filters.status !== 'All' && project.status !== state.filters.status) return false;
      
      // Date range filtering
      if (state.filters.dateRange.start && project.createdAt < state.filters.dateRange.start) return false;
      if (state.filters.dateRange.end && project.createdAt > state.filters.dateRange.end) return false;
      
      return true;
    });
  };

  // Calculate overall statistics
  const calculateStatistics = () => {
    const projects = getFilteredProjects();
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

  // Context value
  const value = {
    ...state,
    addProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    setDarkMode,
    setCurrency,
    setFilters,
    addTarget,
    addProgress,
    addExpenditure,
    addBudget,
    formatCurrency,
    calculateProjectKPIs,
    calculateRiskLevels,
    calculateProgressPercentage,
    getFilteredProjects,
    calculateStatistics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
