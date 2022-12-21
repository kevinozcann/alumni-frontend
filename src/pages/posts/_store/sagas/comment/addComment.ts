import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { createComment } from 'graphql/mutations';
import { postActions, postActionTypes, TPostActionType } from '../../posts';

export function* addComment({ payload }: TPostActionType) {
  yield put(postActions.setPhase('adding', null));

  const { user, post, comment } = payload;

  const { data } = yield API.graphql({
    query: createComment,
    variables: {
      input: {
        content: comment.content,
        userCommentsId: user.attributes.sub,
        postCommentsId: post.id
      }
    },
    authMode: 'AMAZON_COGNITO_USER_POOLS'
  });

  if (data) {
    yield put({
      type: postActionTypes.POST_UPDATE,
      payload: { post: data.createComment }
    });
    yield put(postActions.setPhase('success'));
  } else {
    yield put(postActions.setPhase('error', 'Error occurred!'));
  }
}
