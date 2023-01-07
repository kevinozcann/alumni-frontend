import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { createComment, updateComment } from 'graphql/mutations';

import { postActionTypes, TPostActionType } from '../../types';

export function* sagaUpdateComment({ payload }: TPostActionType) {
  // Update phase
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'updating', error: null }
  });

  const { post, comment } = payload;

  try {
    const { data } = yield API.graphql({
      query: updateComment,
      variables: {
        input: {
          id: comment.id,
          content: comment.content
        }
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      // Update the post
      yield put({
        type: postActionTypes.STORE.UPDATE_COMMENT,
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
