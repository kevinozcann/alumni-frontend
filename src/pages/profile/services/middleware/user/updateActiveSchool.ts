import { call, put } from 'redux-saga/effects';

import { userActions } from '../../actions';
import { TUserActionType, userActionTypes } from '../../types';

import { getSchoolMenus } from './getSchoolMenus';

export function* updateActiveSchool({ payload }: TUserActionType) {
  const { lang, user, activeSchool } = payload;

  yield put(userActions.setPhase('updating', null));
  yield put({
    type: userActionTypes.SET_ACTIVE_SCHOOL,
    payload: { activeSchool }
  });

  const activeSeason = activeSchool?.seasons?.find((s) => s.isDefault === 'on') || null;
  yield put({
    type: userActionTypes.SET_ACTIVE_SEASON,
    payload: { activeSeason }
  });

  // Update school menu
  yield call(getSchoolMenus, lang, user, activeSchool);

  yield put(userActions.setPhase('success', null));
}
