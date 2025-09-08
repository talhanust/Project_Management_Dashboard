// Formatting utilities

export const formatCurrency = (value, currency = 'PKR') => {
  if (value === null || value === undefined) return '-';
  
  const formattedValue = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  
  if (currency === 'Rs Mn') {
    return `Rs. ${formattedValue} Mn`;
  } else {
    return `PKR ${formattedValue}`;
  }
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(2)}%`;
};

export const formatDate = (dateString, format = 'YYYY-MM-DD') => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  if (format === 'DD/MM/YYYY') {
    return date.toLocaleDateString('en-GB');
  } else if (format === 'MM/DD/YYYY') {
    return date.toLocaleDateString('en-US');
  } else {
    return date.toISOString().split('T')[0];
  }
};

export const formatNumber = (value, useSeparators = true) => {
  if (value === null || value === undefined) return '-';
  
  if (useSeparators) {
    return new Intl.NumberFormat('en-PK').format(value);
  } else {
    return value.toString();
  }
};
