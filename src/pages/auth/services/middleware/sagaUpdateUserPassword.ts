import { Auth } from 'aws-amplify';
import { delay, put } from 'redux-saga/effects';

import { authActions } from '../actions';
import { TAuthActionType } from '../types';

export function* sagaUpdateUserPassword({ payload }: TAuthActionType) {
  yield put(authActions.setPhase('updating', null));

  const {
    userPassword: { currentPassword, newPassword, confirmPassword }
  } = payload;

  if (newPassword !== confirmPassword) {
    yield put(authActions.setPhase('error', 'login.reset_password.password_no_match'));
    return;
  }

  const user = yield Auth.currentAuthenticatedUser();

  try {
    const response = yield Auth.changePassword(user, currentPassword, newPassword);

    if (response === 'SUCCESS') {
      yield put(authActions.setPhase('success', null));
      yield delay(3000);
      yield put(authActions.logout());
    } else {
      yield put(authActions.setPhase('error', 'An error occurred!'));
    }
  } catch (error) {
    console.log('error', error);
    yield put(authActions.setPhase('error', error));
  }
}
