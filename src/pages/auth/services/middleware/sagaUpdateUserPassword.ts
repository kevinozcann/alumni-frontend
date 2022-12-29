import { Auth } from 'aws-amplify';
import { delay, put } from 'redux-saga/effects';

import { authActionTypes, TAuthActionType } from '../types';

export function* sagaUpdateUserPassword({ payload }: TAuthActionType) {
  // Update phase
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'updating', error: null }
  });

  const {
    userPassword: { currentPassword, newPassword, confirmPassword }
  } = payload;

  if (newPassword !== confirmPassword) {
    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error: 'login.reset_password.password_no_match' }
    });

    return;
  }

  const currentUser = yield Auth.currentAuthenticatedUser();

  try {
    const response = yield Auth.changePassword(currentUser, currentPassword, newPassword);

    if (response === 'SUCCESS') {
      // Update phase
      yield put({
        type: authActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'success', error: null }
      });
    } else {
      // Update phase
      yield put({
        type: authActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'error', error: 'An error occurred!' }
      });
    }
  } catch (error) {
    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error: error }
    });
  }
}
