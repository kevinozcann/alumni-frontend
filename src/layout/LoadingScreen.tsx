import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const Loading = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  minHeight: '100%',
  padding: theme.spacing(3)
}));

export const LoadingScreen: React.FC = () => {
  return (
    <Loading>
      <Box width='100%'>
        <CircularProgress />
      </Box>
    </Loading>
  );
};

export const LoadableScreen = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
