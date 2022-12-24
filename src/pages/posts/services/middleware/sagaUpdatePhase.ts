import { put } from 'redux-saga/effects';

import { postActionTypes, TPostActionType } from '../types';

export function* sagaUpdatePhase({ payload }: TPostActionType) {
  // Dispatch to the store
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: payload
  });
}
