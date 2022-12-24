import { takeLatest } from 'redux-saga/effects';

import { userActionTypes } from 'pages/profile/services/types';

import { addUser } from './user/addUser';
import { getUserSchools } from './user/getUserSchools';
import { pullActiveSchool } from './user/pullActiveSchool';
import { setActiveSeason } from './user/setActiveSeason';
import { updateActiveSchool } from './user/updateActiveSchool';
import { updateUserMenus } from './user/updateUserMenus';
import { updateUserSchools } from './user/updateUserSchools';

export function* sagas() {
  yield takeLatest(userActionTypes.ADD_USER, addUser);
  yield takeLatest(userActionTypes.PULL_CONFIGURATION_SCHOOL, pullActiveSchool);
  yield takeLatest(userActionTypes.UPDATE_USER_MENUS, updateUserMenus);
  yield takeLatest(userActionTypes.UPDATE_USER_SCHOOLS, updateUserSchools);
  yield takeLatest(userActionTypes.UPDATE_ACTIVE_SCHOOL, updateActiveSchool);
  yield takeLatest(userActionTypes.USER_SET_ACTIVE_SEASON, setActiveSeason);
}
