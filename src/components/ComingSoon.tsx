import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useTranslation from 'hooks/useTranslation';

const ComingSoon = () => {
  const intl = useTranslation();

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography>{intl.translate({ id: 'app.coming_soon' })}</Typography>
    </Box>
  );
};

export default ComingSoon;
