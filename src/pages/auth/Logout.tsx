import React from 'react';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { authActions, authSelector, authUserSelector } from 'store/auth';
import { AppDispatch, RootState } from 'store/store';
import { LoadingScreen } from 'layout/LoadingScreen';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useSelector(authUserSelector);

  React.useEffect(() => {
    dispatch(authActions.logout());
  }, []);

  React.useEffect(() => {
    if (!user || !user?.accessToken) {
      navigate('/auth/login');
    }
  }, [user]);

  return <LoadingScreen />;
};

export default Logout;
