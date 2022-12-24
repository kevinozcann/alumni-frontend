import { ISchool } from 'pages/organization/organization-types';
import { GoogleLoginResponse } from 'react-google-login';
import { IAction } from 'store/store';
import { TLang, TLinkedAccount } from 'utils/shared-types';
import { IAuthUser, IUser } from '../data/account-types';

export const authActionTypes = {
  SAGA: {
    LOGIN: 'auth/saga/LOGIN',
    AUTH_LOGIN_ERROR: 'auth/LOGIN_ERROR',
    AUTH_LOGOUT: 'auth/saga/LOGOUT',
    REGISTER: 'auth/saga/REGISTER',
    AUTH_VERIFY: 'auth/saga/VERIFY',
    AUTH_TOKEN: 'auth/AUTH_TOKEN',
    AUTH_TOKEN_SAVE: 'auth/AUTH_TOKEN_SAVE',
    AUTH_TOKEN_SAVE_WITH_USER: 'auth/saga/AUTH_TOKEN_SAVE_WITH_USER',
    AUTH_USER_REQUESTED: 'auth/AUTH_USER_REQUESTED',
    AUTH_UPDATE_USER: 'auth/saga/AUTH_UPDATE_USER',
    AUTH_USER_UPDATE_DATA: 'auth/AUTH_USER_UPDATE_DATA',
    UPDATE_USER_INFO: 'auth/UPDATE_USER_INFO',
    UPDATE_USER_PASSWORD: 'auth/UPDATE_USER_PASSWORD',
    UPDATE_FREQUENT_MENUS: 'auth/UPDATE_FREQUENT_MENUS',
    REMOVE_FREQUENT_MENU: 'auth/REMOVE_FREQUENT_MENU',
    UPDATE_PHASE: 'auth/saga/UPDATE_PHASE'
  },
  STORE: {
    AUTH_LOGIN: 'auth/store/LOGIN',
    AUTH_LOGOUT: 'auth/store/LOGOUT',
    AUTH_UPDATE_USER: 'auth/store/AUTH_UPDATE_USER',
    UPDATE_PHASE: 'auth/store/UPDATE_PHASE'
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
  user?: IAuthUser;
  phase?: string;
  error?: string;
}

export type TAuthStoreActions = IAuthStore & {
  password?: string;
  email?: string;
  name?: string;
  lastname?: string;
  phoneNumber?: string;
  lang?: TLang;
  menuId?: number;
  menuGlobalId?: number;
  menuUrl?: string;
  pwd?: string;
  resetId?: string;
  school?: ISchool;
  schoolId?: number;
  updateAll?: boolean;
  userPassword?: TUserPassword;
  userSub?: string;
  userData?: Partial<IAuthUser>;
  accountType?: TLinkedAccount;
  googleResponse?: GoogleLoginResponse;
  accountResponse?: any;
  impersonateUser?: IUser;
  currentUser?: IUser;
  tempToken?: string;
  transferSchools?: ISchool[];
  code?: string;
};
export type TAuthActionType = IAction<Partial<TAuthStoreActions>>;
