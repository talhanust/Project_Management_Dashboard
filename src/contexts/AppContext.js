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
        projects: state.projects.filter(project => project.id !== action.payload)
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
    const serializedState = JSON.stringify(state);
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
      dispatch({ type: 'SET_PROJECTS', payload: savedState.projects || [] });
      if (savedState.currency) dispatch({ type: 'SET_CURRENCY', payload: savedState.currency });
      if (savedState.filters) dispatch({ type: 'SET_FILTERS', payload: savedState.filters });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

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
    // Implementation for KPI calculations
    const latestProgress = project.progress && project.progress.length > 0 
      ? project.progress[project.progress.length - 1] 
      : null;
    
    const plannedTarget = project.targets ? project.targets.reduce((sum, target) => sum + target.value, 0) : 0;
    const actualRevenue = latestProgress ? latestProgress.uptoDateActualRevenue : 0;
    const lag = plannedTarget - actualRevenue;
    
    const scopeCreep = project.revisedCaValue - project.caValue;
    
    const totalExpenditure = latestProgress ? Object.values(latestProgress.expenditures || {}).reduce((sum, val) => sum + val, 0) : 0;
    const costVariance = actualRevenue - totalExpenditure;
    
    const profitability = totalExpenditure > 0 ? ((actualRevenue - totalExpenditure) / totalExpenditure) * 100 : 0;
    
    const slippage = latestProgress ? latestProgress.uptoDateSlippage : 0;
    const receivable = latestProgress ? latestProgress.uptoDateReceivable : 0;
    
    return {
      lag,
      scopeCreep,
      costVariance,
      profitability,
      slippage,
      receivable,
      riskLevels: calculateRiskLevels(project, {
        lag,
        scopeCreep,
        slippage,
        receivable,
        profitability
      })
    };
  };

  const calculateRiskLevels = (project, kpis) => {
    const { lag, scopeCreep, slippage, receivable, profitability } = kpis;
    const thresholds = state.kpiThresholds;
    
    const lagPercentage = project.targets && project.targets.length > 0 
      ? (lag / project.targets.reduce((sum, target) => sum + target.value, 0)) * 100 
      : 0;
    
    const scopeCreepPercentage = project.caValue > 0 
      ? (scopeCreep / project.caValue) * 100 
      : 0;
    
    const slippagePercentage = kpis.actualRevenue > 0 
      ? (slippage / kpis.actualRevenue) * 100 
      : 0;
    
    const receivablePercentage = latestProgress && latestProgress.uptoDateAmountReceived > 0 
      ? (receivable / latestProgress.uptoDateAmountReceived) * 100 
      : 0;
    
    return {
      lag: lagPercentage <= thresholds.lag.low ? 'Low' : 
           lagPercentage <= thresholds.lag.moderate ? 'Moderate' :
           lagPercentage <= thresholds.lag.high ? 'High' : 'Danger',
      scopeCreep: scopeCreepPercentage <= thresholds.scopeCreep.low ? 'Low' : 
                  scopeCreepPercentage <= thresholds.scopeCreep.moderate ? 'Moderate' :
                  scopeCreepPercentage <= thresholds.scopeCreep.high ? 'High' : 'Danger',
      slippage: slippagePercentage <= thresholds.slippage.low ? 'Satisfactory' : 
                slippagePercentage <= thresholds.slippage.moderate ? 'Low' :
                slippagePercentage <= thresholds.slippage.high ? 'High' : 'Danger',
      receivable: receivablePercentage <= thresholds.receivable.low ? 'Satisfactory' : 
                  receivablePercentage <= thresholds.receivable.moderate ? 'Low' :
                  receivablePercentage <= thresholds.receivable.high ? 'High' : 'Danger',
      profitability: profitability >= project.plannedProfitability ? 'Excellent' : 
                    profitability >= project.plannedProfitability * 0.92 ? 'Satisfactory' :
                    profitability >= project.plannedProfitability * 0.95 ? 'Risk' : 'Danger'
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
    calculateProjectKPIs
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
