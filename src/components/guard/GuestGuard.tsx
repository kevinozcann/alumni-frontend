import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { authSelector } from 'pages/auth/services/store/auth';

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  // Selectors
  const auth = useSelector(authSelector);

  if (auth && auth.accessToken) {
    return <Navigate to='/account/home' />;
  }

  return <>{children}</>;
};

export default GuestGuard;
