import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { Box, Button } from '@mui/material';
import {
  authActions,
  authPhaseSelector,
  authUserSelector,
  authAccessTokenSelector,
  loginPhases
} from '../../store/auth';
import { i18nLangSelector } from '../../store/i18n';
import { AppDispatch, RootState } from '../../store/store';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { TLang } from '../../utils/shared-types';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import GoogleIcon from '@mui/icons-material/Google';

/* Sample return from Google
...
profileObj: {
  email: "xxx"
  familyName: "xxx"
  givenName: "xxx"
  googleId: "xxx"
  imageUrl: "xxx"
  name: "xxx"
}
...
*/

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  accessToken: authAccessTokenSelector(state),
  lang: i18nLangSelector(state),
  phase: authPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  googleLogin(lang: TLang, data: GoogleLoginResponse) {
    dispatch(authActions.googleLogin(lang, data));
  },
  setPhase(phase: loginPhases, error: string) {
    dispatch(authActions.setPhase(phase, error));
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TLoginGoogleProps = PropsFromRedux;

export const LoginGoogle: React.FC<TLoginGoogleProps> = ({
  user,
  accessToken,
  lang,
  phase,
  googleLogin,
  setPhase
}) => {
  const { login } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();

  const responseGoogle = (response: GoogleLoginResponse) => {
    googleLogin(lang, response);
  };

  React.useEffect(() => {
    setPhase(null, null);
  }, [setPhase]);

  React.useEffect(() => {
    if (accessToken && user && phase === 'login-successful') {
      // Login the user to the context
      login(accessToken, user);

      setTimeout(() => {
        navigate('/account/home');
      }, 500);
    }
  }, [accessToken, user, phase]);

  return (
    <Box>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onSuccess={responseGoogle}
        // onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        render={(renderProps: any) => (
          <Button
            startIcon={<GoogleIcon />}
            onClick={renderProps.onClick}
            color='secondary'
            variant='outlined'
            size='large'
            fullWidth
          >
            {intl.formatMessage({ id: 'login.login_with_google' })}
          </Button>
        )}
      />
    </Box>
  );
};

export default connector(LoginGoogle);
