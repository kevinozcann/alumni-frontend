import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authActionTypes, IAuthStore, TAuthActionType } from '../types';

export const initialAuthState: IAuthStore = {
  username: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  client: null,
  signInUserSession: null,
  phase: null,
  error: null
};

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
      // LOGIN
      case authActionTypes.STORE.LOGIN: {
        const {
          username,
          pool,
          client,
          signInUserSession,
          accessToken,
          refreshToken,
          user,
          preferredMFA
        } = action.payload;

        return {
          ...state,
          username,
          pool,
          client,
          signInUserSession,
          accessToken,
          refreshToken,
          user,
          preferredMFA
        };
      }
      // LOGOUT
      case authActionTypes.STORE.LOGOUT: {
        const initialState = Object.assign({}, { ...state }, { ...initialAuthState });

        return initialState;
      }
      // REGISTER
      case authActionTypes.STORE.REGISTER: {
        const { userConfirmed, username, client, signInUserSession } = action.payload;

        return {
          ...state,
          userConfirmed,
          username,
          client,
          signInUserSession
        };
      }
      // VERIFY
      case authActionTypes.STORE.VERIFY: {
        const { userConfirmed } = action.payload;

        return { ...state, userConfirmed };
      }
      // UPDATE PHASE
      case authActionTypes.STORE.UPDATE_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);
