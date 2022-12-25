import objectPath from 'object-path';
import { IPersonal } from 'pages/auth/data/account-types';
import { createSelector } from 'reselect';
import { IUserStoreState } from '../types';

export const userPersonalSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'personal']),
  (personal: IPersonal) => personal
);
export const userPhaseSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'phase']),
  (userPhase: string) => userPhase
);
export const userErrorSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'error']),
  (userError: string) => userError
);
