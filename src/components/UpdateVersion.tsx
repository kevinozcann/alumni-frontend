import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useClearCacheCtx } from 'react-clear-cache';

import useTranslation from 'hooks/useTranslation';

const UpdateVersion = () => {
  const { emptyCacheStorage } = useClearCacheCtx();
  const intl = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center'
      }}
    >
      <Typography variant='h6' sx={{ mb: 2, p: 2, backgroundColor: 'red', color: 'white' }}>
        {intl.translate({ id: 'app.update.version.explanation' })}
      </Typography>
      <Button
        variant='contained'
        color='secondary'
        onClick={(e) => {
          e.preventDefault();
          emptyCacheStorage();
        }}
      >
        {intl.translate({ id: 'app.update.version' })}
      </Button>
    </Box>
  );
};

export default UpdateVersion;
