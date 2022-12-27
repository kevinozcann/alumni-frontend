import { API } from 'aws-amplify';
import { put } from 'redux-saga/effects';

import { TUserActionType, userActionTypes } from 'pages/profile/services/types';
import { userByEmail } from 'graphql/queries';
import { updateUser } from 'graphql/mutations';

export function* sagaUpdateUserProfile({ payload }: TUserActionType) {
  // Update phase
  yield put({
    type: userActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'updating', error: null }
  });

  try {
    const { authUser, profile, values } = payload;

    const updatedProfile = Object.assign(profile, values);

    // Remove null keys
    Object.keys(updatedProfile).forEach((key) => {
      if (updatedProfile[key] == null) {
        delete updatedProfile[key];
      }
    });

    // Remove keys that are not allowed
    delete updatedProfile['posts'];
    delete updatedProfile['comments'];
    delete updatedProfile['createdAt'];
    delete updatedProfile['updatedAt'];

    // Update user
    const { data } = yield API.graphql({
      query: updateUser,
      variables: { input: updatedProfile },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    if (data) {
      const profile = data.updateUser;

      // Update posts in the store
      yield put({
        type: userActionTypes.STORE.UPDATE_USER_PROFILE,
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
