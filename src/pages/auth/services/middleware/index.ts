import { takeLatest } from 'redux-saga/effects';

import { authActionTypes } from '../types';

import { sagaLogin } from './sagaLogin';
import { sagaRegister } from './sagaRegister';
import { sagaUpdateUserInfo } from './sagaUpdateUserInfo';
import { sagaUpdateUserPassword } from './sagaUpdateUserPassword';
import { sagaVerify } from './sagaVerify';

export function* sagas() {
  yield takeLatest(authActionTypes.SAGA.LOGIN, sagaLogin);
  yield takeLatest(authActionTypes.SAGA.REGISTER, sagaRegister);
  yield takeLatest(authActionTypes.SAGA.AUTH_VERIFY, sagaVerify);
  yield takeLatest(authActionTypes.SAGA.UPDATE_USER_INFO, sagaUpdateUserInfo);
  yield takeLatest(authActionTypes.SAGA.UPDATE_USER_PASSWORD, sagaUpdateUserPassword);
}
