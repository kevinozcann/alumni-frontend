import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';

type TStatsBoxProps = {
  title?: string;
  value?: number | string | React.ReactNode;
  icon?: IconDefinition;
  boxStyle?: string;
};

const StatsBox: React.FC<TStatsBoxProps> = (props) => {
  const { title, value, icon, boxStyle } = props;
  const theme = useTheme();
  const boxColor =
    (boxStyle === 'primary' && theme.palette.primary) ||
    (boxStyle === 'secondary' && theme.palette.secondary) ||
    (boxStyle === 'success' && theme.palette.success) ||
    (boxStyle === 'info' && theme.palette.info) ||
    (boxStyle === 'warning' && theme.palette.warning) ||
    (boxStyle === 'danger' && theme.palette.error) ||
    theme.palette.primary;

  return (
    <Box
      sx={{
        borderRadius: 3,
        backgroundColor: boxColor.light,
        py: 3,
        px: 2,
        m: 1,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1
        }}
      >
        <Box sx={{ my: 1 }}>
          <FontAwesomeIcon icon={icon} size='2x' color={boxColor.dark} />
        </Box>
        <Typography
          sx={{ fontSize: '200%' }}
          variant='h1'
          color={boxColor.contrastText}
          fontWeight='800'
        >
          {value}
        </Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: '90%' }} variant='h6' color={boxColor.contrastText}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatsBox;
