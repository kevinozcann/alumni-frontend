import { takeLatest } from 'redux-saga/effects';

import { actionTypes } from 'store/user';

import { addUser } from './addUser';
import { getUserSchools } from './getUserSchools';
import { pullActiveSchool } from './pullActiveSchool';
import { setActiveSeason } from './setActiveSeason';
import { updateActiveSchool } from './updateActiveSchool';
import { updateUserMenus } from './updateUserMenus';
import { updateUserSchools } from './updateUserSchools';

export function* sagas() {
  yield takeLatest(actionTypes.ADD_USER, addUser);

  yield takeLatest(actionTypes.PULL_CONFIGURATION_SCHOOL, pullActiveSchool);

  yield takeLatest(actionTypes.UPDATE_USER_MENUS, updateUserMenus);

  yield takeLatest(actionTypes.UPDATE_USER_SCHOOLS, updateUserSchools);

  yield takeLatest(actionTypes.UPDATE_ACTIVE_SCHOOL, updateActiveSchool);

  yield takeLatest(actionTypes.USER_SET_ACTIVE_SEASON, setActiveSeason);
}

export { getUserSchools };
