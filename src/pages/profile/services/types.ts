import { IMenu } from 'data/menu';
import { IPersonal, IUser } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IStudent } from 'pages/students/_store/types';
import { IAction } from 'store/store';
import { TLang } from 'utils/shared-types';

export const userActionTypes = {
  ADD_USER: 'user/ADD_USER',
  UPDATE_USER_MENUS: 'user/USER_UPDATE_MENUS',
  SET_ACTIVE_MENU: 'user/SET_ACTIVE_MENU',
  SET_SCHOOL_MENUS: 'user/SET_SCHOOL_MENUS',
  UPDATE_ACTIVE_SCHOOL: 'user/UPDATE_ACTIVE_SCHOOL',
  SET_ACTIVE_SCHOOL: 'user/SET_ACTIVE_SCHOOL',
  SET_ACTIVE_SEASON: 'user/UPDATE_ACTIVE_SEASON_BY_SCHOOL',
  UPDATE_USER_SCHOOLS: 'user/UPDATE_USER_SCHOOLS',
  SET_USER_SCHOOLS: 'user/SET_USER_SCHOOLS',
  USER_PERSONAL_SAVED: 'user/PERSONAL_SAVED',
  PULL_CONFIGURATION_SCHOOL: 'user/PULL_CONFIGURATION_SCHOOL',
  USER_SET_ACTIVE_SEASON: 'user/ACTIVE_SEASON_SET',
  USER_UPDATE_ACTIVE_SEASON: 'user/UPDATE_ACTIVE_SEASON',
  USER_UPDATE_ACTIVE_STUDENT: 'user/UPDATE_ACTIVE_STUDENT',
  USER_USER_REQUESTED: 'user/USER_REQUESTED',
  SET_PHASE: 'user/SET_PHASE'
};

export interface IUserStoreState {
  user: IUserStore;
}
export interface IUserStore {
  activeSchool?: ISchool;
  activeSeason?: ISeason;
  activeStudent?: IStudent;
  activeMenu?: IMenu;
  schools?: ISchool[];
  school?: ISchool;
  personal?: IPersonal;
  menus?: IMenu;
  phase?: string;
  error?: string;
}
export type TUserStoreActions = IUserStore & {
  email?: string;
  lang?: TLang;
  user?: IUser;
  name?: string;
  lastname?: string;
  password?: string;
  userType?: string;
  transferSchools?: ISchool[];
};
export type TUserActionType = IAction<Partial<TUserStoreActions>>;
