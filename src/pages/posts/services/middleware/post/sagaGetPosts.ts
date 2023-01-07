import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { postsByDate } from 'graphql/queries';
import { postActions } from '../../actions';
import { postActionTypes, TPostActionType } from '../../types';

export function* sagaGetPosts({ payload }: TPostActionType) {
  // Update phase
  yield put({
    type: postActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'loading', error: null }
  });

  const { user, page } = payload;

  try {
    const { data } = yield API.graphql({
      query: postsByDate,
      variables: { type: 'Post', sortDirection: 'DESC' },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      const posts = data.postsByDate.items;
      const nextToken = data.postsByDate.nextToken;

      // Update posts in the store
      yield put({
        type: postActionTypes.STORE.UPDATE_POSTS,
        payload: { posts: posts, nextToken }
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
