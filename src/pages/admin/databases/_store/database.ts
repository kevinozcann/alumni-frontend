import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { delay, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';

import { IAction, TPhase } from 'store/store';
import { DATABASES_API_URL } from 'store/ApiUrls';

export interface IDatabase {
  id?: number;
  name: string;
  isCreated?: boolean;
}
export interface IDatabasesState {
  databases?: IDatabase[];
  phase?: string;
}
type TActionAllState = IDatabasesState & {
  databaseInfo?: Partial<IDatabase>;
};
export const databasesActionTypes = {
  PULL_DATABASES: 'databases/PULL_DATABASES',
  SET_DATABASES: 'databases/SET_DATABASES',
  ADD_DATABASE: 'databases/ADD_DATABASE',
  UPDATE_PHASE: 'databases/UPDATE_PHASE'
};

const initialState: IDatabasesState = {
  databases: null,
  phase: null
};

export const databaseDataSelector = createSelector(
  (state: IDatabasesState) => objectPath.get(state, ['database']),
  (data: IDatabasesState) => data
);

export const reducer = persistReducer(
  { storage, key: 'databases', whitelist: ['databases', 'phase'] },
  (state: IDatabasesState = initialState, action: IAction<TActionAllState>): IDatabasesState => {
    switch (action.type) {
      case databasesActionTypes.SET_DATABASES: {
        const { databases } = action.payload;
        return { ...state, databases };
      }
      case databasesActionTypes.UPDATE_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const databasesActions = {
  pullDatabases: (): IAction<Partial<TActionAllState>> => ({
    type: databasesActionTypes.PULL_DATABASES
  }),
  addDatabase: (databaseInfo: Partial<IDatabase>): IAction<Partial<TActionAllState>> => ({
    type: databasesActionTypes.ADD_DATABASE,
    payload: { databaseInfo }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: databasesActionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  // Pull databases
  yield takeLatest(databasesActionTypes.PULL_DATABASES, function* databasesPullSaga() {
    yield put(databasesActions.setPhase('loading'));

    const response = yield axios.get(`${DATABASES_API_URL}.json`);

    if (response.status !== 200) {
      yield put(databasesActions.setPhase('error'));
      return;
    }

    yield put({
      type: databasesActionTypes.SET_DATABASES,
      payload: { databases: response.data }
    });
    yield put(databasesActions.setPhase('success'));

    // If there is a create progress then keep pulling
    const databases: IDatabase[] = response.data;
    const inProgress: boolean = databases?.some((db) => !db.isCreated);

    if (inProgress) {
      yield delay(3000);
      yield put({
        type: databasesActionTypes.PULL_DATABASES
      });
    }
  });

  // Add database
  yield takeLatest(
    databasesActionTypes.ADD_DATABASE,
    function* addSeasonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(databasesActions.setPhase('adding'));

      const { databaseInfo } = payload;
      const response = yield axios.post(`${DATABASES_API_URL}`, databaseInfo);

      if (response.status !== 201) {
        yield put(databasesActions.setPhase('error'));
        return;
      }

      yield put({
        type: databasesActionTypes.PULL_DATABASES
      });
      yield put(databasesActions.setPhase('success'));
    }
  );
}
