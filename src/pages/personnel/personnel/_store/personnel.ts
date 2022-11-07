import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';

import { IAction, TPhase } from 'store/store';
import { PERSONNEL_API_URL } from 'store/ApiUrls';
import { ISchool } from 'pages/organization/organization-types';
import { IPerson } from 'pages/personnel/_store/types';

interface IPersonnelData {
  personnel: IPerson[];
  lastUpdated: Date;
  phase: TPhase;
}
type TActionAllState = IPersonnelData & {
  id: number;
  person: IPerson;
  school: Partial<ISchool>;
  personInfo: Partial<IPerson>;
};

export const actionTypes = {
  PULL_PERSONNEL: 'personnel/PULL_PERSONNEL',
  SET_PERSONNEL: 'personnel/SET_PERSONNEL',
  UPDATE_PERSONNEL: 'personnel/UPDATE_PERSONNEL',
  ADD_PERSON: 'personnel/ADD_PERSON',
  UPDATE_PERSON: 'personnel/UPDATE_PERSON',
  DELETE_PERSON: 'personnel/DELETE_PERSON',
  SET_PHASE: 'personnel/SET_PHASE'
};

export const initialState: IPersonnelData = {
  personnel: [],
  lastUpdated: null,
  phase: null
};

export const personnelDataSelector = createSelector(
  (state: IPersonnelData) => objectPath.get(state, ['personnel', 'personnel']),
  (personnel: IPersonnelData) => personnel
);

export const reducer = persistReducer(
  { storage, key: 'personnel' },
  (state: IPersonnelData = initialState, action: IAction<TActionAllState>): IPersonnelData => {
    switch (action.type) {
      case actionTypes.SET_PERSONNEL: {
        const { personnel } = action.payload;
        return { ...state, personnel };
      }
      case actionTypes.UPDATE_PERSONNEL: {
        const { id, person } = action.payload;
        const currentState = { ...state };
        const newPersonnel = [...currentState.personnel];

        if (id) {
          const updatedPersonnel = newPersonnel.filter((p) => p.id !== id);
          return { ...state, personnel: updatedPersonnel };
        } else {
          const existingIndex = newPersonnel.findIndex((p) => p.id === person.id);

          if (existingIndex > -1) {
            const updatedPerson = Object.assign({}, { ...newPersonnel[existingIndex] }, person);
            newPersonnel[existingIndex] = updatedPerson;
          } else {
            newPersonnel.push(person);
          }
          return { ...state, personnel: newPersonnel };
        }
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

export const personnelActions = {
  pullPersonnel: (school: Partial<ISchool>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_PERSONNEL,
    payload: { school }
  }),
  addPerson: (personInfo: Partial<IPerson>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_PERSON,
    payload: { personInfo }
  }),
  updatePerson: (id: number, personInfo: Partial<IPerson>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_PERSON,
    payload: { id, personInfo }
  }),
  deletePerson: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_PERSON,
    payload: { id }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  // Pull personnel
  yield takeLatest(
    actionTypes.PULL_PERSONNEL,
    function* pullPersonnelSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personnelActions.setPhase('loading'));

      const { school } = payload;
      const response = yield axios.get(`${PERSONNEL_API_URL}.json?school=${school.id}`);

      if (response.status !== 200) {
        yield put(personnelActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.SET_PERSONNEL,
        payload: { personnel: response.data }
      });
      yield put(personnelActions.setPhase('success'));
    }
  );

  // Add person
  yield takeLatest(
    actionTypes.ADD_PERSON,
    function* addPersonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personnelActions.setPhase('adding'));

      const { personInfo } = payload;
      const response = yield axios.post(PERSONNEL_API_URL, personInfo);

      if (response.status !== 201) {
        yield put(personnelActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_PERSONNEL,
        payload: { person: response.data }
      });
      yield put(personnelActions.setPhase('success'));
    }
  );

  // Update person
  yield takeLatest(
    actionTypes.UPDATE_PERSON,
    function* updatePersonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personnelActions.setPhase('updating'));

      const { id, personInfo } = payload;
      const response = yield axios.patch(`${PERSONNEL_API_URL}/${id}`, personInfo);

      if (response.status !== 200) {
        yield put(personnelActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_PERSONNEL,
        payload: { person: response.data }
      });
      yield put(personnelActions.setPhase('success'));
    }
  );

  // Delete person
  yield takeLatest(
    actionTypes.DELETE_PERSON,
    function* deletePersonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personnelActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${PERSONNEL_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(personnelActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_PERSONNEL,
        payload: { id }
      });
      yield put(personnelActions.setPhase('success'));
    }
  );
}
