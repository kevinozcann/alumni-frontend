import axios from 'axios';
import { put } from 'redux-saga/effects';

import { USERS_API_URL } from 'store/ApiUrls';
import { TActionType, userActions } from 'store/user';

export function* addUser({ payload }: TActionType) {
  yield put(userActions.setPhase('adding', null));

  const { email, name, lastname, password, userType } = payload;

  // Add user
  const response = yield axios.post(USERS_API_URL, {
    name,
    lastName: lastname,
    email,
    password,
    userType
  });

  if (response.status !== 201) {
    if (response.status === 422) {
      yield put(userActions.setPhase('error', response.data.detail || response.data.title));
    } else {
      yield put(userActions.setPhase('error', response.data.error || response.data.title));
    }
    return;
  }

  // Update the store
  // yield put({
  //   type: actionTypes.SET_ACTIVE_SCHOOL,
  //   payload: { activeSchool: response.data }
  // });
  yield put(userActions.setPhase('success', null));
}
