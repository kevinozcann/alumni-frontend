import { IMenu } from 'data/menu';
import { IUser } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IStudent } from 'pages/students/_store/types';
import { TLang } from 'utils/shared-types';
import { TUserActionType, userActionTypes } from './types';

export const userActions = {
  addUser: (
    email: string,
    name: string,
    lastname: string,
    password: string,
    userType: string
  ): TUserActionType => ({
    type: userActionTypes.ADD_USER,
    payload: { email, name, lastname, password, userType }
  }),

  pullConfigurationSchool: (): TUserActionType => ({
    type: userActionTypes.PULL_CONFIGURATION_SCHOOL
  }),
  updateUserSchools: (lang: TLang, user: IUser) => ({
    type: userActionTypes.UPDATE_USER_SCHOOLS,
    payload: { lang, user }
  }),
  setActiveSchool: (lang: TLang, user: IUser, activeSchool: ISchool): TUserActionType => ({
    type: userActionTypes.UPDATE_ACTIVE_SCHOOL,
    payload: { lang, user, activeSchool }
  }),
  setActiveSeason: (activeSeason: ISeason): TUserActionType => ({
    type: userActionTypes.USER_SET_ACTIVE_SEASON,
    payload: { activeSeason }
  }),
  updateActiveStudent: (activeStudent: IStudent): TUserActionType => ({
    type: userActionTypes.USER_UPDATE_ACTIVE_STUDENT,
    payload: { activeStudent }
  }),
  updateActiveMenu: (activeMenu: IMenu): TUserActionType => ({
    type: userActionTypes.SET_ACTIVE_MENU,
    payload: { activeMenu }
  }),
  updateUserMenus: (lang: TLang, user: IUser, activeSchool: ISchool): TUserActionType => ({
    type: userActionTypes.UPDATE_USER_MENUS,
    payload: { lang, user, activeSchool }
  }),
  setPhase: (phase: string, error: string): TUserActionType => ({
    type: userActionTypes.SET_PHASE,
    payload: { phase, error }
  })
};
