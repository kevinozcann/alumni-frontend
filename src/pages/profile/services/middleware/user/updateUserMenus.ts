import { call } from 'redux-saga/effects';

import { TUserActionType } from 'pages/profile/services/types';

import { getSchoolMenus } from './getSchoolMenus';

export function* updateUserMenus({ payload }: TUserActionType) {
  const { lang, user, activeSchool } = payload;

  yield call(getSchoolMenus, lang, user, activeSchool);
}
