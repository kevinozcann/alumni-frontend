import { API } from 'aws-amplify';
import { call, put } from 'redux-saga/effects';

import { updateUser } from 'graphql/mutations';
import { TUserActionType, userActionTypes } from 'pages/profile/services/types';
import { getUserImage } from './getUserImage';
import { prepareUserProfile } from './prepareUserProfile';

export function* sagaUpdateUserProfileImages({ payload }: TUserActionType) {
  // Update phase
  yield put({
    type: userActionTypes.STORE.UPDATE_PHASE,
    payload: { phase: 'updating', error: null }
  });

  try {
    const { profile, imageKeys } = payload;

    const values = {};
    const imageUrls = yield call(getUserImage, profile, imageKeys);

    Object.keys(imageKeys).forEach((key, index) => {
      values[key + 'Key'] = imageKeys[key];
      values[key + 'Url'] = imageUrls[index];
    });

    const updatedProfile = prepareUserProfile(profile, values);

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
