import objectPath from 'object-path';
import { createSelector } from 'reselect';

import { IUser } from 'pages/auth/data/account-types';
import { IUserStoreState } from '../types';

export const userProfileSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'profile']),
  (profile: IUser) => profile
);
export const userPhaseSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'phase']),
  (userPhase: string) => userPhase
);
export const userErrorSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'error']),
  (userError: string) => userError
);
