import { Amplify, Auth } from 'aws-amplify';
import objectPath from 'object-path';
import { GoogleLoginResponse } from 'react-google-login';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { IUser } from 'pages/account/account-types';
import { ISchool } from 'pages/organization/organization-types';
import { TLang, TLinkedAccount } from 'utils/shared-types';

import { IAction } from 'store/store';
import { getUserImages } from './sagas/user/getUserImages';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

const attributesList = [
  'name',
  'family_name',
  'email',
  'email_verified',
  'phone_number',
  'phone_number_verified',
  'custom:picture',
  'custom:wallpaper'
];

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
  pwd?: string;
  resetId?: string;
  school?: ISchool;
  schoolId?: number;
  updateAll?: boolean;
  userPassword?: TUserPassword;
  userSub?: string;
  userData?: Partial<IUser>;
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
  changePassword: (userPassword: TUserPassword): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_PASSWORD,
    payload: { userPassword }
  }),
  logout: (): IAction<Partial<TActionAllState>> => ({ type: actionTypes.AUTH_LOGOUT }),
  updateUserInfo: (userData: Partial<IUser>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_INFO,
    payload: { userData }
  }),
  setPhase: (phase: string, error: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_LOGIN_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.AUTH_LOGIN,
    function* loginSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('validating', null));

      const { email, password } = payload;

      try {
        const user = yield Auth.signIn(email, password);

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

        yield call(getUserImages);

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
      yield put({
        type: actionTypes.AUTH_TOKEN_SAVE,
        payload
      });
      yield put(authActions.setPhase('userinfo-pulling', null));
      // yield put(authActions.requestUser(lang, userId, true, null));
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
          attributes: {
            email,
            name,
            family_name: lastname,
            phone_number: phoneNumber,
            'custom:picture': '',
            'custom:wallpaper': ''
          }
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
    actionTypes.UPDATE_USER_INFO,
    function* updateUserSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('updating', null));

      const { userData } = payload;

      const user = yield Auth.currentAuthenticatedUser();

      if (userData.hasOwnProperty('attributes')) {
        try {
          const attributes = userData['attributes'];
          const updateAttributes = {};

          attributesList.forEach((attribute) => {
            if (attributes.hasOwnProperty(attribute)) {
              updateAttributes[attribute] = attributes[attribute];
            }
          });

          const result = yield Auth.updateUserAttributes(user, updateAttributes);

          if (result === 'SUCCESS') {
            yield put({
              type: actionTypes.AUTH_UPDATE_USER,
              payload: {
                attributes: updateAttributes
              }
            });

            // If pictures are updated then get a temp url for them
            if (
              attributes.hasOwnProperty('custom:picture') ||
              attributes.hasOwnProperty('custom:wallpaper')
            ) {
              yield call(getUserImages);
            }
          } else {
            yield put(authActions.setPhase('error', 'An error occurred!'));
          }

          yield put(authActions.setPhase('success', null));
        } catch (error) {
          console.log('error', error);
          yield put(authActions.setPhase('error', error));
        }
      }
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_PASSWORD,
    function* updateUserPasswordSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('updating', null));

      const {
        userPassword: { currentPassword, newPassword, confirmPassword }
      } = payload;

      if (newPassword !== confirmPassword) {
        yield put(authActions.setPhase('error', 'login.reset_password.password_no_match'));
        return;
      }

      const user = yield Auth.currentAuthenticatedUser();

      try {
        const response = yield Auth.changePassword(user, currentPassword, newPassword);

        if (response === 'SUCCESS') {
          yield put(authActions.setPhase('success', null));
          yield delay(3000);
          yield put(authActions.logout());
        } else {
          yield put(authActions.setPhase('error', 'An error occurred!'));
        }
      } catch (error) {
        console.log('error', error);
        yield put(authActions.setPhase('error', error));
      }
    }
  );
}
