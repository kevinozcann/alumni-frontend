import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { authUserSelector } from '../../store/auth';
import { RootState } from '../../store/store';
import { TLoginType } from '../auth/data/account-types';

import Dashboard from './ui/Dashboard';

const School = () => {
  return (
    <React.Fragment>
      <Dashboard />
    </React.Fragment>
  );
};

export default School;
