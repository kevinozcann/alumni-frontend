import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { userActionTypes } from 'pages/profile/services/types';

export function* sagaGetUserProfile() {
  yield put({
    type: userActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'loading', error: null }
  });

  try {
    const cognitoUser = yield Auth.currentAuthenticatedUser();

    console.log(cognitoUser);
  } catch (error) {
    yield put({
      type: userActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error }
    });
  }
}
