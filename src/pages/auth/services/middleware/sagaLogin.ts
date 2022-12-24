import { Auth } from 'aws-amplify';
import { call, put } from 'redux-saga/effects';

import { getUserImages } from 'pages/profile/services/middleware/user/getUserImages';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

export function* sagaLogin({ payload }: TAuthActionType) {
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'validating', error: null }
  });

  const { email, password } = payload;

  try {
    const cognitoUser = yield Auth.signIn(email, password);

    yield put({
      type: authActionTypes.STORE.UPDATE_AUTH,
      payload: {
        username: cognitoUser.username,
        pool: {
          userPoolId: cognitoUser.pool.userPoolId,
          clientId: cognitoUser.pool.clientId,
          advancedSecurityDataCollectionFlag: cognitoUser.pool.advancedSecurityDataCollectionFlag
        },
        client: cognitoUser.client,
        signInUserSession: cognitoUser.signInUserSession,
        accessToken: cognitoUser.signInUserSession.accessToken.jwtToken,
        refreshToken: cognitoUser.signInUserSession.refreshToken.token,
        user: cognitoUser.attributes,
        preferredMFA: cognitoUser.preferredMFA
      }
    });

    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'success', error: null }
    });
  } catch (error) {
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error }
    });
  }
}
