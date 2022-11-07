import { call, put } from 'redux-saga/effects';

import { TActionType, userActions } from 'store/user';

import { getUserSchools } from './getUserSchools';

export function* updateUserSchools({ payload }: TActionType) {
  yield put(userActions.setPhase('updating', null));

  const { lang, user } = payload;
  yield call(getUserSchools, lang, user, false);

  yield put(userActions.setPhase('success', null));
}
