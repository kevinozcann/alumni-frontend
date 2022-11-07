import { call, put } from 'redux-saga/effects';

import { actionTypes, TActionType, userActions } from 'store/user';

import { getSchoolMenus } from './getSchoolMenus';

export function* updateActiveSchool({ payload }: TActionType) {
  const { lang, user, activeSchool } = payload;

  yield put(userActions.setPhase('updating', null));
  yield put({
    type: actionTypes.SET_ACTIVE_SCHOOL,
    payload: { activeSchool }
  });

  const activeSeason = activeSchool?.seasons?.find((s) => s.isDefault === 'on') || null;
  yield put({
    type: actionTypes.SET_ACTIVE_SEASON,
    payload: { activeSeason }
  });

  // Update school menu
  yield call(getSchoolMenus, lang, user, activeSchool);

  yield put(userActions.setPhase('success', null));
}
