import { takeLatest } from 'redux-saga/effects';

import { authActionTypes } from '../types';

import { sagaLogin } from './sagaLogin';
import { sagaLogout } from './sagaLogout';
import { sagaRegister } from './sagaRegister';
import { sagaUpdatePhase } from './sagaUpdatePhase';
import { sagaUpdateAuthUser } from './sagaUpdateAuthUser';
import { sagaUpdateUserPassword } from './sagaUpdateUserPassword';
import { sagaVerify } from './sagaVerify';
import { sagaForgotPassword } from './sagaForgotPassword';
import { sagaForgotPasswordSubmit } from './sagaForgotPasswordSubmit';

export function* sagas() {
  yield takeLatest(authActionTypes.SAGA.FORGOT_PASSWORD, sagaForgotPassword);
  yield takeLatest(authActionTypes.SAGA.FORGOT_PASSWORD_SUBMIT, sagaForgotPasswordSubmit);
  yield takeLatest(authActionTypes.SAGA.LOGIN, sagaLogin);
  yield takeLatest(authActionTypes.SAGA.LOGOUT, sagaLogout);
  yield takeLatest(authActionTypes.SAGA.REGISTER, sagaRegister);
  yield takeLatest(authActionTypes.SAGA.VERIFY, sagaVerify);
  yield takeLatest(authActionTypes.SAGA.UPDATE_USER, sagaUpdateAuthUser);
  yield takeLatest(authActionTypes.SAGA.UPDATE_PASSWORD, sagaUpdateUserPassword);
  yield takeLatest(authActionTypes.SAGA.UPDATE_PHASE, sagaUpdatePhase);
}
