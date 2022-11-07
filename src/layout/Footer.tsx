import React from 'react';
import { Box, Typography } from '@mui/material';
import { SmartClassStartYear } from '../config';
import Legal from './Legal';

export const Footer = () => {
  const today = new Date().getFullYear();

  return (
    <Box
      sx={{
        padding: 1,
        textAlign: 'center',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography color='textPrimary' variant='subtitle2'>
        {SmartClassStartYear.toString()}-{today.toString()} &copy; Schoost by SmartClass
      </Typography>
      <Legal
        color='contrast'
        sx={{ display: 'flex', justifyContent: 'center', '& h6': { fontSize: '0.75rem' } }}
      />
    </Box>
  );
};

export default Footer;
