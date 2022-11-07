import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingBar = () => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        justifyContent: 'center',
        mb: 1,
        mx: 3,
        minHeight: '100%'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export const Loadable = (Component: any) => (props: any) =>
  (
    <React.Suspense fallback={<LoadingBar />}>
      <Component {...props} />
    </React.Suspense>
  );
