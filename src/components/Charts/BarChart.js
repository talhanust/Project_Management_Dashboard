import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const CustomBarChart = ({ data, title, xAxisKey, barKey, color = '#3498db' }) => {
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
  const bKey = barKey || 'value';

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom align="center">
        {title || 'Project Progress'}
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
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
              formatter={(value) => [`${value}%`, 'Progress']}
              labelFormatter={(value) => `Month: ${value}`}
            />
            <Legend />
            <Bar 
              dataKey={bKey} 
              fill={color} 
              name="Completion %"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CustomBarChart;
