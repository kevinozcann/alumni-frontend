import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { createComment } from 'graphql/mutations';

import { postActions } from '../../actions';
import { postActionTypes, TPostActionType } from '../../types';

export function* sagaAddComment({ payload }: TPostActionType) {
  yield put(postActions.setPhase('adding', null));

  const { user, post, comment } = payload;

  const { data } = yield API.graphql({
    query: createComment,
    variables: {
      input: {
        content: comment.content,
        userCommentsId: user.sub,
        postCommentsId: post.id
      }
    },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  });

  if (data) {
    yield put({
      type: postActionTypes.STORE.UPDATE_POST,
      payload: { post: data.createComment }
    });
    yield put(postActions.setPhase('success'));
  } else {
    yield put(postActions.setPhase('error', 'Error occurred!'));
  }
}
