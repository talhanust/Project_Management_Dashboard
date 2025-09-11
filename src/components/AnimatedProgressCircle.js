import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const AnimatedProgressCircle = ({ value, size, thickness }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{ color: '#e0e0e0' }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          left: 0,
          color: value >= 80 ? '#4caf50' : value >= 60 ? '#ff9800' : '#f44336',
          transition: 'all 0.5s ease-in-out'
        }}
      />
    </Box>
  );
};

export default AnimatedProgressCircle;
