import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { postsByDate } from 'graphql/queries';
import { postActions } from '../../actions';
import { postActionTypes, TPostActionType } from '../../types';

export function* sagaGetPosts({ payload }: TPostActionType) {
  yield put(postActions.setPhase('loading'));

  const { user, page } = payload;

  try {
    const { data } = yield API.graphql({
      query: postsByDate,
      variables: { type: 'Post' },
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
      yield put(postActions.setPhase('success'));
    } else {
      yield put(postActions.setPhase('error', 'Error occurred!'));
    }
  } catch (error) {
    yield put(postActions.setPhase('error', error));
  }
}
