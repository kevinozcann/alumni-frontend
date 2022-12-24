import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

export function* sagaVerify({ payload }: TAuthActionType) {
  yield put(authActions.setPhase('verifying', null));

  const { email, code } = payload;

  try {
    const response = yield Auth.confirmSignUp(email, code);

    if (response === 'SUCCESS') {
      // Update user info
      yield put({
        type: authActionTypes.STORE.UPDATE_AUTH,
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
