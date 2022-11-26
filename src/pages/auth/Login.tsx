import loadable from '@loadable/component';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import ForgotPassword from 'components/links/ForgotPassword';

const LoginAmplify = loadable(() => import('./LoginAmplify'));

export const Login = () => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography color='textPrimary' gutterBottom variant='h4'>
              {intl.formatMessage({ id: 'login.login' })}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <LoginAmplify />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography color='textSecondary' sx={{ mx: 1 }}>
              No account yet? <Link to='/auth/registration'>Sign Up!</Link>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <ForgotPassword />
          </Box>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Login;
