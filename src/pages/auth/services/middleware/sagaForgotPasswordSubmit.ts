import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { authActionTypes, TAuthActionType } from '../types';

export function* sagaForgotPasswordSubmit({ payload }: TAuthActionType) {
  // Update phase
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'sending', error: null }
  });

  const { email, code, userPassword } = payload;
  const { newPassword } = userPassword;

  try {
    const response = yield Auth.forgotPasswordSubmit(email, code, newPassword);

    console.log(response);

    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'success', error: null }
    });
  } catch (error) {
    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error }
    });
  }
}
