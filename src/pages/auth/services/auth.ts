import { Amplify } from 'aws-amplify';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { IAuthUser } from 'pages/auth/data/account-types';
import { authActionTypes, IAuthStore, IAuthStoreState, TAuthActionType } from './types';
import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

const initialAuthState: IAuthStore = {
  user: null,
  phase: null,
  error: null
};

export const authSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth']),
  (auth: IAuthStore) => auth
);
export const authUserSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'user']),
  (authUser: IAuthUser) => authUser
);
export const authAccessTokenSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'accessToken']),
  (accessToken: string) => accessToken
);
export const authPhaseSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'phase']),
  (authPhase: string) => authPhase
);
export const authErrorSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'error']),
  (authError: any) => authError
);

export const reducer = persistReducer(
  {
    storage,
    key: 'auth',
    whitelist: [
      'user',
      'accounts',
      'logins',
      'impersonate',
      'impersonates',
      'authToken',
      'tempToken',
      'accessToken',
      'phase',
      'error'
    ]
  },
  (state: IAuthStore = initialAuthState, action: TAuthActionType): IAuthStore => {
    switch (action.type) {
      case authActionTypes.STORE.AUTH_LOGIN: {
        return { user: null };
      }
      case authActionTypes.STORE.AUTH_LOGOUT: {
        return { ...state, user: null, phase: null, error: null };
      }
      case authActionTypes.STORE.AUTH_UPDATE_USER: {
        const { payload } = action;
        const { user } = { ...state };

        console.log('payload', payload);
        if (payload.hasOwnProperty('attributes')) {
          const updatedAttributes = Object.assign(
            {},
            user?.attributes || {},
            payload['attributes']
          );
          payload['attributes'] = updatedAttributes;
        }

        const updatedUser = Object.assign({}, user, payload);

        return {
          ...state,
          user: updatedUser
        };
      }
      case authActionTypes.STORE.UPDATE_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);
