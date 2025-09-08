import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon
} from '@mui/icons-material';

const Navigation = ({ darkMode, toggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project Management Dashboard
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme}>
          {darkMode ? <LightIcon /> : <DarkIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
