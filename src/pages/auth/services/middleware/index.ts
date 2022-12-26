import { takeLatest } from 'redux-saga/effects';

import { authActionTypes } from '../types';

import { sagaLogin } from './sagaLogin';
import { sagaLogout } from './sagaLogout';
import { sagaRegister } from './sagaRegister';
import { sagaUpdatePhase } from './sagaUpdatePhase';
import { sagaUpdateUser } from './sagaUpdateUser';
import { sagaUpdateUserPassword } from './sagaUpdateUserPassword';
import { sagaVerify } from './sagaVerify';

export function* sagas() {
  yield takeLatest(authActionTypes.SAGA.LOGIN, sagaLogin);
  yield takeLatest(authActionTypes.SAGA.LOGOUT, sagaLogout);
  yield takeLatest(authActionTypes.SAGA.REGISTER, sagaRegister);
  yield takeLatest(authActionTypes.SAGA.AUTH_VERIFY, sagaVerify);
  yield takeLatest(authActionTypes.SAGA.UPDATE_USER, sagaUpdateUser);
  yield takeLatest(authActionTypes.SAGA.UPDATE_USER_PASSWORD, sagaUpdateUserPassword);
  yield takeLatest(authActionTypes.SAGA.UPDATE_PHASE, sagaUpdatePhase);
}
