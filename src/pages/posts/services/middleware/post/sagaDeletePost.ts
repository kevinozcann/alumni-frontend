import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { deletePost } from 'graphql/mutations';

import { postActionTypes, TPostActionType } from '../../types';
import { postActions } from '../../actions';

export function* sagaDeletePost({ payload }: TPostActionType) {
  // Update phase
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'deleting', error: null }
  });

  const { post } = payload;

  try {
    const { data } = yield API.graphql({
      query: deletePost,
      variables: { input: { id: post.id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      yield put({
        type: postActionTypes.STORE.DELETE_POST,
        payload: { post: post }
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
