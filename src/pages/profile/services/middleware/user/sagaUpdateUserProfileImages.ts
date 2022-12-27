import { API } from 'aws-amplify';
import { call, put } from 'redux-saga/effects';

import { updateUser } from 'graphql/mutations';
import { authActions } from 'pages/auth/services/actions';
import { TUserActionType, userActionTypes } from 'pages/profile/services/types';
import { authActionTypes } from 'pages/auth/services/types';

export function* sagaUpdateUserProfileImages({ payload }: TUserActionType) {
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
        type: userActionTypes.STORE.UPDATE_PROFILE,
        payload: { profile }
      });

      // Update phase
      yield put({
        type: userActionTypes.STORE.UPDATE_PHASE,
        payload: { phase: 'success', error: null }
      });

      // Update authUser for the keys changed so that it is kept synced
      const updatedAuthUser = { ...authUser };
      const valuesKeys = Object.keys(values);

      Object.keys(updatedAuthUser).forEach((key) => {
        if (valuesKeys.includes(key) && updatedAuthUser[key] !== values[key]) {
          updatedAuthUser[key] = values[key];
        }
      });

      yield put({
        type: authActionTypes.SAGA.UPDATE_USER,
        payload: { user: updatedAuthUser }
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
