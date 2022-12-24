import { Amplify } from 'aws-amplify';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { IAuthUser } from 'pages/auth/data/account-types';
import { authActionTypes, IAuthStore, IAuthStoreState, TAuthActionType } from '../types';
import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

export {
  authSelector,
  authUserSelector,
  authAccessTokenSelector,
  authPhaseSelector,
  authErrorSelector
} from './selectors';

export { reducer } from './reducer';
