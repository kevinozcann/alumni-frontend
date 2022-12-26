import { IAction, TPhase } from 'store/store';
import { TLang, TLinkedAccount } from 'utils/shared-types';
import { IAuthUser } from '../data/account-types';

export const authActionTypes = {
  SAGA: {
    LOGIN: 'auth/saga/LOGIN',
    LOGOUT: 'auth/saga/LOGOUT',
    REGISTER: 'auth/saga/REGISTER',
    UPDATE_USER_PASSWORD: 'auth/UPDATE_USER_PASSWORD',
    UPDATE_USER: 'auth/saga/UPDATE_USER',
    UPDATE_PHASE: 'auth/saga/UPDATE_PHASE',
    VERIFY: 'auth/saga/VERIFY'
  },
  STORE: {
    LOGIN: 'auth/store/LOGIN',
    LOGOUT: 'auth/store/LOGOUT',
    REGISTER: 'auth/store/REGISTER',
    UPDATE_PHASE: 'auth/store/UPDATE_PHASE',
    VERIFY: 'auth/store/VERIFY'
  }
};
export const actionPhases = {
  AUTH_VALIDATING: 'user-validating',
  AUTH_LOGGING: 'user-logging',
  AUTH_LOGGING_SUCCESSFUL: 'user-logging-successful',
  AUTH_LOGGING_ERROR: 'user-logging-error',
  USER_UPDATING: 'user-updating',
  USER_UPDATING_SUCCESSFUL: 'user-updating-successful',
  USER_UPDATING_ERROR: 'user-updating-error',
  ACTIVE_SCHOOL_UPDATING: 'active-school-updating',
  ACTIVE_SEASON_UPDATING: 'active-season-updating',
  PASSWORD_LINK_SENDING: 'password-link-sending',
  PASSWORD_LINK_SENDING_SUCCESSFUL: 'password-link-sending-successful',
  PASSWORD_LINK_SENDING_ERROR: 'password-link-sending-error'
};
export type loginPhases =
  | 'credentials-validating'
  | 'userinfo-pulling'
  | 'login-successful'
  | 'login-error'
  | 'impersonating'
  | 'impersonate-error'
  | 'impersonate-successful'
  | 'updating-userinfo'
  | 'userinfo-pull-successful'
  | 'updating-userinfo-error'
  | 'active-school-updating'
  | 'active-season-updating';

export type TUserPassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TExtendedUser = IAuthUser & TUserPassword;

export interface IAuthStoreState {
  auth: IAuthStore;
}

export interface IAuthStore {
  username?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: IAuthUser;
  signInUserSession?: any;
  pool?: {
    userPoolId?: string;
    clientId?: string;
    advancedSecurityDataCollectionFlag?: string;
  };
  client?: {
    endpoint?: string;
    fetchOptions?: any;
  };
  userConfirmed?: boolean;
  preferredMFA?: string;
  phase?: TPhase;
  error?: string;
}

export type TAuthStoreActions = IAuthStore & {
  password?: string;
  email?: string;
  name?: string;
  lastname?: string;
  phoneNumber?: string;
  lang?: TLang;
  menuUrl?: string;
  pwd?: string;
  userPassword?: TUserPassword;
  accountType?: TLinkedAccount;
  tempToken?: string;
  code?: string;
};
export type TAuthActionType = IAction<Partial<TAuthStoreActions>>;
