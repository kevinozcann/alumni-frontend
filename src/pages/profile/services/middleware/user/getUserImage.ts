import { all, call } from 'redux-saga/effects';

import { IUser } from 'pages/profile/data/user-types';
import { getS3File } from 'utils/amplifyUtils';

export function* getUserImage(user: IUser, imageKeys: Record<string, string>) {
  try {
    const callAll = [];

    Object.keys(imageKeys).forEach((key) => {
      callAll.push(call(getS3File, imageKeys[key], 'public'));
    });

    return yield all(callAll);
  } catch (error) {
    console.log(error);
    return error;
  }
}
