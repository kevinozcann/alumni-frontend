import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { authUserSelector } from '../../store/auth';
import { RootState } from '../../store/store';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAuthGuardProps = PropsFromRedux & {
  children: React.ReactNode;
};

const AdminGuard: React.FC<TAuthGuardProps> = (props) => {
  const { user, children } = props;
  const auth = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = React.useState(null);

  if (!auth.isAuthenticated) {
    if (location?.pathname !== requestedLocation) {
      setRequestedLocation(location?.pathname);
    }

    return <Navigate to='/auth/login' />;
  } else if (user.userType.loginType !== 'admin') {
    return <Navigate to='/account/home' />;
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

export default connector(AdminGuard);
