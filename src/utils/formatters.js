// Formatting functions

export const formatCurrency = (value, currency = 'PKR') => {
  if (currency === 'PKR') {
    return `PKR ${Number(value).toLocaleString('en-PK')}`;
  } else {
    return `Rs ${(Number(value) / 1000000).toLocaleString('en-PK')} Mn`;
  }
};

export const formatNumber = (value, format = 'en-PK') => {
  return new Intl.NumberFormat(format).format(value);
};

export const formatDate = (date, format = 'dd/MM/yyyy') => {
  const dateObj = new Date(date);
  
  switch (format) {
    case 'dd/MM/yyyy':
      return dateObj.toLocaleDateString('en-GB');
    case 'MM/dd/yyyy':
      return dateObj.toLocaleDateString('en-US');
    case 'yyyy-MM-dd':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString();
  }
};

export const formatPercentage = (value, decimals = 2) => {
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatRiskLevel = (level) => {
  switch (level) {
    case 'Low': return { text: 'Low Risk', color: 'success' };
    case 'Moderate': return { text: 'Moderate Risk', color: 'warning' };
    case 'High': return { text: 'High Risk', color: 'error' };
    case 'Danger': return { text: 'Critical Risk', color: 'error' };
    case 'Excellent': return { text: 'Excellent', color: 'success' };
    case 'Satisfactory': return { text: 'Satisfactory', color: 'warning' };
    case 'Risk': return { text: 'At Risk', color: 'error' };
    default: return { text: level, color: 'default' };
  }
};
