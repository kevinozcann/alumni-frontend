import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { AppDispatch, RootState } from 'store/store';
import {
  authErrorSelector,
  authPhaseSelector,
  authUserSelector
} from 'pages/auth/services/store/auth';
import { i18nLangSelector } from 'store/i18n';
import { TLang } from 'utils/shared-types';
import ChangePassword from 'pages/profile/ui/edit/ChangePassword';
import { useLocation, useNavigate } from 'react-router';
import { Box, Divider } from '@mui/material';

import Login from 'components/links/Login';
import ForgotPassword from 'components/links/ForgotPassword';

import { TUserPassword } from '../services/types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  authPhase: authPhaseSelector(state),
  authError: authErrorSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  changeUserPassword: (
    lang: TLang,
    userId: string,
    email: string,
    user: TUserPassword,
    resetId: string
    // ) => dispatch(authActions.changeUserPassword(lang, userId, email, user, resetId))
  ) => {
    console.log('change this');
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TResetPasswordProps = PropsFromRedux;

const ResetPassword = (props: TResetPasswordProps) => {
  const { lang, user, authPhase, authError, changeUserPassword } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const resetId = new URLSearchParams(location.search).get('token');

  React.useEffect(() => {
    if (authPhase === 'userinfo-pull-successful') {
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    }
  }, [authPhase]);

  return (
    <React.Fragment>
      <ChangePassword showCurrentPassword={false} resetId={resetId} />

      <Divider sx={{ my: 1 }} />

      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Login />
        <ForgotPassword />
      </Box>
    </React.Fragment>
  );
};

export default connector(ResetPassword);
