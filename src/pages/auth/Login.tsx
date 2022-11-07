import React from 'react';
import { useIntl } from 'react-intl';
import loadable from '@loadable/component';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

import ForgotPassword from 'components/links/ForgotPassword';

const LoginJWT = loadable(() => import('./LoginJWT'));
const LoginFacebook = loadable(() => import('./LoginFacebook'));
const LoginGoogle = loadable(() => import('./LoginGoogle'));

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
            <LoginJWT />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ flexGrow: 1 }}>
            <LoginFacebook />
          </Box>

          <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            <LoginGoogle />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <ForgotPassword />
          </Box>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Login;
