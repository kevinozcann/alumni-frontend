import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

export function* sagaRegister({ payload }: TAuthActionType) {
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
      type: authActionTypes.STORE.AUTH_UPDATE_USER,
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
