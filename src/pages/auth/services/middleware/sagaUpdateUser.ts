import { Auth } from 'aws-amplify';
import { call, delay, put } from 'redux-saga/effects';

import { getUserImages } from 'pages/profile/services/middleware/user/getUserImages';

import { authActions } from '../actions';
import { authActionTypes, TAuthActionType } from '../types';

const attributesList = [
  'name',
  'family_name',
  'email',
  'email_verified',
  'phone_number',
  'phone_number_verified',
  'custom:picture',
  'custom:wallpaper'
];

export function* sagaUpdateUser({ payload }: TAuthActionType) {
  yield put(authActions.setPhase('updating', null));

  const { user } = payload;

  const authenticatedUser = yield Auth.currentAuthenticatedUser();

  if (user.hasOwnProperty('attributes')) {
    try {
      const attributes = user['attributes'];
      const updateAttributes = {};

      attributesList.forEach((attribute) => {
        if (attributes.hasOwnProperty(attribute)) {
          updateAttributes[attribute] = attributes[attribute];
        }
      });

      const result = yield Auth.updateUserAttributes(authenticatedUser, updateAttributes);

      if (result === 'SUCCESS') {
        yield put({
          type: authActionTypes.STORE.UPDATE_AUTH,
          payload: {
            attributes: updateAttributes
          }
        });

        // If pictures are updated then get a temp url for them
        if (
          attributes.hasOwnProperty('custom:picture') ||
          attributes.hasOwnProperty('custom:wallpaper')
        ) {
          yield call(getUserImages);
        }
      } else {
        yield put(authActions.setPhase('error', 'An error occurred!'));
      }

      yield put(authActions.setPhase('success', null));
    } catch (error) {
      console.log('error', error);
      yield put(authActions.setPhase('error', error));
    }
  }
}
