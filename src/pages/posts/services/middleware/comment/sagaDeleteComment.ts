import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { deleteComment, deletePost } from 'graphql/mutations';

import { postActionTypes, TPostActionType } from '../../types';

export function* sagaDeleteComment({ payload }: TPostActionType) {
  // Update phase
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'deleting', error: null }
  });

  const { post, comment } = payload;

  try {
    const { data } = yield API.graphql({
      query: deleteComment,
      variables: { input: { id: comment.id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      yield put({
        type: postActionTypes.STORE.DELETE_COMMENT,
        payload: { post: post, comment: comment }
      });

      // Update phase
      yield put({
        type: postActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'success', error: null }
      });
    } else {
      // Update phase
      yield put({
        type: postActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'error', error: 'Error occurred!' }
      });
    }
  } catch (error) {
    // Update phase
    yield put({
      type: postActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error: error }
    });
  }
}
