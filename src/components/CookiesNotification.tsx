import React from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';

import { privacyUrl } from 'config';
import useTranslation from 'hooks/useTranslation';

const CookiesNotification = () => {
  const theme = useTheme();
  const intl = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    localStorage.setItem('cookieAccepted', '1');
    setOpen(false);
  };

  React.useEffect(() => {
    const consent = localStorage.getItem('cookieAccepted');

    if (!consent) {
      setOpen(true);
    }
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <Box
        sx={{
          backgroundColor: theme.palette.common.black,
          borderRadius: 1,
          boxShadow: theme.shadows[24],
          color: theme.palette.common.white,
          maxWidth: 600,
          position: 'fixed',
          bottom: 0,
          right: 0,
          margin: theme.spacing(3),
          padding: theme.spacing(3),
          outline: 'none',
          zIndex: 2000,
          '& a': {
            color: theme.palette.common.white
          }
        }}
      >
        <Typography variant='body1' color='inherit'>
          {intl.formatMessage(
            { id: 'legal.cookie_consent' },
            {
              a: (str) => (
                <a key={str[0]} href={privacyUrl} target='_blank' rel='noreferrer'>
                  {str}
                </a>
              )
            }
          )}
        </Typography>
        <Box mt={2} display='flex' justifyContent='flex-end'>
          <Button
            sx={{ backgroundColor: theme.palette.common.white, color: theme.palette.common.black }}
            onClick={handleClose}
            variant='contained'
          >
            {intl.translate({ id: 'legal.cookie_consent_agree' })}
          </Button>
        </Box>
      </Box>
    </Portal>
  );
};

export default CookiesNotification;
