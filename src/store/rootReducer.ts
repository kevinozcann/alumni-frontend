import { all, spawn } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import { saga as authSagas, reducer as authReducer } from './auth';
import { saga as configSagas, reducer as configReducer } from './config';
import { saga as i18nSagas, reducer as i18nReducer } from './i18n';
import { saga as searchSagas, reducer as searchReducer } from './search';
import { saga as staticSagas, reducer as staticReducer } from './static';
import { saga as recentUpdatesSagas, reducer as recentUpdatesReducer } from './recentUpdates';
import { saga as userSagas, reducer as userReducer } from './user';

import { developerReducer, developerSagas } from 'pages/developer/_store';
import { postsReducer, postsSagas } from 'pages/posts/services';
import { filemanagerReducer } from 'pages/filemanager/redux/reducers';
import { mailReducer, mailSagas } from 'pages/mail/_store';
import { organizationReducer, organizationSagas } from 'pages/organization/_store';
import { schoolReducer, schoolSagas } from 'pages/school/_store';
import { studentsReducer, studentsSagas } from 'pages/students/_store';
import { usersReducer, usersSagas } from 'pages/users/_store';

export const rootReducer = combineReducers({
  auth: authReducer,
  config: configReducer,
  developer: developerReducer,
  posts: postsReducer,
  filemanager: filemanagerReducer,
  i18n: i18nReducer,
  mails: mailReducer,
  organization: organizationReducer,
  recentUpdates: recentUpdatesReducer,
  school: schoolReducer,
  search: searchReducer,
  static: staticReducer,
  students: studentsReducer,
  user: userReducer,
  users: usersReducer
});

export function* rootSaga() {
  const mainSagas = [
    authSagas(),
    configSagas(),
    searchSagas(),
    i18nSagas(),
    staticSagas(),
    recentUpdatesSagas(),
    userSagas()
  ];
  const allSagas = mainSagas.concat(
    developerSagas,
    postsSagas,
    mailSagas,
    organizationSagas,
    schoolSagas,
    studentsSagas,
    usersSagas
  );

  yield all(
    allSagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield saga;
            break;
          } catch (e) {
            console.log(e);
          }
        }
      })
    )
  );
}
