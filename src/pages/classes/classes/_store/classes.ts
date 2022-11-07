import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';

import { IAction, TPhase } from 'store/store';
import { CLASSES_API_URL } from 'store/ApiUrls';
import { ISchool } from 'pages/organization/organization-types';
import { IClass } from 'pages/classes/_store/types';

interface IClassesData {
  classes: IClass[];
  lastUpdated: Date;
  phase: TPhase;
}
type TActionAllState = IClassesData & {
  id: number;
  classs: IClass;
  school: Partial<ISchool>;
  classInfo: Partial<IClass>;
};

export const actionTypes = {
  PULL_CLASSES: 'classes/PULL_CLASSES',
  SET_CLASSES: 'classes/SET_CLASSES',
  UPDATE_CLASSES: 'classes/UPDATE_CLASSES',
  ADD_CLASS: 'classes/ADD_CLASS',
  UPDATE_CLASS: 'classes/UPDATE_CLASS',
  DELETE_CLASS: 'classes/DELETE_CLASS',
  SET_PHASE: 'classes/SET_PHASE'
};

export const initialState: IClassesData = {
  classes: [],
  lastUpdated: null,
  phase: null
};

export const classesDataSelector = createSelector(
  (state: IClassesData) => objectPath.get(state, ['classes', 'classes']),
  (classes: IClassesData) => classes
);

export const reducer = persistReducer(
  { storage, key: 'classes' },
  (state: IClassesData = initialState, action: IAction<TActionAllState>): IClassesData => {
    switch (action.type) {
      case actionTypes.SET_CLASSES: {
        const { classes } = action.payload;
        return { ...state, classes };
      }
      case actionTypes.UPDATE_CLASSES: {
        const { id, classs } = action.payload;
        const currentState = { ...state };
        const newClasses = [...currentState.classes];

        if (id) {
          const updatedClasses = newClasses.filter((p) => p.id !== id);
          return { ...state, classes: updatedClasses };
        } else {
          const existingIndex = newClasses.findIndex((p) => p.id === classs.id);

          if (existingIndex > -1) {
            const updatedClass = Object.assign({}, { ...newClasses[existingIndex] }, classs);
            newClasses[existingIndex] = updatedClass;
          } else {
            newClasses.push(classs);
          }
          return { ...state, classes: newClasses };
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

export const classesActions = {
  pullClasses: (school: Partial<ISchool>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_CLASSES,
    payload: { school }
  }),
  addClass: (classInfo: Partial<IClass>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_CLASS,
    payload: { classInfo }
  }),
  updateClass: (id: number, classInfo: Partial<IClass>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_CLASS,
    payload: { id, classInfo }
  }),
  deleteClass: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_CLASS,
    payload: { id }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  // Pull classes
  yield takeLatest(
    actionTypes.PULL_CLASSES,
    function* pullClassesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(classesActions.setPhase('loading'));

      const { school } = payload;
      const response = yield axios.get(`${CLASSES_API_URL}.json?school=${school.id}`);

      if (response.status !== 200) {
        yield put(classesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.SET_CLASSES,
        payload: { classes: response.data }
      });
      yield put(classesActions.setPhase('success'));
    }
  );

  // Add class
  yield takeLatest(
    actionTypes.ADD_CLASS,
    function* addClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(classesActions.setPhase('adding'));

      const { classInfo } = payload;
      const response = yield axios.post(CLASSES_API_URL, classInfo);

      if (response.status !== 201) {
        yield put(classesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_CLASSES,
        payload: { classs: response.data }
      });
      yield put(classesActions.setPhase('success'));
    }
  );

  // Update class
  yield takeLatest(
    actionTypes.UPDATE_CLASS,
    function* updateClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(classesActions.setPhase('updating'));

      const { id, classInfo } = payload;
      const response = yield axios.patch(`${CLASSES_API_URL}/${id}`, classInfo);

      if (response.status !== 200) {
        yield put(classesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_CLASSES,
        payload: { classs: response.data }
      });
      yield put(classesActions.setPhase('success'));
    }
  );

  // Delete class
  yield takeLatest(
    actionTypes.DELETE_CLASS,
    function* deleteClassSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(classesActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${CLASSES_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(classesActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.UPDATE_CLASSES,
        payload: { id }
      });
      yield put(classesActions.setPhase('success'));
    }
  );
}
