import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ILabelWithIconProps {
  icon: React.ReactNode;
  label: string;
}

const LabelWithIcon = (props: ILabelWithIconProps) => {
  const { icon, label } = props;

  return (
    <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {icon}
      <Typography sx={{ m: 0 }} variant='body1' color='textPrimary'>
        {label}
      </Typography>
    </Box>
  );
};

export default LabelWithIcon;
