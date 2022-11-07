import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import produce from 'immer';

import { IAction } from '../../../../store/store';
import { USERS_TYPES_API_URL } from '../../../../store/ApiUrls';

export type TPhase = null | 'loading' | 'adding' | 'updating' | 'deleting' | 'error' | 'success';

interface IUserType {
  id: number;
  isActive: string;
  isEditable: string;
  loginType: string;
  userType: string;
  typeOrder: number;
}

interface IUserTypesState {
  userTypes: IUserType[];
  phase: TPhase;
}

type TActionAllState = IUserTypesState & {
  id: number;
  userType: IUserType;
  userTypeInfo: Partial<IUserType>;
};

export const actionTypes = {
  PULL_USER_TYPES: 'users/PULL_USER_TYPES',
  SET_USER_TYPES: 'users/SET_USER_TYPES',
  ADD_USER_TYPE: 'users/ADD_USER_TYPE',
  UPDATE_USER_TYPE: 'users/UPDATE_USER_TYPE',
  DELETE_USER_TYPE: 'users/DELETE_USER_TYPE',
  REMOVE_USER_TYPE: 'users/REMOVE_USER_TYPE',
  SET_USER_TYPE: 'users/SET_USER_TYPE',
  SET_PHASE: 'users/SET_PHASE'
};

export const initialState: IUserTypesState = {
  userTypes: [],
  phase: null
};

export const userTypesSelector = createSelector(
  (state: IUserTypesState) => objectPath.get(state, ['users', 'userTypes']),
  (userTypes: IUserType[]) => userTypes
);
export const userTypesPhaseSelector = createSelector(
  (state: IUserTypesState) => objectPath.get(state, ['users', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'users' },
  (state: IUserTypesState = initialState, action: IAction<TActionAllState>): IUserTypesState => {
    switch (action.type) {
      case actionTypes.SET_USER_TYPES: {
        const { userTypes } = action.payload;
        return { ...state, userTypes };
      }
      case actionTypes.SET_USER_TYPE: {
        const { userType } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.userTypes.findIndex((d) => d.id === userType.id);
          if (index > -1) {
            draftState.userTypes[index] = userType;
          } else {
            draftState.userTypes.unshift(userType);
          }
        });
      }
      case actionTypes.REMOVE_USER_TYPE: {
        const { id } = action.payload;
        const userTypes = { ...state }.userTypes.filter((d) => d.id !== id);
        return { ...state, userTypes };
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

export const userTypesActions = {
  pullUserTypes: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_USER_TYPES
  }),
  setUserTypes: (userTypes: IUserType[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_TYPES,
    payload: { userTypes }
  }),
  addUserType: (userTypeInfo: Partial<IUserType>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_USER_TYPE,
    payload: { userTypeInfo }
  }),
  updateUserType: (userTypeInfo: Partial<IUserType>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_TYPE,
    payload: { userTypeInfo }
  }),
  deleteUserType: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_USER_TYPE,
    payload: { id }
  }),
  removeUserType: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_USER_TYPE,
    payload: { id }
  }),
  setUserType: (userType: IUserType): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_TYPE,
    payload: { userType }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.PULL_USER_TYPES, function* pullUserTypesSaga() {
    yield put(userTypesActions.setPhase('loading'));

    const url = `${USERS_TYPES_API_URL}.json?pagination=false&order%5BtypeOrder%5D=asc`;
    const response = yield axios.get(url);

    if (response.status !== 200) {
      yield put(userTypesActions.setPhase('error'));
      return;
    }

    yield put(userTypesActions.setUserTypes(response.data));
    yield put(userTypesActions.setPhase('success'));
  });

  yield takeLatest(
    actionTypes.ADD_USER_TYPE,
    function* addUserTypeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(userTypesActions.setPhase('adding'));

      const { userTypeInfo } = payload;
      const response = yield axios.post(`${USERS_TYPES_API_URL}`, {
        id: userTypeInfo.id,
        isActive: !userTypeInfo.isActive ? '0' : '1',
        loginType: userTypeInfo.loginType,
        userType: userTypeInfo.userType,
        typeOrder: userTypeInfo.typeOrder
      });

      if (response.status !== 200) {
        yield put(userTypesActions.setPhase('error'));
        return;
      }

      yield put(userTypesActions.setUserType(response.data));
      yield put(userTypesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_TYPE,
    function* updateUserTypeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(userTypesActions.setPhase('updating'));

      const { userTypeInfo } = payload;
      const response = yield axios.patch(`${USERS_TYPES_API_URL}/${userTypeInfo.id}`, userTypeInfo);

      if (response.status !== 200) {
        yield put(userTypesActions.setPhase('error'));
        return;
      }

      yield put(userTypesActions.setUserType(response.data));
      yield put(userTypesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.DELETE_USER_TYPE,
    function* deleteUserTypeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(userTypesActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${USERS_TYPES_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(userTypesActions.setPhase('error'));
        return;
      }

      yield put(userTypesActions.removeUserType(id));
      yield put(userTypesActions.setPhase('success'));
    }
  );
}
