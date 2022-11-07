import axios from 'axios';
import { createSelector } from 'reselect';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';

import { IStudent } from 'pages/students/_store/types';
import { IAction } from 'store/store';
import { TLang } from 'utils/shared-types';
import { updateApiUrl, USER_STUDENTS_URL } from 'store/ApiUrls';

export type TPhase =
  | null
  | 'parent-student-loading'
  | 'parent-student-error'
  | 'parent-student-successful';
interface IStudentsState {
  parentName: string;
  students: IStudent[];
  phase: TPhase;
}
type TActionAllState = IStudentsState & {
  lang: TLang;
  userId: string;
};

export const actionTypes = {
  PARENT_STUDENTS_PULL: 'student/parent/PULL_STUDENTS',
  PARENT_STUDENTS_SET: 'student/parent/SET_STUDENTS',
  PARENT_STUDENTS_PHASE: 'student/parent/SET_PHASE'
};

export const initialState: IStudentsState = {
  parentName: null,
  students: [],
  phase: null
};

export const parentStudentsSelector = createSelector(
  (state: IStudentsState) => objectPath.get(state, ['students', 'parent', 'students']),
  (students: IStudent[]) => students
);
export const parentStudentsPhaseSelector = createSelector(
  (state: IStudentsState) => objectPath.get(state, ['students', 'parent', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'students' },
  (state: IStudentsState = initialState, action: IAction<TActionAllState>): IStudentsState => {
    switch (action.type) {
      case actionTypes.PARENT_STUDENTS_SET: {
        const { students, parentName } = action.payload;
        return { ...state, students, parentName };
      }
      case actionTypes.PARENT_STUDENTS_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const parentStudentsActions = {
  pullParentStudents: (
    lang: TLang,
    userId: string,
    parentName?: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PARENT_STUDENTS_PULL,
    payload: { lang, userId, parentName }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PARENT_STUDENTS_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PARENT_STUDENTS_PULL,
    function* pullParentStudentsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(parentStudentsActions.setPhase('parent-student-loading'));

      const { lang, userId, parentName } = payload;
      const userStudentsUrl = updateApiUrl(USER_STUDENTS_URL, { lang, userId });
      const response = yield axios.get(userStudentsUrl);

      if (response.status !== 200) {
        yield put(parentStudentsActions.setPhase('parent-student-error'));
        return;
      }

      yield put({
        type: actionTypes.PARENT_STUDENTS_SET,
        payload: { students: response.data, parentName }
      });
      yield put(parentStudentsActions.setPhase('parent-student-successful'));
    }
  );
}
