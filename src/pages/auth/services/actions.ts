import { TPhase } from 'store/store';
import { IAuthUser } from '../data/account-types';
import { authActionTypes, TAuthActionType, TUserPassword } from './types';

export const authActions = {
  changePassword: (userPassword: TUserPassword): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_USER_PASSWORD,
    payload: { userPassword }
  }),
  login: (email: string, password: string): TAuthActionType => ({
    type: authActionTypes.SAGA.LOGIN,
    payload: { email, password }
  }),
  logout: (): TAuthActionType => ({ type: authActionTypes.SAGA.LOGOUT }),
  register: (email: string, password: string, name: string, lastname: string): TAuthActionType => ({
    type: authActionTypes.SAGA.REGISTER,
    payload: { email, password, name, lastname }
  }),
  setPhase: (phase: TPhase, error: string): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  }),
  updateUser: (user: Partial<IAuthUser>): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_USER,
    payload: { user }
  }),
  verify: (email: string, code: string): TAuthActionType => ({
    type: authActionTypes.SAGA.VERIFY,
    payload: { email, code }
  })
};
