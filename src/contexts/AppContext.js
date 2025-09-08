import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  projects: [],
  selectedProject: null,
  darkMode: false
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
    default:
      return state;
  }
};

// Local storage functions
const getProjects = () => {
  try {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) : null;
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return null;
  }
};

const saveProjects = (projects) => {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
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

  // Load projects from localStorage on mount
  useEffect(() => {
    const projects = getProjects();
    if (projects) {
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    saveProjects(state.projects);
  }, [state.projects]);

  // Context actions
  const addProject = (project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const updateProject = (project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
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

  // Context value
  const value = {
    ...state,
    addProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    setDarkMode
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
