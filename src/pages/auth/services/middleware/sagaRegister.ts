import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

export function* sagaRegister({ payload }: TAuthActionType) {
  // Update phase
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'adding', error: null }
  });

  const { email, password, name, lastname } = payload;

  try {
    const { user, userConfirmed } = yield Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name,
        family_name: lastname
      }
    });

    // Update user info
    yield put({
      type: authActionTypes.STORE.REGISTER,
      payload: {
        userConfirmed: userConfirmed,
        username: user.username,
        client: user.client,
        signInUserSession: user.signInUserSession
      }
    });

    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'success', error: null }
    });
  } catch (error) {
    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error: error }
    });
  }
}
