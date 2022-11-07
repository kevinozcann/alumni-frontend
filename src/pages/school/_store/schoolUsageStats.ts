import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';
import { DASHBOARD_SCHOOL_USAGE_STATS_URL, updateApiUrl } from '../../../store/ApiUrls';
import { TLang } from '../../../utils/shared-types';
import { IAction } from '../../../store/store';
import { ISchoolDashboard } from '.';

export interface ISchoolUsageStats {
  usageStats: any[];
  phase: string;
}
type TActionAllState = ISchoolUsageStats & {
  lang?: TLang;
};
export const actionPhases = {
  PULLING: 'school-usage-stats-pulling',
  PULLING_ERROR: 'school-usage-stats-pulling-error',
  PULLING_SUCCESSFUL: 'school-usage-stats-pulling-successful'
};
export const actionTypes = {
  PULL_SCHOOL_USAGE_STATS: 'school/dashboard/PULL_SCHOOL_USAGE_STATS',
  SET_SCHOOL_USAGE_STATS: 'school/dashboard/SET_SCHOOL_USAGE_STATS',
  UPDATE_PHASE: 'school/dashboard/UPDATE_SCHOOL_USAGE_STATS_PHASE'
};

const initialState: ISchoolUsageStats = {
  usageStats: null,
  phase: null
};

export const schoolUsageStatsSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'schoolUsageStats', 'usageStats']),
  (usageStats: any[]) => usageStats
);
export const schoolUsageStatsPhaseSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'schoolUsageStats', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'schoolUsageStats', whitelist: ['school', 'schoolUsageStats'] },
  (
    state: ISchoolUsageStats = initialState,
    action: IAction<TActionAllState>
  ): ISchoolUsageStats => {
    switch (action.type) {
      case actionTypes.SET_SCHOOL_USAGE_STATS: {
        const { usageStats } = action.payload;
        return { ...state, usageStats };
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

export const schoolUsageStatsActions = {
  pullSchoolUsageStats: (lang: TLang) => ({
    type: actionTypes.PULL_SCHOOL_USAGE_STATS,
    payload: { lang }
  }),
  setPhase: (phase: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_SCHOOL_USAGE_STATS,
    function* pullSchoolUsageStatsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(schoolUsageStatsActions.setPhase(actionPhases.PULLING));

      const { lang } = payload;
      const dashboardSchoolUsageStatsUrl = updateApiUrl(DASHBOARD_SCHOOL_USAGE_STATS_URL, {
        lang: lang
      });
      const response = yield axios.get(dashboardSchoolUsageStatsUrl);

      if (response.status !== 200) {
        yield put(schoolUsageStatsActions.setPhase(actionPhases.PULLING_ERROR));
        return;
      }

      yield put({
        type: actionTypes.SET_SCHOOL_USAGE_STATS,
        payload: { usageStats: response.data }
      });

      yield put(schoolUsageStatsActions.setPhase(actionPhases.PULLING_SUCCESSFUL));
    }
  );
}
