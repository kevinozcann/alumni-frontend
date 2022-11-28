import { all, spawn } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import { saga as authSagas, reducer as authReducer } from './auth';
import { saga as configSagas, reducer as configReducer } from './config';
import { saga as i18nSagas, reducer as i18nReducer } from './i18n';
import { saga as searchSagas, reducer as searchReducer } from './search';
import { saga as staticSagas, reducer as staticReducer } from './static';
import { saga as recentUpdatesSagas, reducer as recentUpdatesReducer } from './recentUpdates';
import { saga as userSagas, reducer as userReducer } from './user';

import { classesReducer, classesSagas } from 'pages/classes/_store';
import { developerReducer, developerSagas } from 'pages/developer/_store';
import { feedsReducer, feedsSagas } from 'pages/feeds/_store';
import { filemanagerReducer } from 'pages/filemanager/redux/reducers';
import { mailReducer, mailSagas } from 'pages/mail/_store';
import { organizationReducer, organizationSagas } from 'pages/organization/_store';
import { personnelReducer, personnelSagas } from 'pages/personnel/_store';
import { schoolReducer, schoolSagas } from 'pages/school/_store';
import { storeReducer, storeSagas } from 'pages/store/_store';
import { studentsReducer, studentsSagas } from 'pages/students/_store';
import { usersReducer, usersSagas } from 'pages/users/_store';
import { accountCodesReducer, accountCodesSagas } from 'pages/account-codes/_store';
import { incomeExpensesReducer, incomeExpensesSagas } from 'pages/income-expense/_store';
import { installmentsReducer, installmentsSagas } from 'pages/installment/_store';
import { schedulesReducer, schedulesSagas } from 'pages/schedule/_store';

export const rootReducer = combineReducers({
  auth: authReducer,
  classes: classesReducer,
  config: configReducer,
  developer: developerReducer,
  feeds: feedsReducer,
  filemanager: filemanagerReducer,
  i18n: i18nReducer,
  mails: mailReducer,
  organization: organizationReducer,
  personnel: personnelReducer,
  recentUpdates: recentUpdatesReducer,
  school: schoolReducer,
  search: searchReducer,
  static: staticReducer,
  store: storeReducer,
  students: studentsReducer,
  user: userReducer,
  users: usersReducer,
  accountCodes: accountCodesReducer,
  incomeExpenses: incomeExpensesReducer,
  installments: installmentsReducer,
  schedules: schedulesReducer
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
    classesSagas,
    developerSagas,
    feedsSagas,
    mailSagas,
    organizationSagas,
    personnelSagas,
    schoolSagas,
    storeSagas,
    studentsSagas,
    usersSagas,
    accountCodesSagas,
    incomeExpensesSagas,
    installmentsSagas,
    schedulesSagas
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
