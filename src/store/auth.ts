import { persistReducer, PURGE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, call, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';
import { GoogleLoginResponse } from 'react-google-login';

import { ISchool } from 'pages/organization/organization-types';
import { IUser } from 'pages/account/account-types';
import { IFrequentMenu } from 'pages/admin/menus/menu-types';
import { IFacebookLoginResponse } from 'pages/auth/LoginFacebook';
import { JWT_EXPIRES_IN, JWT_SECRET, sign } from 'utils/jwt';
import { TLang, TLinkedAccount } from 'utils/shared-types';

import {
  updateApiUrl,
  USER_LOGIN_URL,
  USERS_API_URL,
  FREQUENT_MENUS_API_URL,
  FACEBOOK_USERS_URL,
  backendBaseUrl,
  apiBaseUrl,
  GOOGLE_USERS_URL,
  RESET_PASSWORD_URL,
  REGISTER_EMAIL_API_URL,
  VERIFY_EMAIL_URL
} from 'store/ApiUrls';
import { IAction } from 'store/store';
import { actionTypes as userActionTypes, getUserSchools } from 'store/user';

export type TUserPassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export type TExtendedUser = IUser & TUserPassword;
interface IAuthState {
  user?: IUser;
  accounts?: {
    logins?: IUser[];
    impersonates?: IUser[];
  };
  impersonate?: IUser;
  accessToken?: string;
  authToken?: string;
  phase?: string;
  error?: string;
}
interface IParentAuthState {
  auth: IAuthState;
}
type TActionAllState = IAuthState & {
  userPassword?: TUserPassword;
  email?: string;
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
  facebookResponse?: IFacebookLoginResponse;
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
  accounts: {
    logins: null,
    impersonates: null
  },
  impersonate: null,
  authToken: null,
  accessToken: null,
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
  (authError: string) => authError
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
      case actionTypes.AUTH_TOKEN_SAVE: {
        const { authToken, accessToken } = action.payload;
        return { ...state, authToken, accessToken, user: null };
      }
      case actionTypes.AUTH_TOKEN_SAVE_WITH_USER: {
        const { authToken, accessToken } = action.payload;
        return { ...state, authToken, accessToken };
      }
      case actionTypes.AUTH_IMPERSONATE_SAVE: {
        const { user } = action.payload;
        return { ...state, impersonate: user };
      }
      case actionTypes.AUTH_REGISTER: {
        const { authToken } = action.payload;
        return { ...state, authToken, user: null };
      }
      case actionTypes.AUTH_LOGOUT: {
        return { ...state, authToken: null, accessToken: null, phase: null, error: null };
      }
      case actionTypes.AUTH_UPDATE_USER: {
        const { user } = action.payload;
        return { ...state, user };
      }
      case actionTypes.AUTH_ACCOUNTS_IMPERSONATE_UPDATE: {
        const { impersonateUser } = action.payload;
        const currentState = { ...state };
        const currentAccounts = currentState.accounts;
        const currentImpersonates = currentAccounts?.impersonates;

        if (currentImpersonates) {
          const currentIndex = currentImpersonates.findIndex((e) => e.id === impersonateUser.id);
          if (currentIndex > -1) {
            // Remove the existing element in order to put it onto the top
            currentImpersonates.splice(currentIndex, 1);
          }

          return {
            ...state,
            accounts: {
              logins: currentAccounts?.logins,
              impersonates: [impersonateUser, ...currentImpersonates]
            },
            impersonate: null
          };
        } else {
          return {
            ...state,
            accounts: {
              logins: currentAccounts?.logins,
              impersonates: [impersonateUser]
            },
            impersonate: null
          };
        }
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
  login: (lang: TLang, email: string, pwd: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_LOGIN,
    payload: { lang, email, pwd }
  }),
  facebookLogin: (
    lang: TLang,
    facebookResponse: IFacebookLoginResponse
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_FACEBOOK_LOGIN,
    payload: { lang, facebookResponse }
  }),
  googleLogin: (
    lang: TLang,
    googleResponse: GoogleLoginResponse
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_GOOGLE_LOGIN,
    payload: { lang, googleResponse }
  }),
  accountLink: (
    user: IUser,
    accountType: TLinkedAccount,
    accountResponse: any
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_ACCOUNT_LINK,
    payload: { user, accountType, accountResponse }
  }),
  accountUnlink: (user: IUser, accountType: TLinkedAccount): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_ACCOUNT_UNLINK,
    payload: { user, accountType }
  }),
  authToken: (
    lang: TLang,
    userId: string,
    authToken: string,
    accessToken: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_TOKEN,
    payload: { lang, userId, authToken, accessToken }
  }),
  impersonate: (
    lang: TLang,
    currentUser: IUser,
    impersonateUser: IUser
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_IMPERSONATE,
    payload: { lang, currentUser, impersonateUser }
  }),
  cancelImpersonate: (
    lang: TLang,
    currentUser: IUser,
    impersonateUser: IUser
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_IMPERSONATE_CANCEL,
    payload: { lang, currentUser, impersonateUser }
  }),
  register: (lang: TLang, email: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_REGISTER,
    payload: { lang, email }
  }),
  verify: (lang: TLang, email: string, code: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.AUTH_VERIFY,
    payload: { lang, email, code }
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
  updateFrequentMenus: (
    lang: TLang,
    userId: string,
    frequentMenus: IFrequentMenu[],
    menuGlobalId: number,
    menuUrl?: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_FREQUENT_MENUS,
    payload: { lang, userId, frequentMenus, menuGlobalId, menuUrl }
  }),
  removeFrequentMenu: (menuId: number, user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_FREQUENT_MENU,
    payload: { menuId, user }
  }),
  updateUserInfo: (userId: string, user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_INFO,
    payload: { userId, user }
  }),
  sendUserPasswordLink: (email: string, lang: TLang): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SEND_USER_PASSWORD_LINK,
    payload: { email, lang }
  }),
  changeUserPassword: (
    lang: TLang,
    userId: string,
    email: string,
    userPassword: TUserPassword,
    resetId?: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_PASSWORD,
    payload: { lang, userId, email, userPassword, resetId }
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
      yield put(authActions.setPhase('credentials-validating', null));

      const { lang, email, pwd } = payload;
      const userLoginUrl = updateApiUrl(USER_LOGIN_URL, { lang: lang });
      const response = yield axios.post(userLoginUrl, { email, pwd });

      if (response.status !== 200) {
        yield put(authActions.setPhase('login-error', response.data.error || response.data.title));
        return;
      }

      const {
        data: { userId, accessToken }
      } = response;

      const jwtAccessToken = sign({ userId: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      yield put(authActions.authToken(lang, userId, accessToken, jwtAccessToken));
    }
  );

  yield takeLatest(
    actionTypes.AUTH_FACEBOOK_LOGIN,
    function* facebookLoginSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('validating-facebook-user', null));

      const { lang, facebookResponse } = payload;
      const response = yield axios.get(
        `${FACEBOOK_USERS_URL}.json?facebookUserId=${facebookResponse.userID}&facebookEmail=${facebookResponse.email}`
      );

      if (response.status !== 200) {
        yield put(
          authActions.setPhase(
            'validating-facebook-user-error',
            response.data.error || response.data.title
          )
        );
        return;
      }

      const responsUser: IUser = (response?.data?.length && response?.data[0].user) || null;

      if (!responsUser) {
        yield put(
          authActions.setPhase('validating-facebook-user-error', 'Facebook user not registered!')
        );
        return;
      }

      const jwtAccessToken = sign({ userId: responsUser.uuid }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      yield put(
        authActions.authToken(lang, responsUser.uuid, responsUser.accessToken, jwtAccessToken)
      );
    }
  );

  yield takeLatest(
    actionTypes.AUTH_GOOGLE_LOGIN,
    function* googleLoginSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('validating-google-user', null));

      const {
        lang,
        googleResponse: { profileObj }
      } = payload;
      const response = yield axios.get(
        `${GOOGLE_USERS_URL}.json?googleUserId=${profileObj.googleId}&googleEmail=${profileObj.email}`
      );

      if (response.status !== 200) {
        yield put(
          authActions.setPhase(
            'validating-google-user-error',
            response.data.error || response.data.title
          )
        );
        return;
      }

      const responsUser: IUser = (response?.data?.length && response?.data[0].user) || null;

      if (!responsUser) {
        yield put(
          authActions.setPhase('validating-google-user-error', 'Google user not registered!')
        );
        return;
      }

      const jwtAccessToken = sign({ userId: responsUser.uuid }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      yield put(
        authActions.authToken(lang, responsUser.uuid, responsUser.accessToken, jwtAccessToken)
      );
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
    actionTypes.AUTH_IMPERSONATE,
    function* impersonateSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('impersonating', null));

      // Get user profile
      yield put(authActions.setPhase('impersonate-user-getting', null));
      const { lang, currentUser, impersonateUser } = payload;
      const { data: user } = yield axios.get(`${USERS_API_URL}/${impersonateUser.uuid}`, {
        headers: {
          Authorization: `Bearer ${impersonateUser.accessToken}`
        }
      });

      if (typeof user === 'undefined') {
        yield put(authActions.setPhase('impersonate-error', 'An error occurred!'));
        return;
      }

      yield put({
        type: actionTypes.AUTH_UPDATE_USER,
        payload: { user }
      });

      // Get user related data such as schools, menus, etc
      yield put(authActions.setPhase('impersonate-processing', null));
      yield call(getUserData, lang, user);

      const jwtAccessToken = sign({ userId: user.uuid }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      yield put({
        type: actionTypes.AUTH_TOKEN_SAVE_WITH_USER,
        payload: { authToken: user.accessToken, accessToken: jwtAccessToken }
      });

      // Update impersonate with the actual user
      yield put(authActions.setPhase('impersonate-swaping', null));
      yield put({
        type: actionTypes.AUTH_IMPERSONATE_SAVE,
        payload: { user: currentUser }
      });

      // Send feedback as successful
      yield put(authActions.setPhase('impersonate-successful', null));
    }
  );

  yield takeLatest(
    actionTypes.AUTH_IMPERSONATE_CANCEL,
    function* impersonateSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('impersonate-cancelling', null));

      const { lang, currentUser: tempUser, impersonateUser: user } = payload;

      // Get user related data such as schools, menus, etc
      yield call(getUserData, lang, user);

      const jwtAccessToken = sign({ userId: user.uuid }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      yield put({
        type: actionTypes.AUTH_TOKEN_SAVE_WITH_USER,
        payload: { authToken: user.accessToken, accessToken: jwtAccessToken }
      });

      // Update impersonate accounts
      yield put(authActions.setPhase('impersonate-accounts-updating', null));
      yield put({
        type: actionTypes.AUTH_ACCOUNTS_IMPERSONATE_UPDATE,
        payload: { impersonateUser: tempUser }
      });

      // Update the actual user
      yield put({
        type: actionTypes.AUTH_UPDATE_USER,
        payload: { user }
      });

      yield put({
        type: userActionTypes.USER_UPDATE_ACTIVE_STUDENT,
        payload: { activeStudent: null }
      });

      // Send feedback as successful
      yield put(authActions.setPhase('impersonate-cancel-successful', null));
    }
  );

  yield takeLatest(
    actionTypes.AUTH_REGISTER,
    function* registerSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('adding', null));

      const { lang, email } = payload;

      // Register the email address
      const { status, data } = yield axios.post(`${REGISTER_EMAIL_API_URL}`, {
        emailAddress: email,
        locale: lang
      });

      if (status !== 201) {
        yield put(authActions.setPhase('error', 'An error occurred!'));
        return;
      }

      if (data?.error) {
        yield put(authActions.setPhase('error', data.error));
      } else {
        yield put(authActions.setPhase('success', null));
      }
    }
  );

  yield takeLatest(
    actionTypes.AUTH_VERIFY,
    function* registerSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('verifying', null));

      const { lang, email, code } = payload;

      // Verify the email address
      const verifyEmailUrl = updateApiUrl(VERIFY_EMAIL_URL, {
        lang
      });
      const { status, data } = yield axios.post(`${verifyEmailUrl}`, {
        emailAddress: email,
        verifyCode: code
      });

      if (status !== 200) {
        yield put(authActions.setPhase('error', 'An error occurred!'));
        return;
      }

      if (data?.error) {
        yield put(authActions.setPhase('error', data.error));
      } else {
        yield put(authActions.setPhase('verified', null));
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

  yield takeLatest(
    actionTypes.SEND_USER_PASSWORD_LINK,
    function* sendUserPasswordLinkSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase(actionPhases.PASSWORD_LINK_SENDING, null));

      const { email, lang } = payload;
      const resetPasswordUrl = updateApiUrl(RESET_PASSWORD_URL, { lang: lang });
      const response = yield axios.post(resetPasswordUrl, { email: email });

      if (response.status !== 200) {
        yield put(authActions.setPhase(actionPhases.PASSWORD_LINK_SENDING_ERROR, null));
        return;
      }

      const { data } = response;

      // check if there is any error
      if (data.error) {
        yield put(authActions.setPhase(actionPhases.PASSWORD_LINK_SENDING_ERROR, data.error));
        return;
      }

      yield put(authActions.setPhase(actionPhases.PASSWORD_LINK_SENDING_SUCCESSFUL, null));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_PASSWORD,
    function* updateUserPasswordSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('updating-userinfo', null));

      const {
        lang,
        userId,
        email,
        userPassword: { currentPassword, newPassword, confirmPassword },
        resetId
      } = payload;

      if (newPassword !== confirmPassword) {
        yield put(authActions.setPhase('login-error', 'login.reset_password.password_no_match'));
        return;
      }

      if (resetId) {
        // Check if the reset id is valid
        const resetCheckUrl = updateApiUrl(RESET_PASSWORD_URL + '/' + resetId, { lang });
        const response = yield axios.post(resetCheckUrl, { userId, email, newPassword });

        if (response.status !== 200) {
          yield put(authActions.setPhase('reset-error', response.data.error || response.title));
          return;
        }

        if (response.data.error) {
          yield put(authActions.setPhase('reset-error', response.data.error));
          return;
        }

        const changeResponse = yield axios.patch(
          `${USERS_API_URL}/${response.data.userId || userId}`,
          {
            password: newPassword
          },
          {
            headers: {
              Authorization: 'Bearer ' + response.data.token
            }
          }
        );

        if (changeResponse.status !== 200) {
          yield put(
            authActions.setPhase('login-error', changeResponse.data.error || changeResponse.title)
          );
          return;
        }
      } else {
        // Check existing password by login url if not reset
        const userLoginUrl = updateApiUrl(USER_LOGIN_URL, { lang });
        const response = yield axios.post(userLoginUrl, { email, pwd: currentPassword });

        if (response.status !== 200) {
          yield put(authActions.setPhase('login-error', response.data.error || response.title));
          return;
        }

        const changeResponse = yield axios.patch(`${USERS_API_URL}/${userId}`, {
          password: newPassword
        });

        if (changeResponse.status !== 200) {
          yield put(
            authActions.setPhase('login-error', changeResponse.data.error || changeResponse.title)
          );
          return;
        }
      }

      yield put(authActions.setPhase('userinfo-pull-successful', null));
      yield put(authActions.logout());
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_FREQUENT_MENUS,
    function* updateFrequentMenus({ payload }: IAction<Partial<TActionAllState>>) {
      const { userId, frequentMenus, menuGlobalId } = payload;

      // @note f.menuId is globalId here
      const existingFrequentMenu = frequentMenus.find((f) => f.menuId === menuGlobalId);

      if (existingFrequentMenu) {
        yield axios.patch(`${FREQUENT_MENUS_API_URL}/${existingFrequentMenu.id}`, {
          count: existingFrequentMenu.count + 1
        });
      } else {
        yield axios.post(`${FREQUENT_MENUS_API_URL}`, {
          count: 1,
          user: `/api/users/${userId}`,
          menuId: menuGlobalId
        });
      }
    }
  );

  yield takeLatest(
    actionTypes.REMOVE_FREQUENT_MENU,
    function* removeFrequentMenu({ payload }: IAction<Partial<TActionAllState>>) {
      const { menuId, user } = payload;

      const freqMenu = user.frequentMenus.find((f) => f.menu && f.menu.id === menuId);

      if (!freqMenu) {
        return;
      }

      // Update backend
      const response = yield axios.delete(`${FREQUENT_MENUS_API_URL}/${freqMenu.id}`);

      // Update client if success
      if (response.status === 204) {
        user.frequentMenus = user.frequentMenus.filter((f) => f.id !== freqMenu.id);

        yield put({
          type: actionTypes.AUTH_UPDATE_USER,
          payload: { user }
        });
      }
    }
  );

  yield takeLatest(
    actionTypes.AUTH_ACCOUNT_LINK,
    function* accountUnlin({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('account-linking', null));

      const { user, accountType, accountResponse } = payload;

      // Account url
      const linkedAccountUrl =
        (accountType === 'facebook' && 'facebook_users') ||
        (accountType === 'google' && 'google_users') ||
        null;

      if (!linkedAccountUrl) {
        yield put(
          authActions.setPhase('account-linking-error', 'Account type could not be found!')
        );
        return;
      }

      const postData =
        (accountType === 'facebook' && {
          facebookUserId: accountResponse?.userID,
          facebookEmail: accountResponse?.email,
          user: `/api/users/${user.uuid}`
        }) ||
        (accountType === 'google' && {
          googleUserId: accountResponse?.profileObj?.googleId,
          googleEmail: accountResponse?.profileObj?.email,
          user: `/api/users/${user.uuid}`
        }) ||
        null;

      const response = yield axios.post(`${apiBaseUrl}/${linkedAccountUrl}`, postData);

      if (response.status !== 201) {
        yield put(authActions.setPhase('account-linking-error', response.error));
        return;
      }

      yield put(authActions.setPhase('account-linking-successful', null));

      // Update client if success
      const updatedUser =
        (accountType === 'facebook' && {
          ...user,
          facebookUser: `/api/facebook_users/${response.data.id}`
        }) ||
        (accountType === 'google' && {
          ...user,
          googleUser: `/api/google_users/${response.data.id}`
        }) ||
        null;
      yield put({
        type: actionTypes.AUTH_UPDATE_USER,
        payload: { user: updatedUser }
      });
    }
  );

  yield takeLatest(
    actionTypes.AUTH_ACCOUNT_UNLINK,
    function* accountUnlin({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('account-unlinking', null));

      const { user, accountType } = payload;
      // Remove linked account from backend
      const linkedAccountId =
        (accountType === 'facebook' && user.facebookUser) ||
        (accountType === 'google' && user.googleUser) ||
        null;

      if (!linkedAccountId) {
        yield put(authActions.setPhase('account-unlinking-error', 'Account could not be found!'));
        return;
      }

      const response = yield axios.delete(`${backendBaseUrl}${linkedAccountId}`);

      if (response.status !== 204) {
        yield put(authActions.setPhase('account-unlinking-error', response.error));
        return;
      }

      yield put(authActions.setPhase('account-unlinking-successful', null));

      // Update client if success
      const updatedUser =
        (accountType === 'facebook' && { ...user, facebookUser: null }) ||
        (accountType === 'google' && { ...user, googleUser: null }) ||
        null;
      yield put({
        type: actionTypes.AUTH_UPDATE_USER,
        payload: { user: updatedUser }
      });
    }
  );
}
