import { TPhase } from 'store/store';
import { IAuthUser } from '../data/account-types';
import { authActionTypes, TAuthActionType, TUserPassword } from './types';

export const authActions = {
  changePassword: (userPassword: TUserPassword): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_PASSWORD,
    payload: { userPassword }
  }),
  forgotPassword: (email: string): TAuthActionType => ({
    type: authActionTypes.SAGA.FORGOT_PASSWORD,
    payload: { email }
  }),
  forgotPasswordSubmit: (
    email: string,
    code: string,
    userPassword: TUserPassword
  ): TAuthActionType => ({
    type: authActionTypes.SAGA.FORGOT_PASSWORD_SUBMIT,
    payload: { email, code, userPassword }
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
  updateAuthUser: (authUser: IAuthUser): TAuthActionType => ({
    type: authActionTypes.SAGA.UPDATE_USER,
    payload: { user: authUser }
  }),
  verify: (email: string, code: string): TAuthActionType => ({
    type: authActionTypes.SAGA.VERIFY,
    payload: { email, code }
  })
};
