import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import produce from 'immer';

import { ISchool } from 'pages/organization/organization-types';
import { IStudent } from 'pages/students/_store/types';
import { IAction } from 'store/store';
import { CLASS_TEACHERS_URL, STUDENTS_API_URL } from 'store/ApiUrls';
import { TLang } from 'utils/shared-types';
import { IAuthUser } from 'pages/auth/data/account-types';
import { IUser } from 'pages/profile/data/user-types';

export type TPhase = null | 'student-loading' | 'student-error' | 'student-successful';

export interface ITeacherClasses {
  id: number;
  class?: number;
  classStudents?: IStudent[];
  teacher?: string;
  teacherTitle?: string;
  teacherType?: string;
  school: number;
}

interface IStudentListState {
  teacherClasses: ITeacherClasses[];
  students: IStudent[];
  studentInfo: IStudent;
  phase: TPhase;
}

type TActionAllState = IStudentListState & {
  id: number;
  user: IUser;
  lang?: TLang;
  userPersonal: IUser;
  school: ISchool;
  student: IStudent;
};

export const actionTypes = {
  PULL_STUDENTS: 'student/students/PULL_STUDENTS',
  PULL_STUDENT_INFO: 'student/students/PULL_STUDENT_INFO',
  SET_STUDENT_INFO: 'student/students/SET_STUDENT_INFO',
  SET_STUDENTS: 'student/students/SET_STUDENTS',
  SET_TEACHER_CLASSES: 'student/students/SET_TEACHER_CLASSES',
  SET_STUDENT: 'student/students/SET_STUDENT',
  SET_PHASE: 'student/students/SET_PHASE'
};

export const initialState: IStudentListState = {
  teacherClasses: [],
  students: [],
  studentInfo: null,
  phase: null
};

export const studentsSelector = createSelector(
  (state: IStudentListState) => objectPath.get(state, ['students', 'student', 'students']),
  (students: IStudent[]) => students
);
export const teacherClassesSelector = createSelector(
  (state: IStudentListState) => objectPath.get(state, ['students', 'student', 'teacherClasses']),
  (teacherClasses: ITeacherClasses[]) => teacherClasses
);
export const studentInfoSelector = createSelector(
  (state: IStudentListState) => objectPath.get(state, ['students', 'student', 'studentInfo']),
  (studentInfo: IStudent) => studentInfo
);
export const studentsPhaseSelector = createSelector(
  (state: IStudentListState) => objectPath.get(state, ['students', 'student', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'students' },
  (
    state: IStudentListState = initialState,
    action: IAction<TActionAllState>
  ): IStudentListState => {
    switch (action.type) {
      case actionTypes.SET_STUDENTS: {
        const { students } = action.payload;
        return { ...state, students };
      }
      case actionTypes.SET_TEACHER_CLASSES: {
        const { teacherClasses } = action.payload;
        return { ...state, teacherClasses };
      }
      case actionTypes.SET_STUDENT: {
        const { student } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.students.findIndex((d) => d.id === student.id);
          if (index > -1) {
            draftState.students[index] = student;
          } else {
            draftState.students.unshift(student);
          }
        });
      }
      case actionTypes.SET_STUDENT_INFO: {
        const { studentInfo } = action.payload;
        return { ...state, studentInfo };
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

export const studentsActions = {
  pullStudents: (
    user: IAuthUser,
    userPersonal: IAuthUser,
    school: ISchool
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_STUDENTS,
    payload: { user, userPersonal, school }
  }),
  pullStudentInfo: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_STUDENT_INFO,
    payload: { id }
  }),
  setStudents: (students: IStudent[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_STUDENTS,
    payload: { students }
  }),
  setTeacherClasses: (teacherClasses: ITeacherClasses[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_TEACHER_CLASSES,
    payload: { teacherClasses }
  }),
  setStudentInfo: (studentInfo: IStudent): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_STUDENT_INFO,
    payload: { studentInfo }
  }),
  setStudent: (student: IStudent): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_STUDENT,
    payload: { student }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_STUDENTS,
    function* pullStudentsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(studentsActions.setPhase('student-loading'));

      const { userPersonal, school, user } = payload;

      if (user.userType === 'admin') {
        const response = yield axios.get(
          `${CLASS_TEACHERS_URL}.json?school=${school.id}&teacher=${userPersonal.id}`
        );

        if (response.status !== 200) {
          yield put(studentsActions.setPhase('student-error'));
          return;
        }

        yield put(studentsActions.setTeacherClasses(response.data));
        yield put(studentsActions.setPhase('student-successful'));
      }
    }
  );

  yield takeLatest(
    actionTypes.PULL_STUDENT_INFO,
    function* pullStudentInfoSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(studentsActions.setPhase('student-loading'));

      const { id } = payload;
      const response = yield axios.get(`${STUDENTS_API_URL}/${id}`);

      if (response.status !== 200) {
        yield put(studentsActions.setPhase('student-error'));
        return;
      }

      yield put(studentsActions.setStudentInfo(response.data));
      yield put(studentsActions.setPhase('student-successful'));
    }
  );
}
