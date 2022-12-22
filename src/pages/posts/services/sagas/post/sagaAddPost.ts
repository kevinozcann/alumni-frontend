import { API, Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { createPost } from 'graphql/mutations';

import { postActionTypes, TPostActionType } from '../../types';
import { postActions } from '../../actions';

export function* sagaAddPost({ payload }: TPostActionType) {
  yield put(postActions.setPhase('adding'));

  const { user, post, actionType } = payload;

  const { username } = yield Auth.currentAuthenticatedUser();
  const date = new Date();

  try {
    const { data } = yield API.graphql({
      query: createPost,
      variables: {
        input: {
          type: 'Post',
          title: post.title,
          content: post.content,
          userPostsId: username,
          createdAt: date.toISOString()
        }
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      yield put({
        type: postActionTypes.STORE.UPDATE_POST,
        payload: { post: data.createPost }
      });
      yield put(postActions.setPhase('success'));
    } else {
      yield put(postActions.setPhase('error', 'Error occurred!'));
    }
  } catch (error) {
    yield put(postActions.setPhase('error', error));
  }
}
