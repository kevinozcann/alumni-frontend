import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';

import { IAction, TPhase } from 'store/store';
import { ONLINE_CLASSES_API_URL, ONLINE_CLASSES_URL, updateApiUrl } from 'store/ApiUrls';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IOnlineClass } from 'pages/classes/_store/types';
import { IFilter } from 'components/filter/Filter';
import { TLang } from 'utils/shared-types';

interface IOnlineClassState {
  onlineClasses: IOnlineClass[];
  filters?: IFilter[];
  lastUpdated: Date;
  providerClass: any; // this is the class from the provider
  phase: TPhase;
}
type TActionAllState = IOnlineClassState & {
  id?: number;
  lang?: TLang;
  role?: string;
  page?: number;
  onlineClass?: IOnlineClass;
  onlineClassInfo?: Partial<IOnlineClass>;
  school?: Partial<ISchool>;
  season?: ISeason;
};

export const actionTypes = {
  PULL_ONLINE_CLASSES: 'online-classes/PULL_CLASSES',
  SET_ONLINE_CLASSES: 'online-classes/SET_CLASSES',
  UPDATE_ONLINE_CLASSES: 'online-classes/UPDATE_CLASSES',
  ADD_ONLINE_CLASS: 'online-classes/ADD_CLASS',
  UPDATE_ONLINE_CLASS: 'online-classes/UPDATE_CLASS',
  DELETE_ONLINE_CLASS: 'online-classes/DELETE_CLASS',
  SET_FILTERS: 'online-classes/SET_FILTERS',
  GET_PROVIDER_CLASS: 'online-classes/GET_PROVIDER_CLASS',
  CREATE_PROVIDER_CLASS: 'online-classes/CREATE_PROVIDER_CLASS',
  JOIN_PROVIDER_CLASS: 'online-classes/JOIN_PROVIDER_CLASS',
  SET_PROVIDER_CLASS: 'online-classes/SET_PROVIDER_CLASS',
  SET_PHASE: 'online-classes/SET_PHASE'
};

export const initialState: IOnlineClassState = {
  onlineClasses: [],
  filters: [],
  lastUpdated: null,
  providerClass: null,
  phase: null
};

export const onlineClassesDataSelector = createSelector(
  (state: IOnlineClassState) => objectPath.get(state, ['classes', 'online']),
  (onlineClasses: IOnlineClassState) => onlineClasses
);

