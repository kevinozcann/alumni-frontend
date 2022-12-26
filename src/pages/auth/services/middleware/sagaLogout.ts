import { put } from 'redux-saga/effects';

import { authActionTypes, TAuthActionType } from '../types';

export function* sagaLogout() {
  yield put({ type: authActionTypes.STORE.LOGOUT });
}
