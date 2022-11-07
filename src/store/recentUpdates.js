import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';
import { GLOBAL_UPDATES_URL } from './ApiUrls';

export const recentUpdatesPhases = {
  PULLING: 'PULLING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

export const recentUpdatesActionTypes = {
  PULL_RECENT_UPDATES: 'PULL_RECENT_UPDATES',
  SET_RECENT_UPDATES: 'SET_RECENT_UPDATES',
  SET_PHASE: 'SET_RECENT_UPDATES_PHASE'
};

const initialState = {
  updates: null,
  phase: null,
  error: null
};

export const recentUpdatesSelector = createSelector(
  (state) => objectPath.get(state.recentUpdates),
  (recentUpdates) => recentUpdates
);

export const reducer = persistReducer(
  {
    storage,
    key: 'recentUpdates',
    whitelist: ['dashboard', 'updates', 'phase', 'error']
  },
  (state = initialState, action) => {
    switch (action.type) {
      case recentUpdatesActionTypes.PULL_RECENT_UPDATES: {
        return { ...state, error: null };
      }
      case recentUpdatesActionTypes.SET_RECENT_UPDATES: {
        const { updates } = action.payload;
        return { ...state, updates };
      }
      case recentUpdatesActionTypes.SET_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }

      default:
        return state;
    }
  }
);

export const recentUpdatesActions = {
  pullRecentUpdates: (lang) => ({
    type: recentUpdatesActionTypes.PULL_RECENT_UPDATES,
    payload: { lang }
  }),
  setRecentUpdates: (updates) => ({
    type: recentUpdatesActionTypes.SET_RECENT_UPDATES,
    payload: { updates }
  }),
  setRecentUpdatesPhase: (phase, error) => ({
    type: recentUpdatesActionTypes.SET_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(recentUpdatesActionTypes.PULL_RECENT_UPDATES, function* dashboardSaga() {
    yield put(recentUpdatesActions.setRecentUpdatesPhase(recentUpdatesPhases.PULLING, null));

    const { data: updates } = yield axios.get(`${GLOBAL_UPDATES_URL}.json?isActive=true`);

    if (typeof updates === 'undefined') {
      yield put(recentUpdatesActions.setRecentUpdatesPhase(null, recentUpdatesPhases.ERROR));
      return;
    }

    yield put(recentUpdatesActions.setRecentUpdates(updates));

    yield put(recentUpdatesActions.setRecentUpdatesPhase(recentUpdatesPhases.SUCCESS, null));
  });
}
