import objectPath from 'object-path';
import { createSelector } from 'reselect';

import { TPhase } from 'store/store';
import { IUser } from 'pages/profile/data/user-types';
import { IUserStoreState } from '../types';

export const userProfileSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'profile']),
  (profile: IUser) => profile
);
export const userPhaseSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'phase']),
  (userPhase: TPhase) => userPhase
);
export const userErrorSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'error']),
  (userError: string) => userError
);
