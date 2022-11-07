import axios from 'axios';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import { delay, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { IAction } from '../../../store/store';
import { TLang } from '../../../utils/shared-types';
import { DASHBOARD_BASIC_STATS_URL, updateApiUrl } from '../../../store/ApiUrls';
import { ISchoolDashboard } from '.';

interface IStatItem {
  title?: string;
  total: number;
}
export interface IBasicStatsState {
  numberOfUsers: IStatItem;
  numberOfStudents: IStatItem;
  dailyCash: IStatItem;
  dailyEnrollments: IStatItem;
  phase: string;
}
type TActionAllState = IBasicStatsState & {
  lang?: TLang;
  schoolId?: number;
};
export const actionPhases = {
  PULLING: 'basic-stats-pulling',
  PULLING_ERROR: 'basic-stats-pulling-error',
  PULLING_SUCCESSFUL: 'basic-stats-pulling-successful'
};
export const actionTypes = {
  PULL_BASIC_STATS: 'school/dashboard/PULL_BASIC_STATS',
  SET_BASIC_STATS: 'school/dashboard/SET_BASIC_STATS',
  UPDATE_PHASE: 'school/dashboard/UPDATE_BASIC_STATS_PHASE'
};

const initialState: IBasicStatsState = {
  numberOfUsers: null,
  numberOfStudents: null,
  dailyCash: null,
  dailyEnrollments: null,
  phase: null
};

export const basicStatsSelector = createSelector(
  (state: ISchoolDashboard) => objectPath.get(state, ['school', 'basicStats']),
  (basicStats: IBasicStatsState) => basicStats
);
export const basicStatsPhaseSelector = createSelector(
  (state: IBasicStatsState) => objectPath.get(state, ['school', 'basicStats', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'basicStats', whitelist: ['school', 'dashboard', 'basicStats'] },
  (state: IBasicStatsState = initialState, action: IAction<TActionAllState>): IBasicStatsState => {
    switch (action.type) {
      case actionTypes.SET_BASIC_STATS: {
        const { numberOfUsers, numberOfStudents, dailyCash, dailyEnrollments } = action.payload;
        return {
          ...state,
          numberOfUsers,
          numberOfStudents,
          dailyCash,
          dailyEnrollments
        };
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

export const basicStatsActions = {
  pullBasicStats: (lang: TLang, schoolId: number) => ({
    type: actionTypes.PULL_BASIC_STATS,
    payload: { lang, schoolId }
  }),
  setPhase: (phase: string) => ({
    type: actionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};

function* pullBasicStats({ payload }: IAction<Partial<TActionAllState>>) {
  let factor = 1;
  while (true) {
    yield put(basicStatsActions.setPhase(actionPhases.PULLING));

    const { lang, schoolId } = payload;
    const dashboardBasicStatsUrl = updateApiUrl(DASHBOARD_BASIC_STATS_URL, { lang, schoolId });
    const response = yield axios.get(dashboardBasicStatsUrl);

    if (response.status !== 200) {
      yield put(basicStatsActions.setPhase(actionPhases.PULLING_ERROR));
    } else {
      yield put({
        type: actionTypes.SET_BASIC_STATS,
        payload: response.data
      });
      yield put(basicStatsActions.setPhase(actionPhases.PULLING_SUCCESSFUL));
    }

    // Repeat every 15 mins
    yield delay(factor * 15 * 60 * 1000);
    factor = factor + 1;
  }
}

export function* saga() {
  yield takeLatest(actionTypes.PULL_BASIC_STATS, pullBasicStats);
}
