import { Amplify, Auth } from 'aws-amplify';
import axios from 'axios';
import objectPath from 'object-path';
import { GoogleLoginResponse } from 'react-google-login';
import { persistReducer, PURGE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { IUser } from 'pages/account/account-types';
import { IFrequentMenu } from 'pages/admin/menu-types';
import { ISchool } from 'pages/organization/organization-types';
import { TLang, TLinkedAccount } from 'utils/shared-types';

import { USERS_API_URL } from 'store/ApiUrls';
import { IAction } from 'store/store';
import { getUserSchools } from 'store/user';

import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

export type TUserPassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export type TExtendedUser = IUser & TUserPassword;
interface IAuthState {
  user?: IUser;
  phase?: string;
  error?: string;
}
interface IParentAuthState {
  auth: IAuthState;
}
type TActionAllState = IAuthState & {
  password?: string;
  email?: string;
  name?: string;
  lastname?: string;
  phoneNumber?: string;
  lang?: TLang;
  menuId?: number;
  menuGlobalId?: number;
  menuUrl?: string;
  frequentMenus?: IFrequentMenu[];
  pwd?: string;
  resetId?: string;
  school?: ISchool;
  schoolId?: number;
  updateAll?: boolean;
  userId?: string;
  accountType?: TLinkedAccount;
  googleResponse?: GoogleLoginResponse;
  accountResponse?: any;
  impersonateUser?: IUser;
  currentUser?: IUser;
  tempToken?: string;
  transferSchools?: ISchool[];
  code?: string;
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

export const actionTypes = {
  AUTH_LOGIN: 'auth/LOGIN',
  AUTH_FACEBOOK_LOGIN: 'auth/FACEBOOK_LOGIN',
  AUTH_ACCOUNT_LINK: 'auth/ACCOUNT_LINK',
  AUTH_GOOGLE_LOGIN: 'auth/GOOGLE_LOGIN',
  AUTH_ACCOUNT_UNLINK: 'auth/ACCOUNT_UNLINK',
  AUTH_IMPERSONATE: 'auth/AUTH_IMPERSONATE',
  AUTH_IMPERSONATE_SAVE: 'auth/AUTH_IMPERSONATE_SAVE',
  AUTH_IMPERSONATE_CANCEL: 'auth/AUTH_IMPERSONATE_CANCEL',
  AUTH_ACCOUNTS_LOGIN_UPDATE: 'auth/AUTH_ACCOUNTS_LOGIN_UPDATE',
  AUTH_ACCOUNTS_IMPERSONATE_UPDATE: 'auth/AUTH_ACCOUNTS_IMPERSONATE_UPDATE',
  AUTH_LOGIN_ERROR: 'auth/LOGIN_ERROR',
  AUTH_LOGOUT: 'auth/LOGOUT',
  AUTH_REGISTER: 'auth/REGISTER',
  AUTH_VERIFY: 'auth/VERIFY',
  AUTH_TOKEN: 'auth/AUTH_TOKEN',
  AUTH_TOKEN_SAVE: 'auth/AUTH_TOKEN_SAVE',
  AUTH_TOKEN_SAVE_WITH_USER: 'auth/AUTH_TOKEN_SAVE_WITH_USER',
  AUTH_USER_REQUESTED: 'auth/AUTH_USER_REQUESTED',
  AUTH_UPDATE_USER: 'auth/AUTH_UPDATE_USER',
  AUTH_USER_UPDATE_DATA: 'auth/AUTH_USER_UPDATE_DATA',
  UPDATE_USER_INFO: 'auth/UPDATE_USER_INFO',
  SEND_USER_PASSWORD_LINK: 'auth/SEND_USER_PASSWORD_LINK',
  UPDATE_USER_PASSWORD: 'auth/UPDATE_USER_PASSWORD',
  UPDATE_FREQUENT_MENUS: 'auth/UPDATE_FREQUENT_MENUS',
  REMOVE_FREQUENT_MENU: 'auth/REMOVE_FREQUENT_MENU',
  SET_LOGIN_PHASE: 'auth/AUTH_PHASE'
};

const initialAuthState: IAuthState = {
  user: null,
  phase: null,
  error: null
};

export const authSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth']),
  (auth: IAuthState) => auth
);
export const authUserSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'user']),
  (authUser: IUser) => authUser
);
export const authImpersonateSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'impersonate']),
  (impersonateUser: IUser) => impersonateUser
);
export const authAccountsImpersonatesSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'accounts', 'impersonates']),
  (impersonates: IUser[]) => impersonates
);
export const authAccessTokenSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'accessToken']),
  (accessToken: string) => accessToken
);
export const authUserIdSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'user', 'uuid']),
  (uuid: string) => uuid
);
export const authFrequentMenusSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'user', 'frequentMenus']),
  (frequentMenus: IFrequentMenu[]) => frequentMenus
);
export const authPhaseSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'phase']),
  (authPhase: string) => authPhase
);
export const authErrorSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'error']),
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
  (state: IAuthState = initialAuthState, action: IAction<TActionAllState>): IAuthState => {
    switch (action.type) {
      case actionTypes.AUTH_LOGIN: {
        return { user: null };
      }
      case actionTypes.AUTH_LOGOUT: {
        return { ...state, user: null, phase: null, error: null };
      }
      case actionTypes.AUTH_UPDATE_USER: {
        const currentState = { ...state };
        const currentUser = currentState.user;
        const updatedUser = Object.assign({}, currentUser, action.payload);

        return {
          ...state,
          user: updatedUser
        };
      }
      case actionTypes.SET_LOGIN_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const authActions = {
  login: (email: string, password: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_LOGIN,
    payload: { email, password }
  }),
  register: (
    email: string,
    password: string,
    name: string,
    lastname: string,
    phoneNumber: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_REGISTER,
    payload: { email, password, name, lastname, phoneNumber }
  }),
  verify: (email: string, code: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_VERIFY,
    payload: { email, code }
  }),
  logout: (): IAction<Partial<TActionAllState>> => ({ type: actionTypes.AUTH_LOGOUT }),
  hardLogout: (): IAction<Partial<TActionAllState>> => ({ type: PURGE }),
  requestUser: (
    lang: TLang,
    userId: string,
    updateAll: boolean,
    tempToken: string | null
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_USER_REQUESTED,
    payload: { lang, userId, updateAll, tempToken }
  }),
  updateUserInfo: (userId: string, user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_INFO,
    payload: { userId, user }
  }),
  updateUserData: (lang: TLang, user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_USER_UPDATE_DATA,
    payload: { lang, user }
  }),
  setPhase: (phase: string, error: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_LOGIN_PHASE,
    payload: { phase, error }
  })
};

