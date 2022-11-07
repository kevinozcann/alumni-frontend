import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import produce from 'immer';

import { IAction, TPhase } from 'store/store';
import { STUDENT_TAGS_API_URL } from 'store/ApiUrls';
import { ISchool } from 'pages/organization/organization-types';

export interface IStudentTag {
  id: number;
  tag: string;
  hit: number;
  addedBy?: string;
  addedAt?: string;
}
interface IStudentTagState {
  studentTags: IStudentTag[];
  phase: TPhase;
}
type TActionAllState = IStudentTagState & {
  id: number;
  school: ISchool;
  studentTag: IStudentTag;
  studentTagInfo: Partial<IStudentTag>;
};

export const actionTypes = {
  PULL_STUDENT_TAGS: 'student/tag/PULL_STUDENT_TAGS',
  SET_STUDENT_TAGS: 'student/tag/SET_STUDENT_TAGS',
  ADD_STUDENT_TAG: 'student/tag/ADD_STUDENT_TAG',
  UPDATE_STUDENT_TAG: 'student/tag/UPDATE_STUDENT_TAG',
  DELETE_STUDENT_TAG: 'student/tag/DELETE_STUDENT_TAG',
  SET_STUDENT_TAG: 'student/tag/SET_STUDENT_TAG',
  REMOVE_STUDENT_TAG: 'student/tag/REMOVE_STUDENT_TAG',
  SET_PHASE: 'student/tag/SET_PHASE'
};

export const initialState: IStudentTagState = {
  studentTags: [],
  phase: null
};

export const studentTagsSelector = createSelector(
  (state: IStudentTagState) => objectPath.get(state, ['students', 'tags', 'studentTags']),
  (studentTags: IStudentTag[]) => studentTags
);
export const studentTagsPhaseSelector = createSelector(
  (state: IStudentTagState) => objectPath.get(state, ['students', 'tags', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'students' },
  (state: IStudentTagState = initialState, action: IAction<TActionAllState>): IStudentTagState => {
    switch (action.type) {
      case actionTypes.SET_STUDENT_TAGS: {
        const { studentTags } = action.payload;
        return { ...state, studentTags };
      }
      case actionTypes.SET_STUDENT_TAG: {
        const { studentTag } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.studentTags.findIndex((d) => d.id === studentTag.id);
          if (index > -1) {
            draftState.studentTags[index] = studentTag;
          } else {
            draftState.studentTags.unshift(studentTag);
          }
        });
      }
      case actionTypes.REMOVE_STUDENT_TAG: {
        const { id } = action.payload;
        const studentTags = { ...state }.studentTags.filter((d) => d.id !== id);
        return { ...state, studentTags };
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

export const studentTagsActions = {
  pullStudentTags: (school: ISchool): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_STUDENT_TAGS,
    payload: { school }
  }),
  setStudentTags: (studentTags: IStudentTag[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_STUDENT_TAGS,
    payload: { studentTags }
  }),
  addStudentTag: (
    school: ISchool,
    studentTagInfo: Partial<IStudentTag>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_STUDENT_TAG,
    payload: { school, studentTagInfo }
  }),
  updateStudentTag: (studentTagInfo: Partial<IStudentTag>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_STUDENT_TAG,
    payload: { studentTagInfo }
  }),
  setStudentTag: (studentTag: IStudentTag): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_STUDENT_TAG,
    payload: { studentTag }
  }),
  deleteStudentTag: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_STUDENT_TAG,
    payload: { id }
  }),
  removeStudentTag: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_STUDENT_TAG,
    payload: { id }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_STUDENT_TAGS,
    function* pullStudentTagsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(studentTagsActions.setPhase('loading'));

      const { school } = payload;
      const url = `${STUDENT_TAGS_API_URL}.json?school=${school.id}`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(studentTagsActions.setPhase('error'));
        return;
      }

      yield put(studentTagsActions.setStudentTags(response.data));
      yield put(studentTagsActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.ADD_STUDENT_TAG,
    function* addStudentTagSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(studentTagsActions.setPhase('adding'));

      const { school, studentTagInfo } = payload;
      const response = yield axios.post(`${STUDENT_TAGS_API_URL}`, {
        id: studentTagInfo.id,
        tag: studentTagInfo.tag,
        hit: studentTagInfo.hit,
        addedBy: studentTagInfo.addedBy,
        school: `/api/schools/${school.id}`
      });

      if (response.status !== 201) {
        yield put(studentTagsActions.setPhase('error'));
        return;
      }

      yield put(studentTagsActions.setStudentTag(response.data));
      yield put(studentTagsActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_STUDENT_TAG,
    function* updateStudentTagSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(studentTagsActions.setPhase('updating'));

      const { studentTagInfo } = payload;
      const response = yield axios.patch(
        `${STUDENT_TAGS_API_URL}/${studentTagInfo.id}`,
        studentTagInfo
      );

      if (response.status !== 200) {
        yield put(studentTagsActions.setPhase('error'));
        return;
      }

      yield put(studentTagsActions.setStudentTag(response.data));
      yield put(studentTagsActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.DELETE_STUDENT_TAG,
    function* deleteStudentTagSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(studentTagsActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${STUDENT_TAGS_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(studentTagsActions.setPhase('error'));
        return;
      }

      yield put(studentTagsActions.removeStudentTag(id));
      yield put(studentTagsActions.setPhase('success'));
    }
  );
}
