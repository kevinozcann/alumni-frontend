import { takeLatest } from 'redux-saga/effects';

import { postActionTypes } from '../types';

import { sagaAddComment } from './comment/sagaAddComment';
import { sagaAddPost } from './post/sagaAddPost';
import { sagaDeletePost } from './post/sagaDeletePost';
import { sagaGetPosts } from './post/sagaGetPosts';
import { sagaUpdatePhase } from './sagaUpdatePhase';

export function* sagas() {
  yield takeLatest(postActionTypes.SAGA.ADD_POSTS, sagaAddPost);
  yield takeLatest(postActionTypes.SAGA.ADD_COMMENT, sagaAddComment);
  yield takeLatest(postActionTypes.SAGA.DELETE_POST, sagaDeletePost);
  yield takeLatest(postActionTypes.SAGA.GET_POSTS, sagaGetPosts);
  yield takeLatest(postActionTypes.SAGA.UPDATE_PHASE, sagaUpdatePhase);
}
