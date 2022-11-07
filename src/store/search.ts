import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import axios from 'axios';
import { persistReducer } from 'redux-persist';
import { put, takeLatest, throttle } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import { IAction } from './store';
import { SEARCH_URL, updateApiUrl } from './ApiUrls';
import { TLang } from '../utils/shared-types';
import { IUser } from '../pages/account/account-types';
import { IFlatMenu } from '../pages/admin/menus/menu-types';

interface IStudent {
  name: string;
  lastname: string;
  fullName: string;
}
interface IPersonnel {
  name: string;
  lastname: string;
  fullName: string;
}
interface ISearchState {
  users: IUser[];
  menus: IFlatMenu[];
  students: IStudent[];
  personnel: IPersonnel[];
  searchKey: string;
  phase: string;
}
interface IParentSearchState {
  search: ISearchState;
}
type TActionAllState = ISearchState & {
  lang?: TLang;
  userId?: string;
  flatMenus?: IFlatMenu[];
  userTypes?: string;
  getKey?: boolean;
};

export const searchActionPhases = {
  USERS_SEARCHING: 'users-searching',
  USERS_SEARCHING_ERROR: 'users-searching-error',
  USERS_SEARCHING_SUCCESSFUL: 'users-searching-successful',
  MENUS_SEARCHING: 'menus-searching',
  MENUS_SEARCHING_ERROR: 'menus-searching-error',
  MENUS_SEARCHING_SUCCESSFUL: 'menus-searching-successful',
  STUDENTS_SEARCHING: 'students-searching',
  STUDENTS_SEARCHING_ERROR: 'students-searching-error',
  STUDENTS_SEARCHING_SUCCESSFUL: 'students-searching-successful'
};
export const searchActionTypes = {
  SEARCH_USERS: 'search/SEARCH_USERS',
  SET_USERS: 'search/SET_USERS',
  UPDATE_USERS: 'search/UPDATE_USERS_IN_STORE',
  SEARCH_MENUS: 'search/SEARCH_MENUS',
  SET_MENUS: 'search/SET_MENUS',
  UPDATE_MENUS: 'search/UPDATE_MENUS_IN_STORE',
  SEARCH_STUDENTS: 'search/SEARCH_STUDENTS',
  SET_STUDENTS: 'search/SET_STUDENTS',
  UPDATE_STUDENTS: 'search/UPDATE_STUDENTS_IN_STORE',
  SEARCH_PERSONNEL: 'search/SEARCH_PERSONNEL',
  SET_PERSONNEL: 'search/SET_PERSONNEL',
  UPDATE_PERSONNEL: 'search/UPDATE_PERSONNEL_IN_STORE',
  UPDATE_PHASE: 'search/UPDATE_PHASE'
};
export const initialState = {
  users: [],
  menus: [],
  students: [],
  personnel: [],
  searchKey: '',
  phase: null
};

