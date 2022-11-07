import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';
import { DASHBOARD_HELPDESK_INCIDENTS_URL, updateApiUrl } from '../../../store/ApiUrls';

export const helpdeskIncidentsPhases = {
  PULLING: 'PULLING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

export const hdIncidentsActionTypes = {
  PULL_INCIDENTS: 'PULL_HELPDESK_INCIDENTS',
  SET_INCIDENTS: 'SET_HELPDESK_INCIDENTS',
  SET_PHASE: 'SET_HELPDESK_INCIDENTS_PHASE'
};

const initialState = {
  incidents: null,
  phase: null,
  error: null
};

export const helpdeskIncidentsSelector = createSelector(
  (state) => objectPath.get(state.dashboard.helpdeskIncidents),
  (helpdeskIncidents) => helpdeskIncidents
);

export const reducer = persistReducer(
  {
    storage,
    key: 'helpdeskIncidents',
    whitelist: ['dashboard', 'incidents', 'phase', 'error']
  },
  (state = initialState, action) => {
    switch (action.type) {
      case hdIncidentsActionTypes.PULL_INCIDENTS: {
        return { ...state, error: null };
      }
      case hdIncidentsActionTypes.SET_INCIDENTS: {
        const { incidents } = action.payload;
        return { ...state, incidents };
      }
      case hdIncidentsActionTypes.SET_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }

      default:
        return state;
    }
  }
);

export const helpdeskIncidentsActions = {
  pullHelpdeskIncidents: (lang) => ({
    type: hdIncidentsActionTypes.PULL_INCIDENTS,
    payload: { lang }
  }),
  setHelpdeskIncidents: (incidents) => ({
    type: hdIncidentsActionTypes.SET_INCIDENTS,
    payload: { incidents }
  }),
  setHelpdeskIncidentsPhase: (phase, error) => ({
    type: hdIncidentsActionTypes.SET_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(hdIncidentsActionTypes.PULL_INCIDENTS, function* dashboardSaga({ payload }) {
    yield put(
      helpdeskIncidentsActions.setHelpdeskIncidentsPhase(helpdeskIncidentsPhases.PULLING, null)
    );

    const { lang } = payload;
    const dashboardHelpdeskIncidentsUrl = updateApiUrl(DASHBOARD_HELPDESK_INCIDENTS_URL, {
      lang: lang
    });
    const { data: incidents } = yield axios.get(dashboardHelpdeskIncidentsUrl);

    if (typeof incidents === 'undefined') {
      yield put(
        helpdeskIncidentsActions.setHelpdeskIncidentsPhase(null, helpdeskIncidentsPhases.ERROR)
      );
      return;
    }

    yield put(helpdeskIncidentsActions.setHelpdeskIncidents(incidents));

    yield put(
      helpdeskIncidentsActions.setHelpdeskIncidentsPhase(helpdeskIncidentsPhases.SUCCESS, null)
    );
  });
}
