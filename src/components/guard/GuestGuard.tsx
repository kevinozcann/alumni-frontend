import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { authUserSelector } from 'pages/auth/services/store/auth';

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  // Selectors
  const user = useSelector(authUserSelector);

  if (user && user.accessToken) {
    return <Navigate to='/account/home' />;
  }

  return <>{children}</>;
};

export default GuestGuard;
