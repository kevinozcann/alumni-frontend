import { TPhase } from 'store/store';

import { IAuthUser } from 'pages/auth/data/account-types';
import { TUserActionType, userActionTypes } from './types';
import { IUser } from '../data/user-types';

export const userActions = {
  getUserProfile: (authUser: IAuthUser): TUserActionType => ({
    type: userActionTypes.SAGA.GET_PROFILE,
    payload: { authUser }
  }),
  updateUserProfile: (authUser: IAuthUser, profile: IUser, values: IUser): TUserActionType => ({
    type: userActionTypes.SAGA.UPDATE_PROFILE,
    payload: { authUser, profile, values }
  }),
  updateUserProfileImages: (
    profile: IUser,
    imageKeys: Record<string, string>
  ): TUserActionType => ({
    type: userActionTypes.SAGA.UPDATE_IMAGES,
    payload: { profile, imageKeys }
  }),
  setPhase: (phase: TPhase, error: string): TUserActionType => ({
    type: userActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  })
};
