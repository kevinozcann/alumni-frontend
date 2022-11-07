import { call } from 'redux-saga/effects';

import { TActionType } from 'store/user';

import { getSchoolMenus } from './getSchoolMenus';

export function* updateUserMenus({ payload }: TActionType) {
  const { lang, user, activeSchool } = payload;

  yield call(getSchoolMenus, lang, user, activeSchool);
}
