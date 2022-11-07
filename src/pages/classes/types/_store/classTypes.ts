import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import produce from 'immer';

import { IAction, TPhase } from 'store/store';
import { CLASS_TYPES_API_URL } from 'store/ApiUrls';

export interface IClassType {
  id: number;
  title: string;
  bgcolor: string;
}
interface IClassTypeState {
  classTypes: IClassType[];
  phase: TPhase;
}
type TActionAllState = IClassTypeState & {
  id: number;
  classType: IClassType;
  classTypeInfo: Partial<IClassType>;
};

export const actionTypes = {
  PULL_ClASS_TYPES: 'class-types/PULL_ClASS_TYPES',
  SET_CLASS_TYPES: 'class-types/SET_CLASS_TYPES',
  ADD_CLASS_TYPE: 'class-types/ADD_CLASS_TYPE',
  UPDATE_CLASS_TYPE: 'class-types/UPDATE_CLASS_TYPE',
  SET_CLASS_TYPE: 'class-types/SET_CLASS_TYPE',
  SET_PHASE: 'class-types/SET_PHASE'
};

export const initialState: IClassTypeState = {
  classTypes: [],
  phase: null
};

export const classTypesSelector = createSelector(
  (state: IClassTypeState) => objectPath.get(state, ['classes', 'types', 'classTypes']),
  (classTypes: IClassType[]) => classTypes
);
export const classTypesPhaseSelector = createSelector(
  (state: IClassTypeState) => objectPath.get(state, ['classes', 'types', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'class-types' },
  (state: IClassTypeState = initialState, action: IAction<TActionAllState>): IClassTypeState => {
    switch (action.type) {
      case actionTypes.SET_CLASS_TYPES: {
        const { classTypes } = action.payload;
        return { ...state, classTypes };
      }
      case actionTypes.SET_CLASS_TYPE: {
        const { classType } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.classTypes.findIndex((d) => d.id === classType.id);
          if (index > -1) {
            draftState.classTypes[index] = classType;
          } else {
            draftState.classTypes.unshift(classType);
          }
        });
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

export const classTypesActions = {
  pullClassTypes: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_ClASS_TYPES
  }),
  setClassTypes: (classTypes: IClassType[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_CLASS_TYPES,
    payload: { classTypes }
  }),
  addClassType: (classTypeInfo: Partial<IClassType>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_CLASS_TYPE,
    payload: { classTypeInfo }
  }),
  updateClassType: (classTypeInfo: Partial<IClassType>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_CLASS_TYPE,
    payload: { classTypeInfo }
  }),
  setClassType: (classType: IClassType): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_CLASS_TYPE,
    payload: { classType }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.PULL_ClASS_TYPES, function* pullClassTypesSaga() {
    yield put(classTypesActions.setPhase('loading'));

    const url = `${CLASS_TYPES_API_URL}.json`;
    const response = yield axios.get(url);

    if (response.status !== 200) {
      yield put(classTypesActions.setPhase('error'));
      return;
    }

    yield put(classTypesActions.setClassTypes(response.data));
    yield put(classTypesActions.setPhase('success'));
  });

  yield takeLatest(
    actionTypes.ADD_CLASS_TYPE,
    function* addClassTypeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(classTypesActions.setPhase('adding'));

      const { classTypeInfo } = payload;
      const response = yield axios.post(`${CLASS_TYPES_API_URL}`, {
        id: classTypeInfo.id,
        title: classTypeInfo.title,
        bgcolor: classTypeInfo.bgcolor
      });

      if (response.status !== 200) {
        yield put(classTypesActions.setPhase('error'));
        return;
      }

      yield put(classTypesActions.setClassType(response.data));
      yield put(classTypesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_CLASS_TYPE,
    function* updateStudentTagSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(classTypesActions.setPhase('updating'));

      const { classTypeInfo } = payload;
      const response = yield axios.patch(
        `${CLASS_TYPES_API_URL}/${classTypeInfo.id}`,
        classTypeInfo
      );

      if (response.status !== 200) {
        yield put(classTypesActions.setPhase('error'));
        return;
      }

      yield put(classTypesActions.setClassType(response.data));
      yield put(classTypesActions.setPhase('success'));
    }
  );
}
