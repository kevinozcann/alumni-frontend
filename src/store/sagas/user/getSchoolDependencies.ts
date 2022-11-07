import { fork, put } from 'redux-saga/effects';

import { IUser } from 'pages/account/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { actionTypes } from 'store/user';
import { TLang } from 'utils/shared-types';

import { getParentStudents } from './getParentStudents';
import { getUserPersonal } from './getUserPersonal';
import { getSchoolMenus } from './getSchoolMenus';

export function* getSchoolDependencies(lang: TLang, user: IUser, activeSchool: ISchool) {
  // Update active season
  const activeSeason = activeSchool?.seasons?.find((s: ISeason) => s.isDefault === 'on') || null;
  yield put({
    type: actionTypes.SET_ACTIVE_SEASON,
    payload: { activeSeason }
  });

  if (user.userType.id === 9) {
    yield fork(getParentStudents, lang, user.uuid);
  }

  // Get personal info
  yield fork(getUserPersonal, lang, user);
  yield fork(getSchoolMenus, lang, user, activeSchool);
}
