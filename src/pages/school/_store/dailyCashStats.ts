import axios from 'axios';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { TLang } from '../../../utils/shared-types';
import { IAction } from '../../../store/store';
import { DASHBOARD_DAILY_CASH_STATS_URL, updateApiUrl } from '../../../store/ApiUrls';
import { ISchoolDashboard } from '.';

interface IDailyCash {
  date: string;
  payment: number;
}
export interface IDailyCashStatsState {
  dailyCash: Record<number, IDailyCash>;
  phase: string;
}
type TActionAllState = IDailyCashStatsState & {
  lang?: TLang;
  schoolId?: number;
  period?: string;
};
export const actionPhases = {
  PULLING: 'daily-cash-stats-pulling',
  PULLING_ERROR: 'daily-cash-stats-pulling-error',
  PULLING_SUCCESSFUL: 'daily-cash-stats-pulling-successful'
};
export const actionTypes = {
  PULL_DAILY_CASH_STATS: 'school/dashboard/PULL_DAILY_CASH_STATS',
  SET_DAILY_CASH_STATS: 'school/dashboard/SET_DAILY_CASH_STATS',
  UPDATE_PHASE: 'school/dashboard/UPDATE_DAILY_CASH_STATS_PHASE'
};

const initialState: IDailyCashStatsState = {
  dailyCash: null,
  phase: null
};

export const dailyCashStatsSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'dailyCashStats', 'dailyCash']),
  (dailyCashStats: IDailyCashStatsState) => dailyCashStats
);
export const dailyCashStatsPhaseSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'dailyCashStats', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  {
    storage,
    key: 'dailyCashStats',
    whitelist: ['school', 'dailyCash', 'phase']
  },
  (
    state: IDailyCashStatsState = initialState,
    action: IAction<TActionAllState>
  ): IDailyCashStatsState => {
    switch (action.type) {
      case actionTypes.SET_DAILY_CASH_STATS: {
        const { dailyCash } = action.payload;
        return { ...state, dailyCash };
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

export const dailyCashStatsActions = {
  pullDailyCashStats: (lang: TLang, schoolId: number, period: string) => ({
    type: actionTypes.PULL_DAILY_CASH_STATS,
    payload: { lang, schoolId, period }
  }),
  setPhase: (phase: string) => ({
    type: actionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};

function* pullDailyCashStats({ payload }: IAction<Partial<TActionAllState>>) {
  yield put(dailyCashStatsActions.setPhase(actionPhases.PULLING));

  const { lang, schoolId, period } = payload;
  const dashboardDailyCashStatsUrl = updateApiUrl(DASHBOARD_DAILY_CASH_STATS_URL, {
    lang: lang,
    schoolId: schoolId,
    period: period.toLowerCase()
  });
  const response = yield axios.get(dashboardDailyCashStatsUrl);

  if (response.status !== 200) {
    yield put(dailyCashStatsActions.setPhase(actionPhases.PULLING_ERROR));
  } else {
    yield put({
      type: actionTypes.SET_DAILY_CASH_STATS,
      payload: { dailyCash: response.data }
    });

    yield put(dailyCashStatsActions.setPhase(actionPhases.PULLING_SUCCESSFUL));
  }
}

export function* saga() {
  yield takeLatest(actionTypes.PULL_DAILY_CASH_STATS, pullDailyCashStats);
}
