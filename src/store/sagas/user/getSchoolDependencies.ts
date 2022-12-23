import { fork, put } from 'redux-saga/effects';

import { IUser } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { actionTypes } from 'store/user';
import { TLang } from 'utils/shared-types';

import { getUserPersonal } from './getUserPersonal';
import { getSchoolMenus } from './getSchoolMenus';

export function* getSchoolDependencies(lang: TLang, user: IUser, activeSchool: ISchool) {
  // Update active season
  const activeSeason = activeSchool?.seasons?.find((s: ISeason) => s.isDefault === 'on') || null;
  yield put({
    type: actionTypes.SET_ACTIVE_SEASON,
    payload: { activeSeason }
  });

  // Get personal info
  yield fork(getUserPersonal, lang, user);
  yield fork(getSchoolMenus, lang, user, activeSchool);
}
