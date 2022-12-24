import { Amplify, Auth } from 'aws-amplify';
import { all, call, put } from 'redux-saga/effects';

import { authActionTypes } from 'pages/auth/services/types';
import { getS3File } from 'utils/amplifyUtils';
import { toAbsoluteUrl } from 'utils/AssetsHelpers';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

export function* getUserImages() {
  const user = yield Auth.currentAuthenticatedUser();
  const userAttributes = user.attributes;
  const picture = userAttributes['custom:picture'];
  const wallpaper = userAttributes['custom:wallpaper'];

  const [pictureUrl, wallpaperUrl] = yield all([
    picture ? call(getS3File, picture) : toAbsoluteUrl('/media/users/default.jpg'),
    wallpaper ? call(getS3File, wallpaper) : toAbsoluteUrl('/media/users/cover.jpeg')
  ]);

  yield put({
    type: authActionTypes.STORE.UPDATE_AUTH,
    payload: {
      attributes: {
        pictureUrl,
        wallpaperUrl
      }
    }
  });
}