export const searchUsersSelector = createSelector(
  (state: IParentSearchState) => objectPath.get(state, ['search', 'users']),
  (users: IUser[]) => users
);
export const searchMenusSelector = createSelector(
  (state: IParentSearchState) => objectPath.get(state, ['search', 'menus']),
  (menus: IFlatMenu[]) => menus
);
export const searchStudentsSelector = createSelector(
  (state: IParentSearchState) => objectPath.get(state, ['search', 'students']),
  (students: IStudent[]) => students
);
export const searchPersonnelSelector = createSelector(
  (state: IParentSearchState) => objectPath.get(state, ['search', 'personnel']),
  (personnel: IPersonnel[]) => personnel
);
export const searchKeySelector = createSelector(
  (state: IParentSearchState) => objectPath.get(state, ['search', 'searchKey']),
  (searchKey: string) => searchKey
);
export const searchPhaseSelector = createSelector(
  (state: IParentSearchState) => objectPath.get(state, ['search', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  {
    storage,
    key: 'search',
    whitelist: ['users', 'menus', 'students', 'personnel', 'searchKey', 'phase']
  },
  (state: ISearchState = initialState, action: IAction<TActionAllState>): ISearchState => {
    switch (action.type) {
      case searchActionTypes.UPDATE_USERS: {
        const { users } = action.payload;
        return { ...state, users };
      }
      case searchActionTypes.UPDATE_MENUS: {
        const { menus, searchKey } = action.payload;
        return { ...state, menus, searchKey };
      }
      case searchActionTypes.UPDATE_STUDENTS: {
        const { students } = action.payload;
        return { ...state, students };
      }
      case searchActionTypes.UPDATE_PERSONNEL: {
        const { personnel } = action.payload;
        return { ...state, personnel };
      }
      case searchActionTypes.UPDATE_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const searchActions = {
  searchUsers: (
    lang: TLang,
    userId: string,
    searchKey: string,
    userTypes?: string,
    getKey?: boolean
  ): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SEARCH_USERS,
    payload: { lang, userId, searchKey, userTypes, getKey }
  }),
  setUsers: (payload: any): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SET_USERS,
    payload: payload
  }),
  searchMenus: (flatMenus: IFlatMenu[], searchKey: string): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SEARCH_MENUS,
    payload: { flatMenus, searchKey }
  }),
  setMenus: (payload: any): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SET_MENUS,
    payload: payload
  }),
  searchStudents: (
    lang: TLang,
    userId: string,
    searchKey: string
  ): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SEARCH_STUDENTS,
    payload: { lang, userId, searchKey }
  }),
  setStudents: (payload: any): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SET_STUDENTS,
    payload: payload
  }),
  searchPersonnel: (
    lang: TLang,
    userId: string,
    searchKey: string
  ): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.SEARCH_PERSONNEL,
    payload: { lang, userId, searchKey }
  }),
  setPhase: (phase: string): IAction<Partial<TActionAllState>> => ({
    type: searchActionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield throttle(
    1500,
    searchActionTypes.SEARCH_USERS,
    function* searchUsersSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(searchActions.setUsers(payload));
    }
  );

  yield takeLatest(
    searchActionTypes.SET_USERS,
    function* setUsersSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put({
        type: searchActionTypes.UPDATE_PHASE,
        payload: { phase: searchActionPhases.USERS_SEARCHING }
      });

      const { lang, userId, searchKey, userTypes, getKey } = payload;
      let searchUrl = updateApiUrl(SEARCH_URL, {
        lang: lang,
        userId: userId,
        context: 'users'
      });
      searchUrl = `${searchUrl}/${searchKey}`;
      if (userTypes) {
        searchUrl = `${searchUrl}?userTypes=${userTypes}`;
      }
      if (getKey) {
        searchUrl = `${searchUrl}&getKey=1`;
      }
      const response = yield axios.get(searchUrl);

      if (response.status !== 200) {
        yield put({
          type: searchActionTypes.UPDATE_PHASE,
          payload: { phase: searchActionPhases.USERS_SEARCHING_ERROR }
        });
        return;
      }

      yield put({ type: searchActionTypes.UPDATE_USERS, payload: { users: response.data } });
      yield put({
        type: searchActionTypes.UPDATE_PHASE,
        payload: { phase: searchActionPhases.USERS_SEARCHING_SUCCESSFUL }
      });
    }
  );

  yield throttle(
    1500,
    searchActionTypes.SEARCH_MENUS,
    function* searchMenusSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(searchActions.setMenus(payload));
    }
  );

  yield takeLatest(
    searchActionTypes.SET_MENUS,
    function* setMenusSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put({
        type: searchActionTypes.UPDATE_PHASE,
        payload: { phase: searchActionPhases.MENUS_SEARCHING }
      });

      const { flatMenus, searchKey } = payload;

      const menuResults = flatMenus.filter(
        (menu) => menu?.title?.toLowerCase().includes(searchKey.toLowerCase()) && menu?.url !== ''
      );

      yield put({
        type: searchActionTypes.UPDATE_MENUS,
        payload: { menus: menuResults, searchKey: searchKey }
      });
      yield put({
        type: searchActionTypes.UPDATE_PHASE,
        payload: { phase: searchActionPhases.MENUS_SEARCHING_SUCCESSFUL }
      });
    }
  );

  yield throttle(
    1500,
    searchActionTypes.SEARCH_STUDENTS,
    function* searchStudentsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(searchActions.setStudents(payload));
    }
  );

  yield takeLatest(
    searchActionTypes.SET_STUDENTS,
    function* makeSearchSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put({
        type: searchActionTypes.UPDATE_PHASE,
        payload: { phase: searchActionPhases.STUDENTS_SEARCHING }
      });

      const { lang, userId, searchKey } = payload;
      const searchUrl = updateApiUrl(SEARCH_URL, {
        lang: lang,
        userId: userId,
        context: 'students'
      });

      const response = yield axios.get(`${searchUrl}/${searchKey}`);

      if (response.status !== 200) {
        yield put({
          type: searchActionTypes.UPDATE_PHASE,
          payload: { phase: searchActionPhases.STUDENTS_SEARCHING_ERROR }
        });
        return;
      }

      yield put({ type: searchActionTypes.UPDATE_STUDENTS, payload: { students: response.data } });
      yield put({
        type: searchActionTypes.UPDATE_PHASE,
        payload: { phase: searchActionPhases.STUDENTS_SEARCHING_SUCCESSFUL }
      });
    }
  );
}
