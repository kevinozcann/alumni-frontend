import { API, Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { createPost } from 'graphql/mutations';

import { postActionTypes, TPostActionType } from '../../types';
import { postActions } from '../../actions';

export function* sagaAddPost({ payload }: TPostActionType) {
  // Update phase
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'adding', error: null }
  });

  const { user, post } = payload;

  try {
    const { data } = yield API.graphql({
      query: createPost,
      variables: {
        input: {
          type: 'Post',
          content: post.content,
          userID: user.id
        }
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      yield put({
        type: postActionTypes.STORE.UPDATE_POST,
        payload: { post: data.createPost }
      });

      // Reset draft
      yield put({
        type: postActionTypes.STORE.UPSERT_DRAFT,
        payload: { post: null }
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
