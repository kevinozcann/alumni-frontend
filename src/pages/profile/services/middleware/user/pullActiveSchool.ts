import axios from 'axios';
import { put } from 'redux-saga/effects';

import { CONFIGURATION_URL, updateApiUrl } from 'store/ApiUrls';

import { userActions } from '../../actions';
import { userActionTypes } from '../../types';

export function* pullActiveSchool() {
  yield put(userActions.setPhase('active-school-pulling', null));

  // Pull the list of configurations
  const configUrl = updateApiUrl(CONFIGURATION_URL, { lang: 'en' });
  const response = yield axios.get(configUrl);

  if (response.status !== 200) {
    yield put(
      userActions.setPhase('active-school-error', response.data.error || response.data.title)
    );
    return;
  }

  // Update the store
  yield put({
    type: userActionTypes.SET_ACTIVE_SCHOOL,
    payload: { activeSchool: response.data }
  });
  yield put(userActions.setPhase('active-school-success', null));
}