function* getUserData(lang: TLang, user: IUser) {
  yield call(getUserSchools, lang, user);
}

export function* saga() {
  yield takeLatest(
    actionTypes.AUTH_LOGIN,
    function* loginSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('validating', null));

      const { email, password } = payload;

      try {
        const user = yield Auth.signIn(email, password);

        // Update user info
        yield put({
          type: actionTypes.AUTH_UPDATE_USER,
          payload: {
            accessToken: user.signInUserSession.accessToken.jwtToken,
            refreshToken: user.signInUserSession.refreshToken.token,
            signInUserSession: user.signInUserSession,
            attributes: user.attributes,
            preferredMFA: user.preferredMFA
          }
        });

        yield put(authActions.setPhase('success', null));
      } catch (error) {
        console.log('error', error);
        yield put(authActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    actionTypes.AUTH_TOKEN,
    function* tokenSaga({ payload }: IAction<Partial<TActionAllState>>) {
      const { lang, userId } = payload;

      yield put({
        type: actionTypes.AUTH_TOKEN_SAVE,
        payload
      });
      yield put(authActions.setPhase('userinfo-pulling', null));
      yield put(authActions.requestUser(lang, userId, true, null));
    }
  );

  yield takeLatest(
    actionTypes.AUTH_REGISTER,
    function* registerSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('adding', null));

      const { email, password, name, lastname, phoneNumber } = payload;

      try {
        const { user, userConfirmed, userSub } = yield Auth.signUp({
          username: email,
          password,
          attributes: { email, name, family_name: lastname, phone_number: phoneNumber }
        });

        // Update user info
        yield put({
          type: actionTypes.AUTH_UPDATE_USER,
          payload: {
            userSub: userSub,
            userConfirmed: userConfirmed,
            username: user.username,
            session: user.session,
            client: user.client,
            signInUserSession: user.signInUserSession,
            authenticationFlowType: user.authenticationFlowType,
            keyPrefix: user.keyPrefix,
            userDataKey: user.userDataKey
          }
        });

        yield put(authActions.setPhase('success', null));
      } catch (error) {
        console.log('error', error);
        yield put(authActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    actionTypes.AUTH_VERIFY,
    function* registerSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('verifying', null));

      const { email, code } = payload;

      try {
        const response = yield Auth.confirmSignUp(email, code);

        if (response === 'SUCCESS') {
          // Update user info
          yield put({
            type: actionTypes.AUTH_UPDATE_USER,
            payload: {
              userConfirmed: true
            }
          });

          yield put(authActions.setPhase('success', null));
        } else {
          yield put(authActions.setPhase('error', 'An error occurred!'));
        }
      } catch (error) {
        console.log('error', error);
        yield put(authActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    actionTypes.AUTH_USER_REQUESTED,
    function* userRequestedSaga({ payload }: IAction<Partial<TActionAllState>>) {
      const { lang, userId, updateAll } = payload;

      // Get user profile
      const { data: user } = yield axios.get(`${USERS_API_URL}/${userId}`);

      if (typeof user === 'undefined') {
        yield put(authActions.setPhase('error', 'An error occurred!'));
        return;
      }

      // Save user info once we get user related data
      yield put({
        type: actionTypes.AUTH_UPDATE_USER,
        payload: { user }
      });

      if (updateAll) {
        // Get user related data such as schools, menus, etc
        yield call(getUserData, lang, user);

        // Set login successful
        yield put(authActions.setPhase('login-successful', null));
      }
    }
  );

  yield takeLatest(
    actionTypes.AUTH_USER_UPDATE_DATA,
    function* updateUserDataSaga({ payload }: IAction<Partial<TActionAllState>>) {
      const { lang, user } = payload;

      yield call(getUserData, lang, user);
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_INFO,
    function* updateUserSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('updating-userinfo', null));

      const { userId, user } = payload;
      const { data: userInfo } = yield axios.patch(`${USERS_API_URL}/${userId}`, user);

      if (typeof userInfo === 'undefined') {
        yield put(authActions.setPhase('updating-userinfo-error', 'An error occurred!'));

        return;
      }

      yield put(authActions.setPhase('userinfo-pull-successful', null));
      yield put({
        type: actionTypes.AUTH_UPDATE_USER,
        payload: { user: userInfo }
      });
    }
  );

  // yield takeLatest(
  //   actionTypes.UPDATE_USER_PASSWORD,
  //   function* updateUserPasswordSaga({ payload }: IAction<Partial<TActionAllState>>) {
  //     yield put(authActions.setPhase('updating-userinfo', null));

  //     const {
  //       lang,
  //       userId,
  //       email,
  //       userPassword: { currentPassword, newPassword, confirmPassword },
  //       resetId
  //     } = payload;

  //     if (newPassword !== confirmPassword) {
  //       yield put(authActions.setPhase('login-error', 'login.reset_password.password_no_match'));
  //       return;
  //     }

  //     if (resetId) {
  //       // Check if the reset id is valid
  //       const resetCheckUrl = updateApiUrl(RESET_PASSWORD_URL + '/' + resetId, { lang });
  //       const response = yield axios.post(resetCheckUrl, { userId, email, newPassword });

  //       if (response.status !== 200) {
  //         yield put(authActions.setPhase('reset-error', response.data.error || response.title));
  //         return;
  //       }

  //       if (response.data.error) {
  //         yield put(authActions.setPhase('reset-error', response.data.error));
  //         return;
  //       }

  //       const changeResponse = yield axios.patch(
  //         `${USERS_API_URL}/${response.data.userId || userId}`,
  //         {
  //           password: newPassword
  //         },
  //         {
  //           headers: {
  //             Authorization: 'Bearer ' + response.data.token
  //           }
  //         }
  //       );

  //       if (changeResponse.status !== 200) {
  //         yield put(
  //           authActions.setPhase('login-error', changeResponse.data.error || changeResponse.title)
  //         );
  //         return;
  //       }
  //     } else {
  //       // Check existing password by login url if not reset
  //       const userLoginUrl = updateApiUrl(USER_LOGIN_URL, { lang });
  //       const response = yield axios.post(userLoginUrl, { email, pwd: currentPassword });

  //       if (response.status !== 200) {
  //         yield put(authActions.setPhase('login-error', response.data.error || response.title));
  //         return;
  //       }

  //       const changeResponse = yield axios.patch(`${USERS_API_URL}/${userId}`, {
  //         password: newPassword
  //       });

  //       if (changeResponse.status !== 200) {
  //         yield put(
  //           authActions.setPhase('login-error', changeResponse.data.error || changeResponse.title)
  //         );
  //         return;
  //       }
  //     }

  //     yield put(authActions.setPhase('userinfo-pull-successful', null));
  //     yield put(authActions.logout());
  //   }
  // );
}
