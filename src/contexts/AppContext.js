import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState } from './reducers';
import { 
  calculateProjectKPIs, 
  calculateRiskLevels, 
  calculateProgressPercentage, 
  calculateStatistics 
} from '../utils/calculations';
import { formatCurrency, formatNumber, formatDate, formatPercentage, formatRiskLevel } from '../utils/formatters';
import { loadState, saveState, loadSettings, saveSettings } from '../utils/storage';
import { sampleProjects } from '../data/sampleData';

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
    const savedSettings = loadSettings();
    
    if (savedState) {
      dispatch({ type: 'SET_PROJECTS', payload: savedState.projects || [] });
      if (savedState.currency) dispatch({ type: 'SET_CURRENCY', payload: savedState.currency });
      if (savedState.filters) dispatch({ type: 'SET_FILTERS', payload: savedState.filters });
      if (savedState.kpiThresholds) {
        // Update thresholds if needed
      }
      if (savedState.darkMode !== undefined) dispatch({ type: 'SET_DARK_MODE', payload: savedState.darkMode });
    } else {
      // If no saved state exists, use sample data
      dispatch({ type: 'SET_PROJECTS', payload: sampleProjects });
    }
    
    if (savedSettings) {
      if (savedSettings.currency) dispatch({ type: 'SET_CURRENCY', payload: savedSettings.currency });
      if (savedSettings.darkMode !== undefined) dispatch({ type: 'SET_DARK_MODE', payload: savedSettings.darkMode });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state.projects, state.currency, state.filters, state.kpiThresholds, state.darkMode]);

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
    saveSettings({ ...loadSettings(), darkMode: isDark });
  };

  const setCurrency = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
    saveSettings({ ...loadSettings(), currency });
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

  const resetToSampleData = () => {
    dispatch({ type: 'RESET_TO_SAMPLE_DATA', payload: sampleProjects });
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
    resetToSampleData,
    formatCurrency: (value) => formatCurrency(value, state.currency),
    formatNumber,
    formatDate,
    formatPercentage,
    formatRiskLevel,
    calculateProjectKPIs: (project) => calculateProjectKPIs(project),
    calculateRiskLevels: (project, kpis) => calculateRiskLevels(project, kpis, state.kpiThresholds),
    calculateProgressPercentage,
    calculateStatistics: () => calculateStatistics(
      state.projects, 
      calculateProjectKPIs, 
      (project, kpis) => calculateRiskLevels(project, kpis, state.kpiThresholds),
      state.kpiThresholds
    ),
    getFilteredProjects
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
