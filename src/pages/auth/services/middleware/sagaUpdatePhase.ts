import { put } from 'redux-saga/effects';

import { authActionTypes, TAuthActionType } from '../types';

export function* sagaUpdatePhase({ payload }: TAuthActionType) {
  // Dispatch to the store
  yield put({ type: authActionTypes.STORE.UPDATE_PHASE, payload });
}
