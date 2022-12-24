import { fork, put } from 'redux-saga/effects';

import { IUser } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { userActionTypes } from 'pages/profile/services/types';
import { TLang } from 'utils/shared-types';

import { getUserPersonal } from './getUserPersonal';
import { getSchoolMenus } from './getSchoolMenus';

export function* getSchoolDependencies(lang: TLang, user: IUser, activeSchool: ISchool) {
  // Update active season
  const activeSeason = activeSchool?.seasons?.find((s: ISeason) => s.isDefault === 'on') || null;
  yield put({
    type: userActionTypes.SET_ACTIVE_SEASON,
    payload: { activeSeason }
  });

  // Get personal info
  yield fork(getUserPersonal, lang, user);
  yield fork(getSchoolMenus, lang, user, activeSchool);
}
