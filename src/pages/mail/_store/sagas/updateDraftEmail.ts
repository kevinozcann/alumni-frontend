import { put } from 'redux-saga/effects';

import { IAction } from 'store/store';

import { TActionAllState } from '../types';
import { actionTypes } from '../actionTypes';

export function* updateDraftEmail({ payload }: IAction<Partial<TActionAllState>>) {
  const { email } = payload;

  yield put({
    type: actionTypes.UPDATE_DRAFT_IN_STORE,
    payload: { email }
  });
}
