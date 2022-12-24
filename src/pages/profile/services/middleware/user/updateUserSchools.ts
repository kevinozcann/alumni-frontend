import { call, put } from 'redux-saga/effects';

import { userActions } from '../../actions';
import { TUserActionType } from '../../types';

import { getUserSchools } from './getUserSchools';

export function* updateUserSchools({ payload }: TUserActionType) {
  yield put(userActions.setPhase('updating', null));

  const { lang, user } = payload;
  yield call(getUserSchools, lang, user, false);

  yield put(userActions.setPhase('success', null));
}
