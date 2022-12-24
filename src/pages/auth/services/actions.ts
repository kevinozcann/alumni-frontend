import { IAuthUser } from '../data/account-types';
import { authActionTypes, TAuthActionType, TUserPassword } from './types';

export const authActions = {
  login: (email: string, password: string): TAuthActionType => ({
    type: authActionTypes.SAGA.LOGIN,
    payload: { email, password }
  }),
  register: (
    email: string,
    password: string,
    name: string,
    lastname: string,
    phoneNumber: string
  ): TAuthActionType => ({
    type: authActionTypes.SAGA.REGISTER,
    payload: { email, password, name, lastname, phoneNumber }
  }),
  verify: (email: string, code: string): TAuthActionType => ({
    type: authActionTypes.SAGA.AUTH_VERIFY,
    payload: { email, code }
  }),
  changePassword: (userPassword: TUserPassword): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_USER_PASSWORD,
    payload: { userPassword }
  }),
  logout: (): TAuthActionType => ({ type: authActionTypes.SAGA.AUTH_LOGOUT }),
  updateUserInfo: (userData: Partial<IAuthUser>): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_USER_INFO,
    payload: { userData }
  }),
  setPhase: (phase: string, error: string): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  })
};
