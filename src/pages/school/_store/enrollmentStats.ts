import axios from 'axios';
import objectPath from 'object-path';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { DASHBOARD_ENROLLMENT_STATS_URL, updateApiUrl } from 'store/ApiUrls';
import { IAction } from 'store/store';
import { TLang } from 'utils/shared-types';

import { ISchoolDashboard } from 'pages/school/_store';

interface IEnrollmentStatsItem {
  date: string;
  enrollment: number;
  preEnrollment: number;
}
export interface IEnrollmentStats {
  stats: IEnrollmentStatsItem[];
  phase: string;
}
type TActionAllState = IEnrollmentStats & {
  lang?: TLang;
  schoolId?: number;
  period?: string;
};

export const actionPhases = {
  PULLING: 'enrollment-stats-pulling',
  PULLING_SUCCESSFUL: 'enrollment-stats-pulling-successful',
  PULLING_ERROR: 'enrollment-stats-pulling-error'
};

export const actionTypes = {
  PULL_ENROLLMENT_STATS: 'school/dashboard/PULL_ENROLLMENT_STATS',
  SET_ENROLLMENT__STATS: 'school/dashboard/SET_ENROLLMENT_STATS',
  UPDATE_PHASE: 'school/dashboard/UPDATE_ENROLLMENT_STATS_PHASE'
};

const initialState: IEnrollmentStats = {
  stats: null,
  phase: null
};

export const enrollmentStatsSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'enrollmentStats', 'stats']),
  (enrollmentStats: IEnrollmentStats) => enrollmentStats
);
export const enrollmentStatsPhaseSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'enrollmentStats', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'enrollmentStats', whitelist: ['school', 'enrollmentStats'] },
  (state: IEnrollmentStats = initialState, action: IAction<TActionAllState>): IEnrollmentStats => {
    switch (action.type) {
      case actionTypes.PULL_ENROLLMENT_STATS: {
        return { ...state };
      }
      case actionTypes.SET_ENROLLMENT__STATS: {
        const { stats } = action.payload;
        return { ...state, stats };
      }
      case actionTypes.UPDATE_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const enrollmentStatsActions = {
  pullEnrollmentStats: (lang: TLang, schoolId: number, period: string) => ({
    type: actionTypes.PULL_ENROLLMENT_STATS,
    payload: { lang, schoolId, period }
  }),
  setPhase: (phase: string) => ({
    type: actionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_ENROLLMENT_STATS,
    function* pullEnrollmentStatsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(enrollmentStatsActions.setPhase(actionPhases.PULLING));

      const { lang, schoolId, period } = payload;
      const dashboardEnrollmentStatsUrl = updateApiUrl(DASHBOARD_ENROLLMENT_STATS_URL, {
        lang: lang,
        schoolId: schoolId,
        period: period
      });
      const response = yield axios.get(dashboardEnrollmentStatsUrl);

      if (response.status !== 200) {
        yield put(enrollmentStatsActions.setPhase(actionPhases.PULLING_ERROR));
        return;
      }

      yield put({
        type: actionTypes.SET_ENROLLMENT__STATS,
        payload: { stats: response.data }
      });

      yield put(enrollmentStatsActions.setPhase(actionPhases.PULLING_SUCCESSFUL));
    }
  );
}