export const reducer = persistReducer(
  { storage, key: 'online-classes' },
  (
    state: IOnlineClassState = initialState,
    action: IAction<TActionAllState>
  ): IOnlineClassState => {
    switch (action.type) {
      case actionTypes.SET_ONLINE_CLASSES: {
        const { onlineClasses } = action.payload;
        return { ...state, onlineClasses };
      }
      case actionTypes.UPDATE_ONLINE_CLASSES: {
        const { id, onlineClass } = action.payload;
        const currentState = { ...state };
        const newClasses = [...currentState.onlineClasses];

        if (id) {
          const updatedClasses = newClasses.filter((p) => p.id !== id);
          return { ...state, onlineClasses: updatedClasses };
        } else {
          const existingIndex = newClasses.findIndex((p) => p.id === onlineClass.id);

          if (existingIndex > -1) {
            const updatedClass = Object.assign({}, { ...newClasses[existingIndex] }, onlineClass);
            newClasses[existingIndex] = updatedClass;
          } else {
            newClasses.push(onlineClass);
          }
          return { ...state, onlineClasses: newClasses };
        }
      }
      case actionTypes.SET_PROVIDER_CLASS: {
        const { providerClass } = action.payload;
        return { ...state, providerClass };
      }
      case actionTypes.SET_FILTERS: {
        const { filters } = action.payload;
        return { ...state, filters };
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

export const onlineClassesActions = {
  pullOnlineClasss: (
    page: number,
    school: Partial<ISchool>,
    season: ISeason
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_ONLINE_CLASSES,
    payload: { page, school, season }
  }),
  addOnlineClass: (onlineClassInfo: Partial<IOnlineClass>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_ONLINE_CLASS,
    payload: { onlineClassInfo }
  }),
  getProviderClass: (
    lang: TLang,
    role: string,
    onlineClassInfo: IOnlineClass
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.GET_PROVIDER_CLASS,
    payload: { lang, role, onlineClassInfo }
  }),
  updateOnlineClass: (
    id: number,
    onlineClassInfo: Partial<IOnlineClass>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_ONLINE_CLASS,
    payload: { id, onlineClassInfo }
  }),
  deleteOnlineClass: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_ONLINE_CLASS,
    payload: { id }
  }),
  setFilters: (filters: IFilter[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_FILTERS,
    payload: { filters }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  // Pull online classes
  yield takeLatest(
    actionTypes.PULL_ONLINE_CLASSES,
    function* pullOnlineClasssSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(onlineClassesActions.setPhase('loading'));

      const { page, school, season } = payload;
      const url = `${ONLINE_CLASSES_API_URL}.json?page=${page}&school=${school?.id}&season=${season?.id}&order%5BstartsAt%5D=desc`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.SET_ONLINE_CLASSES,
        payload: { onlineClasses: response.data }
      });
      yield put(onlineClassesActions.setPhase('success'));
    }
  );

  // Add online class
  yield takeLatest(
    actionTypes.ADD_ONLINE_CLASS,
    function* addOnlineClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(onlineClassesActions.setPhase('adding'));

      const { onlineClassInfo } = payload;
      const response = yield axios.post(`${ONLINE_CLASSES_API_URL}`, onlineClassInfo);

      if (response.status !== 201) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_ONLINE_CLASSES,
        payload: { onlineClass: response.data }
      });
      yield put(onlineClassesActions.setPhase('success'));
    }
  );

  // Get provider class
  yield takeLatest(
    actionTypes.GET_PROVIDER_CLASS,
    function* getProviderClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      // Reset the provider class
      yield put({
        type: actionTypes.SET_PROVIDER_CLASS,
        payload: { providerClass: null }
      });

      yield put(onlineClassesActions.setPhase('loading'));

      const { lang, role, onlineClassInfo } = payload;
      const onlineClassesUrl = updateApiUrl(ONLINE_CLASSES_URL, { lang });
      const response = yield axios.get(`${onlineClassesUrl}/${onlineClassInfo.id}`);

      if (response.status !== 200) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      const { found } = response.data;

      if (found) {
        yield put({
          type: actionTypes.JOIN_PROVIDER_CLASS,
          payload: { lang, role, onlineClassInfo }
        });
      } else {
        yield put({
          type: actionTypes.CREATE_PROVIDER_CLASS,
          payload: { lang, role, onlineClassInfo }
        });
      }

      yield put(onlineClassesActions.setPhase('success'));
    }
  );

  // Create provider class
  yield takeLatest(
    actionTypes.CREATE_PROVIDER_CLASS,
    function* createProviderClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(onlineClassesActions.setPhase('adding'));

      const { lang, role, onlineClassInfo } = payload;
      const onlineClassesUrl = updateApiUrl(ONLINE_CLASSES_URL, { lang });
      const createResponse = yield axios.post(`${onlineClassesUrl}/${onlineClassInfo.id}/create`);

      if (createResponse.status !== 200) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      const { created } = createResponse.data;
      if (created) {
        yield put({
          type: actionTypes.JOIN_PROVIDER_CLASS,
          payload: { lang, role, onlineClassInfo }
        });
      } else {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      yield put(onlineClassesActions.setPhase('success'));
    }
  );

  // Join provider class
  yield takeLatest(
    actionTypes.JOIN_PROVIDER_CLASS,
    function* joinProviderClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(onlineClassesActions.setPhase('updating'));

      const { lang, role, onlineClassInfo } = payload;
      const onlineClassesUrl = updateApiUrl(ONLINE_CLASSES_URL, { lang });
      const joinResponse = yield axios.post(
        `${onlineClassesUrl}/${onlineClassInfo.id}/join/${role}`
      );

      if (joinResponse.status !== 200) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.SET_PROVIDER_CLASS,
        payload: { providerClass: joinResponse.data }
      });

      yield put(onlineClassesActions.setPhase('success'));
    }
  );

  // Update online class
  yield takeLatest(
    actionTypes.UPDATE_ONLINE_CLASS,
    function* updateOnlineClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(onlineClassesActions.setPhase('updating'));

      const { id, onlineClassInfo } = payload;
      const response = yield axios.patch(`${ONLINE_CLASSES_API_URL}/${id}`, onlineClassInfo);

      if (response.status !== 200) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_ONLINE_CLASSES,
        payload: { onlineClass: response.data }
      });
      yield put(onlineClassesActions.setPhase('success'));
    }
  );

  // Delete online class
  yield takeLatest(
    actionTypes.DELETE_ONLINE_CLASS,
    function* deleteOnlineClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(onlineClassesActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${ONLINE_CLASSES_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(onlineClassesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_ONLINE_CLASSES,
        payload: { id }
      });
      yield put(onlineClassesActions.setPhase('success'));
    }
  );
}
