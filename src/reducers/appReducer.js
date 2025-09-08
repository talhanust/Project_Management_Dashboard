export const initialState = {
  projects: [],
  selectedProject: null,
  darkMode: false,
  filters: {
    directorate: 'All',
    status: 'All',
    dateRange: {
      start: null,
      end: null,
    },
  },
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        selectedProject: state.selectedProject?.id === action.payload ? null : state.selectedProject,
      };
    case 'SELECT_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
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
    case 'SET_DARK_MODE':
      return {
        ...state,
        darkMode: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
