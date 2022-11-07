import React from 'react';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';

import useSnackbar from 'hooks/useSnackbar';
import { useTranslation } from 'hooks/useTranslation';
import { IFacebookLoginResponse } from 'pages/auth/LoginFacebook';
import { authActions, authPhaseSelector, authUserSelector } from 'store/auth';
import { TLinkedAccount } from 'utils/shared-types';

const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));

const LinkedAccounts = () => {
  const [showConfirmDialog, setConfirmDialog] = React.useState<boolean>(false);
  const [activeAccount, setActiveAccount] = React.useState<TLinkedAccount>();
  const dispatch = useDispatch();
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  // Selectors
  const user = useSelector(authUserSelector);
  const phase = useSelector(authPhaseSelector);

  const facebook = user.facebookUser || false;
  const google = user.googleUser || false;

  const responseFacebook = (response: IFacebookLoginResponse) => {
    setActiveAccount('facebook');
    dispatch(authActions.accountLink(user, 'facebook', response));
  };

  const responseGoogle = (response: GoogleLoginResponse) => {
    setActiveAccount('google');
    dispatch(authActions.accountLink(user, 'google', response));
  };

  const handleCloseConfirm = () => {
    setConfirmDialog(false);
  };

  const handleFacebookUnlink = () => {
    setActiveAccount('facebook');
    setConfirmDialog(true);
  };

  const handleGoogleUnlink = () => {
    setActiveAccount('google');
    setConfirmDialog(true);
  };

  const handleUnlinkConfirm = () => {
    if (activeAccount === 'facebook') {
      dispatch(authActions.accountUnlink(user, 'facebook'));
    } else if (activeAccount === 'google') {
      dispatch(authActions.accountUnlink(user, 'google'));
    }
  };

  React.useEffect(() => {
    if (phase === 'account-unlinking-successful') {
      setConfirmDialog(false);

      showSnackbar({
        message: intl.formatMessage({ id: 'account.social_account_unlink_successful' }),
        open: true
      });
    }
    // eslint-disable-next-line
  }, [phase]);

  React.useEffect(() => {
    if (phase === 'account-linking-successful') {
      showSnackbar({
        message: intl.formatMessage({ id: 'account.social_account_link_successful' }),
        open: true
      });
    }
    // eslint-disable-next-line
  }, [phase]);

  return (
    <Box>
      <Card>
        <CardHeader title={intl.formatMessage({ id: 'account.linked_accounts' })} />
        <Divider />
        <CardContent>
          <Card sx={{ backgroundColor: facebook ? 'background.paper' : 'background.default' }}>
            <CardHeader
              avatar={<FacebookIcon />}
              title='Facebook'
              action={
                facebook ? (
                  <Button aria-label='facebook-link' onClick={handleFacebookUnlink}>
                    {intl.translate({ id: 'account.social_account_unlink' })}
                  </Button>
                ) : (
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    fields='name,email,picture'
                    callback={responseFacebook}
                    render={(renderProps: any) => (
                      <Button
                        startIcon={
                          activeAccount === 'facebook' &&
                          phase.endsWith('ing') && <CircularProgress size={18} />
                        }
                        onClick={renderProps.onClick}
                      >
                        {intl.formatMessage({ id: 'account.social_account_link' })}
                      </Button>
                    )}
                  />
                )
              }
            />
          </Card>

          <Card sx={{ backgroundColor: google ? 'background.paper' : 'background.default', mt: 2 }}>
            <CardHeader
              avatar={<GoogleIcon />}
              title='Google'
              action={
                google ? (
                  <Button aria-label='google-link' onClick={handleGoogleUnlink}>
                    {intl.formatMessage({ id: 'account.social_account_unlink' })}
                  </Button>
                ) : (
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    onSuccess={responseGoogle}
                    // onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    render={(renderProps: any) => (
                      <Button
                        startIcon={
                          activeAccount === 'google' &&
                          phase.endsWith('ing') && <CircularProgress size={18} />
                        }
                        onClick={renderProps.onClick}
                      >
                        {intl.formatMessage({ id: 'account.social_account_link' })}
                      </Button>
                    )}
                  />
                )
              }
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleUnlinkConfirm}
        isOpen={showConfirmDialog}
        title={intl.formatMessage({ id: 'account.social_account_unlink' })}
        intro={intl.formatMessage(
          { id: 'app.confirm_remove_name' },
          { name: (activeAccount === 'facebook' && 'Facebook') || 'Google' }
        )}
        confirmBtnText={intl.formatMessage({ id: 'account.social_account_unlink' })}
        phase={phase}
      />
    </Box>
  );
};

export default LinkedAccounts;
