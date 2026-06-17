import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import logger from './services/logger';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#2e7d32' },
  },
});

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Notification System
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            onClick={() => navigate('/')}
            sx={{ borderColor: location.pathname === '/' ? 'white' : 'transparent' }}
          >
            All
          </Button>
          <Button
            color="inherit"
            variant={location.pathname === '/priority' ? 'outlined' : 'text'}
            onClick={() => navigate('/priority')}
            sx={{ borderColor: location.pathname === '/priority' ? 'white' : 'transparent' }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<AllNotifications />} />
        <Route path="/priority" element={<PriorityInbox />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  React.useEffect(() => {
    logger.info('APPLICATION_STARTUP');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}
