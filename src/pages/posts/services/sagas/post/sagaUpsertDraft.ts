import { put } from 'redux-saga/effects';

import { postActionTypes, TPostActionType } from '../../types';

export function* sagaUpsertDraft({ payload }: TPostActionType) {
  // Dispatch to the store
  yield put({
    type: postActionTypes.STORE.UPSERT_DRAFT,
    payload: payload
  });
}
