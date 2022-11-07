import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import { ISchool } from 'pages/organization/organization-types';
import { IAction } from 'store/store';
import { SCHEDULES_API_URL } from 'store/ApiUrls';
import { ISchedule } from './schedule-types';
import moment from 'moment';

export type TPhase = null | 'loading' | 'adding' | 'updating' | 'deleting' | 'error' | 'success';

interface IScheduleState {
  schedules: ISchedule[];
  phase: TPhase;
}

type TActionAllState = IScheduleState & {
  id: number;
  school: ISchool;
  schedule: ISchedule;
  scheduleInfo: Partial<ISchedule>;
};

export const actionTypes = {
  PULL_SCHEDULES: 'schedules/PULL_SCHEDULES',
  SET_SCHEDULES: 'schedules/SET_SCHEDULES',
  SET_PHASE: 'schedules/SET_PHASE'
};

export const initialState: IScheduleState = {
  schedules: [],
  phase: null
};

export const scheduleSelector = createSelector(
  (state: IScheduleState) => objectPath.get(state, ['schedules', 'schedules']),
  (schedules: ISchedule[]) => schedules
);

export const schedulePhaseSelector = createSelector(
  (state: IScheduleState) => objectPath.get(state, ['schedules', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'schedules' },
  (state: IScheduleState = initialState, action: IAction<TActionAllState>): IScheduleState => {
    switch (action.type) {
      case actionTypes.SET_SCHEDULES: {
        const { schedules } = action.payload;
        return { ...state, schedules };
      }
      case actionTypes.SET_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const schedulesActions = {
  pullSchedules: (school: ISchool): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_SCHEDULES,
    payload: { school }
  }),
  setSchedules: (schedules: ISchedule[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_SCHEDULES,
    payload: { schedules }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_SCHEDULES,
    function* pullSchedulesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(schedulesActions.setPhase('loading'));

      const { school } = payload;
      const today = moment().format('YYYY-MM-DD');
      const url = `${SCHEDULES_API_URL}.json?school=${school.id}&scheduleDate=${today}&pagination=false`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(schedulesActions.setPhase('error'));
        return;
      }

      yield put(schedulesActions.setSchedules(response.data));
      yield put(schedulesActions.setPhase('success'));
    }
  );
}
