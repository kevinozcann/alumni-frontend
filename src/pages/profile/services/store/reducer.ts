import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { IUserStore, TUserActionType, userActionTypes } from '../types';

const initialAuthState: IUserStore = {
  profile: null,
  phase: null,
  error: null
};

export const reducer = persistReducer(
  {
    storage,
    key: 'user',
    whitelist: ['profile', 'phase', 'error']
  },
  (state: IUserStore = initialAuthState, action: TUserActionType): IUserStore => {
    switch (action.type) {
      case userActionTypes.STORE.UPDATE_PROFILE: {
        const { profile } = action.payload;
        return { ...state, profile };
      }
      case userActionTypes.STORE.UPDATE_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);
