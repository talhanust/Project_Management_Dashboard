export const appReducer = (state, action) => {
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
    case 'RESET_TO_SAMPLE_DATA':
      return {
        ...state,
        projects: action.payload,
        selectedProject: null
      };
    default:
      return state;
  }
};

export const initialState = {
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
