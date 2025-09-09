// Utility functions for report generation and data export

export const generateWordReport = (data, reportType) => {
  // This would generate a Word document in a real application
  console.log('Generating Word report for:', reportType, data);
  return 'word-report.docx';
};

export const generatePowerPointReport = (data, reportType) => {
  // This would generate a PowerPoint presentation in a real application
  console.log('Generating PowerPoint report for:', reportType, data);
  return 'powerpoint-report.pptx';
};

export const generatePDFReport = (data, reportType) => {
  // This would generate a PDF document in a real application
  console.log('Generating PDF report for:', reportType, data);
  return 'report.pdf';
};

export const formatReportData = (projects, calculations) => {
  // Format data for report generation
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalProjects: projects.length,
      totalRevenue: calculations.totalRevenue,
      totalExpenditure: calculations.totalExpenditure,
      totalProfit: calculations.totalProfit
    },
    projects: projects.map(project => ({
      id: project.id,
      name: project.name,
      directorate: project.directorate,
      status: project.status,
      financials: {
        caValue: project.caValue,
        actualRevenue: calculations.calculateProjectKPIs(project).actualRevenue,
        profitability: calculations.calculateRiskLevels(project, calculations.calculateProjectKPIs(project)).profitability
      }
    }))
  };
};

export const downloadFile = (filename, content) => {
  // Simulate file download
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
