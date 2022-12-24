import { Auth } from 'aws-amplify';
import { call, put } from 'redux-saga/effects';

import { getUserImages } from 'pages/profile/services/middleware/user/getUserImages';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

export function* sagaLogin({ payload }: TAuthActionType) {
  yield put(authActions.setPhase('validating', null));

  const { email, password } = payload;

  try {
    const user = yield Auth.signIn(email, password);

    yield put({
      type: authActionTypes.STORE.AUTH_UPDATE_USER,
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
