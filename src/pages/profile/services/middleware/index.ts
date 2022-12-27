import { takeLatest } from 'redux-saga/effects';

import { userActionTypes } from 'pages/profile/services/types';

import { sagaUpdatePhase } from './user/sagaUpdatePhase';
import { sagaGetUserProfile } from './user/sagaGetUserProfile';
import { sagaUpdateUserProfile } from './user/sagaUpdateUserProfile';

export function* sagas() {
  yield takeLatest(userActionTypes.SAGA.GET_USER_PROFILE, sagaGetUserProfile);
  yield takeLatest(userActionTypes.SAGA.UPDATE_USER_PROFILE, sagaUpdateUserProfile);
  yield takeLatest(userActionTypes.SAGA.UPDATE_PHASE, sagaUpdatePhase);
}
