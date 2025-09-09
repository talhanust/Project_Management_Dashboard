// Local storage functions

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      projects: state.projects,
      currency: state.currency,
      filters: state.filters,
      kpiThresholds: state.kpiThresholds,
      darkMode: state.darkMode
    });
    localStorage.setItem('appState', serializedState);
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

export const loadSettings = () => {
  try {
    const serializedSettings = localStorage.getItem('appSettings');
    return serializedSettings ? JSON.parse(serializedSettings) : null;
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return null;
  }
};

export const saveSettings = (settings) => {
  try {
    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem('appSettings', serializedSettings);
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.removeItem('appState');
    localStorage.removeItem('appSettings');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const exportData = (data, filename = 'export.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  link.click();
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};
