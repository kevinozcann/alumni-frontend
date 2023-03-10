import { takeLatest } from 'redux-saga/effects';

import { postActionTypes } from '../types';

import { sagaAddComment } from './comment/sagaAddComment';
import { sagaAddPost } from './post/sagaAddPost';
import { sagaDeleteComment } from './comment/sagaDeleteComment';
import { sagaDeletePost } from './post/sagaDeletePost';
import { sagaGetPosts } from './post/sagaGetPosts';
import { sagaUpdatePostImages } from './post/sagaUpdatePostImages';
import { sagaUpsertDraft } from './post/sagaUpsertDraft';
import { sagaUpdatePhase } from './sagaUpdatePhase';
import { sagaUpdateComment } from './comment/sagaUpdateComment';

export function* sagas() {
  yield takeLatest(postActionTypes.SAGA.ADD_POST, sagaAddPost);
  yield takeLatest(postActionTypes.SAGA.ADD_COMMENT, sagaAddComment);
  yield takeLatest(postActionTypes.SAGA.DELETE_POST, sagaDeletePost);
  yield takeLatest(postActionTypes.SAGA.DELETE_COMMENT, sagaDeleteComment);
  yield takeLatest(postActionTypes.SAGA.GET_POSTS, sagaGetPosts);
  yield takeLatest(postActionTypes.SAGA.UPDATE_COMMENT, sagaUpdateComment);
  yield takeLatest(postActionTypes.SAGA.UPDATE_PHASE, sagaUpdatePhase);
  yield takeLatest(postActionTypes.SAGA.UPDATE_POST_IMAGES, sagaUpdatePostImages);
  yield takeLatest(postActionTypes.SAGA.UPSERT_DRAFT, sagaUpsertDraft);
}
