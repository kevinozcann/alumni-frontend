import axios from 'axios';
import { put } from 'redux-saga/effects';

import { IUser } from 'pages/auth/data/account-types';
import { ISchool } from 'pages/organization/organization-types';
import { actionTypes } from 'store/user';
import { TLang } from 'utils/shared-types';
import { updateApiUrl, USER_MENUS_URL } from 'store/ApiUrls';

export function* getSchoolMenus(lang: TLang, user: IUser, activeSchool: ISchool) {
  const userMenusUrl = updateApiUrl(USER_MENUS_URL, {
    lang,
    userId: user.id,
    schoolId: activeSchool.id
  });
  const { data: menus } = yield axios.get(userMenusUrl);

  yield put({
    type: actionTypes.SET_SCHOOL_MENUS,
    payload: { menus }
  });
}
