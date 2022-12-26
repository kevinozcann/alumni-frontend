import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authActionTypes, IAuthStore, TAuthActionType } from '../types';

export const initialAuthState: IAuthStore = {
  username: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  userConfirmed: null,
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
        return { user: null };
      }
      // LOGOUT
      case authActionTypes.STORE.LOGOUT: {
        const initialState = Object.assign({}, { ...state }, { ...initialAuthState });

        return initialState;
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
