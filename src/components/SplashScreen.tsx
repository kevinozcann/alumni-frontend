import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const SplashScreen = () => (
  <Box
    sx={{
      alignItems: 'center',
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      left: 0,
      py: 3,
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 2000
    }}
  >
    <CircularProgress />
  </Box>
);

export default SplashScreen;
