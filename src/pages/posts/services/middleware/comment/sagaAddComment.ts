import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { createComment } from 'graphql/mutations';

import { postActions } from '../../actions';
import { postActionTypes, TPostActionType } from '../../types';

export function* sagaAddComment({ payload }: TPostActionType) {
  // Update phase
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'adding', error: null }
  });

  const { user, post, comment } = payload;

  try {
    const { data } = yield API.graphql({
      query: createComment,
      variables: {
        input: {
          content: comment.content,
          postID: post.id,
          userID: user.id
        }
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      // Add the comment to the post
      post.comments.items.unshift(data.createComment);

      // Update the post
      yield put({
        type: postActionTypes.STORE.UPDATE_POST,
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
