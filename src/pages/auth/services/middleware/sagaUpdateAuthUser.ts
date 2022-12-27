import { Auth } from 'aws-amplify';
import { call, delay, put } from 'redux-saga/effects';

import { getUserImages } from 'pages/profile/services/middleware/user/getUserImages';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

const attributesList = ['name', 'family_name', 'phone_number'];

export function* sagaUpdateAuthUser({ payload }: TAuthActionType) {
  // Update phase
  yield put({
    type: authActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'updating', error: null }
  });

  const { user } = payload;
  const authenticatedUser = yield Auth.currentAuthenticatedUser();

  try {
    const updatedAttributes = {};

    attributesList.forEach((attribute) => {
      if (user.hasOwnProperty(attribute)) {
        updatedAttributes[attribute] = user[attribute];
      }
    });

    const result = yield Auth.updateUserAttributes(authenticatedUser, updatedAttributes);

    if (result === 'SUCCESS') {
      // Update the auth user in the store if it is successfull update
      yield put({
        type: authActionTypes.STORE.UPDATE_USER,
        payload: { user: user }
      });
    } else {
      // Update phase with error
      yield put({
        type: authActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'error', error: 'An error occurred!' }
      });
    }

    // Update phase with success
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'success', error: null }
    });
  } catch (error) {
    // Update phase with error
    yield put({
      type: authActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error: error }
    });
  }
}
