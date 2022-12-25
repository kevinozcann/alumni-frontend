import { TPhase } from 'store/store';

import { IAuthUser } from 'pages/auth/data/account-types';
import { TUserActionType, userActionTypes } from './types';

export const userActions = {
  getUserProfile: (authUser: IAuthUser): TUserActionType => ({
    type: userActionTypes.SAGA.GET_USER_PROFILE,
    payload: { authUser }
  }),
  setPhase: (phase: TPhase, error: string): TUserActionType => ({
    type: userActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  })
};
