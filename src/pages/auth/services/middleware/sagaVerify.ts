import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

export function* sagaVerify({ payload }: TAuthActionType) {
  // Update phase
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'verifying', error: null }
  });

  const { email, code } = payload;

  try {
    const response = yield Auth.confirmSignUp(email, code);

    if (response === 'SUCCESS') {
      // Update user info
      yield put({
        type: authActionTypes.STORE.VERIFY,
        payload: {
          userConfirmed: true
        }
      });

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
