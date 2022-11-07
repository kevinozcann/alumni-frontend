import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';
import { authActions, authSelector } from '../../store/auth';
import { AppDispatch, RootState } from '../../store/store';
import { LoadingScreen } from '../../layout/LoadingScreen';
import useAuth from '../../hooks/useAuth';

const mapStateToProps = (state: RootState) => ({
  auth: authSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  logout() {
    dispatch(authActions.logout());
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Logout: React.FC<PropsFromRedux> = ({ auth, logout }) => {
  const { logout: contextLogout } = useAuth();
  const { accessToken } = auth;
  const navigate = useNavigate();

  React.useEffect(() => {
    // Logout from the context
    contextLogout();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    logout();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (!accessToken) {
      navigate('/auth/login');
    }
    // eslint-disable-next-line
  }, [accessToken]);

  return <LoadingScreen />;
};

export default connector(Logout);
