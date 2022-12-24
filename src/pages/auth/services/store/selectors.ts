import objectPath from 'object-path';
import { createSelector } from 'reselect';

import { IUser } from 'pages/auth/data/account-types';
import { IAuthStore, IAuthStoreState } from '../types';

export const authSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth']),
  (auth: IAuthStore) => auth
);
export const authUserSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'user']),
  (user: IUser) => user
);
export const authAccessTokenSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'accessToken']),
  (accessToken: string) => accessToken
);
export const authPhaseSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'phase']),
  (authPhase: string) => authPhase
);
export const authErrorSelector = createSelector(
  (state: IAuthStoreState) => objectPath.get(state, ['auth', 'error']),
  (authError: any) => authError
);
