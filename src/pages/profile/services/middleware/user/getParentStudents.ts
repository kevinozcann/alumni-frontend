import axios from 'axios';
import { put } from 'redux-saga/effects';

import { TLang } from 'utils/shared-types';
import { updateApiUrl, USER_STUDENTS_URL } from 'store/ApiUrls';

import { userActionTypes } from '../../types';
import { userActions } from '../../actions';

export function* getParentStudents(lang: TLang, userId: string) {
  yield put(userActions.setPhase('pulling', null));

  const userStudentsUrl = updateApiUrl(USER_STUDENTS_URL, { lang, userId });
  const response = yield axios.get(userStudentsUrl);

  if (response.status !== 200) {
    yield put({
      type: userActionTypes.USER_UPDATE_ACTIVE_STUDENT,
      payload: { activeStudent: null }
    });
    yield put(userActions.setPhase('error', 'Error occurred!'));
    return;
  }

  const students = response.data;
  yield put({
    type: userActionTypes.USER_UPDATE_ACTIVE_STUDENT,
    payload: { activeStudent: students[0] }
  });
  yield put(userActions.setPhase('success', null));
}
