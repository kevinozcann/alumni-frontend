import { call, put } from 'redux-saga/effects';

import { actionTypes } from 'store/user';
import { backendBaseUrl } from 'store/ApiUrls';
import { IUser } from 'pages/account/account-types';
import { ISchool } from 'pages/organization/organization-types';
import { TLang } from 'utils/shared-types';

import { getSchool } from './getSchool';
import { getSchoolDependencies } from './getSchoolDependencies';

export function* getUserSchools(lang: TLang, user: IUser, updateDependencies = true) {
  if (user.schools?.length > 0) {
    // Update schools
    const { schools } = user;
    const schoolsInfo: ISchool[] = [];
    // Pull school info
    for (let i = 0; i < schools.length; i++) {
      const a = yield call(getSchool, backendBaseUrl + schools[i]);

      schoolsInfo.push(a);
    }

    yield put({
      type: actionTypes.SET_USER_SCHOOLS,
      payload: { schools: schoolsInfo }
    });

    if (updateDependencies) {
      // Set active school
      let activeSchool = schoolsInfo[0];

      // If it is a teacher then set primary school as active school
      if (user.userType.id === 6 && user?.schools?.length > 1) {
        activeSchool = schoolsInfo.find((s) => s.id === user.schoolId);
      }

      // Update active school
      yield put({
        type: actionTypes.SET_ACTIVE_SCHOOL,
        payload: { activeSchool }
      });

      yield call(getSchoolDependencies, lang, user, activeSchool);
    }
  } else {
    // Update schools and active school
    yield put({
      type: actionTypes.SET_USER_SCHOOLS,
      payload: { schools: null }
    });
  }
}
