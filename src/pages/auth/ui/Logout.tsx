import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { LoadingScreen } from 'layout/LoadingScreen';

import { authActions } from '../services/actions';
import { authSelector } from '../services/store/auth';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const auth = useSelector(authSelector);

  React.useEffect(() => {
    dispatch(authActions.logout());
  }, []);

  React.useEffect(() => {
    if (!auth || !auth?.accessToken) {
      navigate('/auth/login');
    }
  }, [auth]);

  return <LoadingScreen />;
};

export default Logout;
