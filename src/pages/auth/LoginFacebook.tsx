import React from 'react';
import { useNavigate } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { Box, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import useAuth from 'hooks/useAuth';
import {
  authActions,
  authPhaseSelector,
  authUserSelector,
  authAccessTokenSelector,
  loginPhases
} from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import { TLang } from 'utils/shared-types';

/** Sample Return from Facebook
{
  "name": "Şimşek Mert",
  "email": "simsek97@gmail.com",
  "picture": {
      "data": {
          "height": 50,
          "is_silhouette": false,
          "url": "https://platform-lookaside.fbsbx.com/xxx",
          "width": 50
      }
  },
  "id": "xxx",
  "accessToken": "xxx",
  "userID": "xxx",
  "expiresIn": 7009,
  "signedRequest": "xxx",
  "graphDomain": "facebook",
  "data_access_expiration_time": 1627876991
}
*/

interface IFacebookPicture {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}
interface IFacebookPictureData {
  data: IFacebookPicture;
}
export interface IFacebookLoginResponse {
  name: string;
  email: string;
  picture: IFacebookPictureData;
  id: string;
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
}

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  accessToken: authAccessTokenSelector(state),
  lang: i18nLangSelector(state),
  phase: authPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  facebookLogin(lang: TLang, data: IFacebookLoginResponse) {
    dispatch(authActions.facebookLogin(lang, data));
  },
  setPhase(phase: loginPhases, error: string) {
    dispatch(authActions.setPhase(phase, error));
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TLoginFacebookProps = PropsFromRedux;

export const LoginFacebook: React.FC<TLoginFacebookProps> = ({
  user,
  accessToken,
  lang,
  phase,
  facebookLogin,
  setPhase
}) => {
  const { login } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();

  const responseFacebook = (response: IFacebookLoginResponse) => {
    facebookLogin(lang, response);
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
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        fields='name,email,picture'
        callback={responseFacebook}
        render={(renderProps: any) => (
          <Button
            startIcon={<FacebookIcon />}
            onClick={renderProps.onClick}
            color='primary'
            variant='outlined'
            size='large'
            fullWidth
          >
            {intl.formatMessage({ id: 'login.login_with_facebook' })}
          </Button>
        )}
      />
    </Box>
  );
};

export default connector(LoginFacebook);
