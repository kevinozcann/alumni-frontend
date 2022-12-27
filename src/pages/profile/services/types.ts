import { IAuthUser } from 'pages/auth/data/account-types';
import { IAction, TPhase } from 'store/store';
import { TLang } from 'utils/shared-types';

import { IUser } from '../data/user-types';

export const userActionTypes = {
  SAGA: {
    GET_PROFILE: 'user/saga/GET_PROFILE',
    UPDATE_IMAGES: 'user/saga/UPDATE_IMAGES',
    UPDATE_PHASE: 'user/saga/UPDATE_PHASE',
    UPDATE_PROFILE: 'user/saga/UPDATE_PROFILE'
  },
  STORE: {
    UPDATE_IMAGES: 'user/store/UPDATE_IMAGES',
    UPDATE_PHASE: 'user/store/UPDATE_PHASE',
    UPDATE_PROFILE: 'user/store/UPDATE_PROFILE'
  }
};

export interface IUserStoreState {
  user: IUserStore;
}
export interface IUserStore {
  profile: IUser;
  phase: TPhase;
  error: string;
}
export type TUserStoreActions = IUserStore & {
  email?: string;
  lang?: TLang;
  name?: string;
  lastname?: string;
  password?: string;
  userType?: string;
  authUser?: IAuthUser;
  values?: IUser;
};
export type TUserActionType = IAction<Partial<TUserStoreActions>>;
