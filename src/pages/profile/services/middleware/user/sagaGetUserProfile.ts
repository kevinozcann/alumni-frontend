import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { TUserActionType, userActionTypes } from 'pages/profile/services/types';
import { userByEmail } from 'graphql/queries';

export function* sagaGetUserProfile({ payload }: TUserActionType) {
  // Update phase
  yield put({
    type: userActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'loading', error: null }
  });

  try {
    const { authUser } = payload;
    const { email } = authUser;

    // Query user by email
    const { data } = yield API.graphql({
      query: userByEmail,
      variables: { email: email },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      const profile = data.userByEmail.items[0];

      // Update posts in the store
      yield put({
        type: userActionTypes.STORE.UPDATE_PROFILE,
        payload: { profile }
      });
      // Update phase
      yield put({
        type: userActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'success', error: null }
      });
    } else {
      // Update error
      yield put({
        type: userActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'error', error: 'Error occurred!' }
      });
    }
  } catch (error) {
    // Update error
    yield put({
      type: userActionTypes.STORE.UPDATE_PHASE,
      payload: { phase: 'error', error }
    });
  }
}
