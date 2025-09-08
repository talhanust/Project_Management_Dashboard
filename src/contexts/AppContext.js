import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState } from '../reducers/appReducer';
import { getProjects, saveProjects } from '../utils/storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load projects from localStorage
    const projects = getProjects();
    if (projects) {
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    }
  }, []);

  useEffect(() => {
    // Save projects to localStorage whenever they change
    saveProjects(state.projects);
  }, [state.projects]);

  const addProject = (project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const updateProject = (project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
  };

  const deleteProject = (projectId) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
  };

  const addProgress = (projectId, progress) => {
    dispatch({ type: 'ADD_PROGRESS', payload: { projectId, progress } });
  };

  const addExpenditure = (projectId, expenditure) => {
    dispatch({ type: 'ADD_EXPENDITURE', payload: { projectId, expenditure } });
  };

  const setDarkMode = (isDark) => {
    dispatch({ type: 'SET_DARK_MODE', payload: isDark });
  };

  const value = {
    ...state,
    addProject,
    updateProject,
    deleteProject,
    addProgress,
    addExpenditure,
    setDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
