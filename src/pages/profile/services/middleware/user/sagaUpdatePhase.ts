import { put } from 'redux-saga/effects';

import { TUserActionType, userActionTypes } from '../../types';

export function* sagaUpdatePhase({ payload }: TUserActionType) {
  // Dispatch to the store
  yield put({ type: userActionTypes.STORE.UPDATE_PHASE, payload });
}
