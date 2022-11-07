import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { authUserSelector } from '../../store/auth';
import { RootState } from '../../store/store';
import { TLoginType } from '../account/account-types';

import Dashboard from './Dashboard';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state)
});

const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;

type DashboardProps = PropsFromRedux;

const School: React.FC<DashboardProps> = (props) => {
  const { user } = props;

  const { userType, userZone } = user;
  const { loginType } = userType;

  return (
    <React.Fragment>
      <Dashboard userType={userType} loginType={loginType as TLoginType} userZone={userZone} />
    </React.Fragment>
  );
};

export default connector(School);
