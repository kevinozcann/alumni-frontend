import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authActionTypes, IAuthStore, TAuthActionType } from '../types';

export const initialAuthState: IAuthStore = {
  username: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  userConfirmed: false,
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
      case authActionTypes.STORE.AUTH_LOGIN: {
        return { user: null };
      }
      // LOGOUT
      case authActionTypes.STORE.AUTH_LOGOUT: {
        return { ...state, user: null, phase: null, error: null };
      }
      // UPDATE USER
      case authActionTypes.STORE.UPDATE_AUTH: {
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

        // if (payload.hasOwnProperty('attributes')) {
        //   const updatedAttributes = Object.assign(
        //     {},
        //     user?.attributes || {},
        //     payload['attributes']
        //   );
        //   payload['attributes'] = updatedAttributes;
        // }

        // const updatedAuth = Object.assign({}, auth, payload);

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
