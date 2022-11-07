import React from 'react';
import { useIntl } from 'react-intl';
import { Link, Typography } from '@mui/material';

export const ForgotPassword: React.FC = () => {
  const intl = useIntl();

  return (
    <Link color='textSecondary' href='/forgot-password'>
      <Typography sx={{ mt: 1 }} variant='body1'>
        {intl.formatMessage({ id: 'login.forgot_password' })}
      </Typography>
    </Link>
  );
};

export default ForgotPassword;
