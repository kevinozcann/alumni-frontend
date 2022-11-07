import React from 'react';
import { Box, Link, Stack, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';

type TActionBoxProps = {
  actionUrl: string;
  title?: string;
  icon?: IconDefinition;
  boxStyle?: string;
};

const ActionBox: React.FC<TActionBoxProps> = (props) => {
  const { title, actionUrl, icon, boxStyle } = props;
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
    <Link href={actionUrl}>
      <Box
        sx={{
          borderRadius: 3,
          backgroundColor: boxColor.light,
          p: 2,
          mx: 1,
          mb: 1
        }}
      >
        <Stack
          sx={{ mt: 1, width: '100%', alignContent: 'center', alignItems: 'center' }}
          direction='column'
        >
          <FontAwesomeIcon icon={icon} size='2x' color={boxColor.dark} />
          <Typography sx={{ mt: 1, fontSize: '90%' }} variant='h6' color={boxColor.contrastText}>
            {title}
          </Typography>
        </Stack>
      </Box>
    </Link>
  );
};

export default ActionBox;
