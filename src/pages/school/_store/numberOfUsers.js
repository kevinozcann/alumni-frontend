import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';
import { DASHBOARD_NOF_USERS_URL } from '../../../store/ApiUrls';

export const phases = {
  DASHBOARD_PULL_PHASE: 'DASHBOARD_PULL_PHASE',
  DASHBOARD_SUCCESS_PHASE: 'DASHBOARD_SUCCESS_PHASE',
  DASHBOARD_ERROR_PHASE: 'DASHBOARD_ERROR_PHASE'
};

export const actionTypes = {
  PULL_NUMBER_OF_USERS: 'PULL_NUMBER_OF_USERS',
  SET_NUMBER_OF_USERS: 'SET_NUMBER_OF_USERS',
  SET_DASHBOARD_PHASE: 'SET_DASHBOARD_PHASE'
};

const initialState = {
  nofUsers: null,
  phase: null,
  error: null
};

export const nofUsersSelector = createSelector(
  (state) => objectPath.get(state.dashboard.nofUsers),
  (nofUsers) => nofUsers
);

export const phaseSelector = createSelector(
  (state) => objectPath.get(state.dashboard.phase),
  (phase) => phase
);

export const errorSelector = createSelector(
  (state) => objectPath.get(state.dashboard.error),
  (error) => error
);

export const reducer = persistReducer(
  { storage, key: 'dashboard', whitelist: ['dashboard', 'nofUsers', 'phase', 'error'] },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.PULL_NUMBER_OF_USERS: {
        return { ...state, error: null };
      }
      case actionTypes.SET_NUMBER_OF_USERS: {
        const { nofUsersData } = action.payload;
        return { ...state, nofUsers: nofUsersData };
      }
      case actionTypes.SET_DASHBOARD_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase: phase, error: error };
      }
      default:
        return state;
    }
  }
);

export const actions = {
  pullNumberOfUsers: () => ({ type: actionTypes.PULL_NUMBER_OF_USERS, payload: {} }),
  setNumberOfUsers: (nofUsersData) => ({
    type: actionTypes.SET_NUMBER_OF_USERS,
    payload: { nofUsersData }
  }),
  setPhase: (phase, error) => ({
    type: actionTypes.SET_DASHBOARD_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.PULL_NUMBER_OF_USERS, function* dashboardSaga() {
    yield put(actions.setPhase(phases.DASHBOARD_PULL_PHASE, null));

    const {
      data: { message, nofUsersData }
    } = yield axios.get(DASHBOARD_NOF_USERS_URL);

    if (typeof message.success === 'undefined') {
      yield put(actions.setPhase(phases.DASHBOARD_ERROR_PHASE, message));

      return;
    }

    yield put(actions.setNumberOfUsers(nofUsersData));

    yield put(actions.setPhase(phases.DASHBOARD_SUCCESS_PHASE, null));
  });
}
