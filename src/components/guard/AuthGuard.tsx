import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { authUserSelector } from 'pages/auth/services/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props;
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = React.useState(null);

  // Selectors
  const user = useSelector(authUserSelector);

  if (!user || !user.accessToken) {
    if (location?.pathname !== requestedLocation) {
      setRequestedLocation(location?.pathname);
    }

    return <Navigate to='/auth/login' />;
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location?.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
