import React from 'react';
import { useIntl } from 'react-intl';
import { Link, Typography } from '@mui/material';

export const Login = () => {
  const intl = useIntl();

  return (
    <Link color='textSecondary' href='/auth/login'>
      <Typography sx={{ mt: 1 }} variant='body1'>
        {intl.formatMessage({ id: 'login.login' })}
      </Typography>
    </Link>
  );
};

export default Login;
