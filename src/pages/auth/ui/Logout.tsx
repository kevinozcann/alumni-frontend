import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { LoadingScreen } from 'layout/LoadingScreen';

import { authActions } from '../services/actions';
import { authUserSelector } from '../services/auth';

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
