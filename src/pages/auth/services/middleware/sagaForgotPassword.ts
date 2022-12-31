import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { authActionTypes, TAuthActionType } from '../types';

export function* sagaForgotPassword({ payload }: TAuthActionType) {
  // Update phase
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'sending', error: null }
  });

  const { email } = payload;

  try {
    const response = yield Auth.forgotPassword(email);

    console.log(response);

    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'code_sent', error: null }
    });
  } catch (error) {
    // Update phase
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error }
    });
  }
}
