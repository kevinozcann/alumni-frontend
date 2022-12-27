import { IUser } from 'pages/profile/data/user-types';

const unallowedKeys = ['posts', 'comments', 'createdAt', 'updatedAt'];

export function prepareUserProfile(profile: IUser, values: IUser) {
  // Merge values
  const returnProfile = Object.assign(profile, values);

  // Remove null keys
  Object.keys(returnProfile).forEach((key) => {
    if (returnProfile[key] == null) {
      delete returnProfile[key];
    }
  });

  // Remove keys that are not allowed
  unallowedKeys.forEach((key) => {
    delete returnProfile[key];
  });

  return returnProfile;
}
