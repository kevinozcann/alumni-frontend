import { combineReducers } from 'redux';

import * as basicStats from './basicStats';
import * as dailyCashStats from './dailyCashStats';
import * as schoolUsageStats from './schoolUsageStats';
import * as enrollmentStats from './enrollmentStats';

// import * as helpdeskIncidents from './helpdeskIncidents';

interface ISchoolDashboardItem {
  basicStats: basicStats.IBasicStatsState;
  dailyCashStats: dailyCashStats.IDailyCashStatsState;
  schoolUsageStats: schoolUsageStats.ISchoolUsageStats;
  enrollmentStats: enrollmentStats.IEnrollmentStats;
}
export interface ISchoolDashboard {
  school: ISchoolDashboardItem;
}

export const schoolSagas = [
  basicStats.saga(),
  dailyCashStats.saga(),
  schoolUsageStats.saga(),
  enrollmentStats.saga()
  // helpdeskIncidents.saga(),
];

export const schoolReducer = combineReducers({
  basicStats: basicStats.reducer,
  dailyCashStats: dailyCashStats.reducer,
  schoolUsageStats: schoolUsageStats.reducer,
  enrollmentStats: enrollmentStats.reducer
  // helpdeskIncidents: helpdeskIncidents.reducer,
});
