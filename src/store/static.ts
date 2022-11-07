import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { createSelector } from 'reselect';
import { put, takeLatest } from '@redux-saga/core/effects';
import axios from 'axios';

import { IAction } from './store';
import { ICity, ICountry, IState, TLang } from 'utils/shared-types';
import { GLOBAL_CITIES_URL, GLOBAL_COUNTRIES_URL, GLOBAL_STATES_URL } from './ApiUrls';

type TPhase = null | 'loading' | 'adding' | 'updating' | 'deleting' | 'error' | 'success';
interface IStaticState {
  countries: ICountry[];
  states: IState[];
  cities: ICity[];
  phase: TPhase;
}
interface IParentStaticState {
  static: IStaticState;
}
type TActionAllState = IStaticState & {
  lang?: TLang;
  countryId?: string;
  stateId?: number;
};

export const actionTypes = {
  PULL_COUNTRIES: 'static/PULL_COUNTRIES',
  SET_COUNTRIES: 'static/SET_COUNTRIES',
  PULL_STATES: 'static/PULL_STATES',
  SET_STATES: 'static/SET_STATES',
  PULL_CITIES: 'static/PULL_CITIES',
  SET_CITIES: 'static/SET_CITIES',
  SET_PHASE: 'static/SET_PHASE'
};

export const initialState = {
  countries: [],
  states: [],
  cities: [],
  phase: null
};

export const countriesSelector = createSelector(
  (state: IParentStaticState) => objectPath.get(state, ['static', 'countries']),
  (countries: ICountry[]) => countries
);
export const statesSelector = createSelector(
  (state: IParentStaticState) => objectPath.get(state, ['static', 'states']),
  (states: IState[]) => states
);
export const citiesSelector = createSelector(
  (state: IParentStaticState) => objectPath.get(state, ['static', 'cities']),
  (cities: ICity[]) => cities
);
export const staticPhaseSelector = createSelector(
  (state: IParentStaticState) => objectPath.get(state, ['static', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'static' },
  (state: IStaticState = initialState, action: IAction<TActionAllState>): IStaticState => {
    switch (action.type) {
      case actionTypes.SET_COUNTRIES: {
        const { countries } = action.payload;
        return { ...state, countries };
      }
      case actionTypes.SET_STATES: {
        const { states } = action.payload;
        return { ...state, states };
      }
      case actionTypes.SET_CITIES: {
        const { cities } = action.payload;
        return { ...state, cities };
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

export const staticActions = {
  pullCountries: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_COUNTRIES
  }),
  pullStates: (countryId?: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_STATES,
    payload: { countryId }
  }),
  pullCities: (stateId: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_CITIES,
    payload: { stateId }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  /**
   * Pull the list of countries
   */
  yield takeLatest(actionTypes.PULL_COUNTRIES, function* pullCountriesSaga() {
    yield put(staticActions.setPhase('loading'));

    const response = yield axios.get(
      `${GLOBAL_COUNTRIES_URL}.json?pagination=false&isPublished=true&order%5Bcountry%5D=asc`
    );

    if (response.status !== 200) {
      yield put(staticActions.setPhase('error'));
      return;
    }
    // Update the store with the countries
    yield put({
      type: actionTypes.SET_COUNTRIES,
      payload: { countries: response.data }
    });
    yield put(staticActions.setPhase('success'));
  });

  /**
   * Pull the list of states for a given country
   */
  yield takeLatest(
    actionTypes.PULL_STATES,
    function* pullStatesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(staticActions.setPhase('loading'));

      const { countryId } = payload;
      const response = yield axios.get(
        `${GLOBAL_STATES_URL}.json?pagination=false&country=${countryId}&order%5Bname%5D=asc`
      );

      if (response.status !== 200) {
        yield put(staticActions.setPhase('error'));
        return;
      }

      // Update the store for states
      yield put({
        type: actionTypes.SET_STATES,
        payload: { states: response.data }
      });
      yield put(staticActions.setPhase('success'));
    }
  );

  /**
   * Pull the list of cities for a given state
   */
  yield takeLatest(
    actionTypes.PULL_CITIES,
    function* pullCitiesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(staticActions.setPhase('loading'));

      const { stateId } = payload;
      const response = yield axios.get(
        `${GLOBAL_CITIES_URL}.json?pagination=false&state%5B%5D=%2Fstates%2F${stateId}`
      );

      if (response.status !== 200) {
        yield put(staticActions.setPhase('error'));
        return;
      }

      // Update the store for cities
      yield put({
        type: actionTypes.SET_CITIES,
        payload: { cities: response.data }
      });
      yield put(staticActions.setPhase('success'));
    }
  );
}
