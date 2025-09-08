// Local storage utilities for data persistence

export const getProjects = () => {
  try {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Error loading projects from storage:', error);
    return [];
  }
};

export const saveProjects = (projects) => {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to storage:', error);
  }
};

export const getProject = (projectId) => {
  const projects = getProjects();
  return projects.find(p => p.id === projectId);
};

export const saveProject = (project) => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  saveProjects(projects);
};

export const deleteProject = (projectId) => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== projectId);
  saveProjects(filteredProjects);
};

export const getAppSettings = () => {
  try {
    const settings = localStorage.getItem('appSettings');
    return settings ? JSON.parse(settings) : {
      currency: 'PKR',
      numberFormat: true,
      theme: 'light',
      dateFormat: 'YYYY-MM-DD',
    };
  } catch (error) {
    console.error('Error loading app settings:', error);
    return {
      currency: 'PKR',
      numberFormat: true,
      theme: 'light',
      dateFormat: 'YYYY-MM-DD',
    };
  }
};

export const saveAppSettings = (settings) => {
  try {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
  }
};
