import { TPhase } from 'store/store';
import { TUserActionType, userActionTypes } from './types';

export const userActions = {
  getUserProfile: (): TUserActionType => ({
    type: userActionTypes.SAGA.GET_USER_PROFILE
  }),
  setPhase: (phase: TPhase, error: string): TUserActionType => ({
    type: userActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  })
};
