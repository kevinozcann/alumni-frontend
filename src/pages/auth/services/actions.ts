import { IUser } from '../data/account-types';
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
  logout: (): TAuthActionType => ({ type: authActionTypes.SAGA.AUTH_LOGOUT }),
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
  setPhase: (phase: string, error: string): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  }),
  updateUser: (user: Partial<IUser>): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_USER,
    payload: { user }
  }),
  verify: (email: string, code: string): TAuthActionType => ({
    type: authActionTypes.SAGA.AUTH_VERIFY,
    payload: { email, code }
  })
};
