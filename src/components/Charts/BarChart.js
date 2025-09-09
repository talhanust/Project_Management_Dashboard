import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';

const BarChart = ({ data, title, xAxisKey, barKeys, colors, tooltipFormatter, legendFormatter }) => {
  const theme = useTheme();
  
  // Default data if none provided
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
  ];

  const chartData = data || defaultData;
  const xKey = xAxisKey || 'name';
  const bars = barKeys || ['value'];
  const colorPalette = colors || [theme.palette.primary.main];

  const formatTooltipValue = (value, name) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, name);
    }
    return [value, name];
  };

  const formatLegend = (value) => {
    if (legendFormatter) {
      return legendFormatter(value);
    }
    return value;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom align="center">
        {title || 'Project Progress'}
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <RechartsBarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip 
              formatter={formatTooltipValue}
            />
            <Legend formatter={formatLegend} />
            {bars.map((bar, index) => (
              <Bar 
                key={bar}
                dataKey={bar} 
                fill={colorPalette[index % colorPalette.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BarChart;
