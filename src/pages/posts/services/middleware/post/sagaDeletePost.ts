import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { deletePost } from 'graphql/mutations';

import { postActionTypes, TPostActionType } from '../../types';
import { postActions } from '../../actions';

export function* sagaDeletePost({ payload }: TPostActionType) {
  yield put(postActions.setPhase('deleting'));

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
      yield put(postActions.setPhase('success'));
    } else {
      yield put(postActions.setPhase('error', 'Error occurred!'));
    }
  } catch (error) {
    yield put(postActions.setPhase('error', error));
  }
}
