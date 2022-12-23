import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { IMenu } from 'data/menu';
import { IPersonal, IUser } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IStudent } from 'pages/students/_store/types';
import { IAction } from 'store/store';
import { getFlatSchools } from 'utils';
import { TLang } from 'utils/shared-types';
import { getUserSchools, userSagas as saga } from './sagas';

interface IUserState {
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
interface IParentUserState {
  user: IUserState;
}
type TActionAllState = IUserState & {
  email?: string;
  lang?: TLang;
  user?: IUser;
  name?: string;
  lastname?: string;
  password?: string;
  userType?: string;
  transferSchools?: ISchool[];
};
export type TActionType = IAction<TActionAllState>;

export const actionTypes = {
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
const initialAuthState: IUserState = {
  activeSchool: null,
  activeSeason: null,
  activeStudent: null,
  activeMenu: null,
  menus: null,
  personal: null,
  schools: null,
  phase: null,
  error: null
};

export const userSchoolsSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'schools']),
  (schools: ISchool[]) => schools
);
export const userPersonalSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'personal']),
  (personal: IPersonal) => personal
);
export const userActiveSchoolSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'activeSchool']),
  (activeSchool: ISchool) => activeSchool
);
export const userActiveSeasonSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'activeSeason']),
  (activeSeason: ISeason) => activeSeason
);
export const userActiveStudentSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'activeStudent']),
  (activeStudent: IStudent) => activeStudent
);
export const userActiveMenuSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'activeMenu']),
  (activeMenu: IMenu) => activeMenu
);
export const userMenusSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'menus']),
  (menus: IMenu[]) => menus
);
export const userPhaseSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'phase']),
  (userPhase: string) => userPhase
);
export const userErrorSelector = createSelector(
  (state: IParentUserState) => objectPath.get(state, ['user', 'error']),
  (userError: string) => userError
);

export const reducer = persistReducer(
  {
    storage,
    key: 'user',
    whitelist: [
      'schools',
      'personal',
      'activeSchool',
      'activeSeason',
      'activeStudent',
      'activeMenu',
      'menus',
      'phase',
      'error'
    ]
  },
  (state: IUserState = initialAuthState, action: TActionType): IUserState => {
    switch (action.type) {
      case actionTypes.SET_USER_SCHOOLS: {
        const { schools } = action.payload;
        if (schools) {
          const flatSchools = getFlatSchools(schools);
          const existingActiveSchool = { ...state.activeSchool };
          const existingActiveSeason = { ...state.activeSeason };

          let activeSeason = existingActiveSeason;
          let activeSchool = flatSchools.find((s) => s.id === existingActiveSchool.id);
          if (activeSchool) {
            activeSeason = activeSchool.seasons?.find((s) => s.id === existingActiveSeason.id);

            if (!activeSeason) {
              activeSeason = existingActiveSeason;
            }
          } else {
            activeSchool = existingActiveSchool;
          }

          return { ...state, schools, activeSchool, activeSeason };
        } else {
          return { ...state, schools: null, activeSchool: null };
        }
      }
      case actionTypes.SET_ACTIVE_SCHOOL: {
        const { activeSchool } = action.payload;
        return { ...state, activeSchool };
      }
      case actionTypes.USER_UPDATE_ACTIVE_SEASON: {
        const { activeSeason } = action.payload;
        return { ...state, activeSeason, phase: null };
      }
      case actionTypes.USER_UPDATE_ACTIVE_STUDENT: {
        const { activeStudent } = action.payload;
        return { ...state, activeStudent };
      }
      case actionTypes.SET_ACTIVE_SEASON: {
        const { activeSeason } = action.payload;
        return { ...state, activeSeason };
      }
      case actionTypes.SET_ACTIVE_MENU: {
        const { activeMenu } = action.payload;
        return { ...state, activeMenu };
      }
      case actionTypes.SET_SCHOOL_MENUS: {
        const { menus } = action.payload;
        return { ...state, menus, activeMenu: null };
      }
      case actionTypes.USER_PERSONAL_SAVED: {
        const { personal } = action.payload;
        return { ...state, personal };
      }
      case actionTypes.SET_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const userActions = {
  addUser: (
    email: string,
    name: string,
    lastname: string,
    password: string,
    userType: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_USER,
    payload: { email, name, lastname, password, userType }
  }),

  pullConfigurationSchool: (): TActionType => ({
    type: actionTypes.PULL_CONFIGURATION_SCHOOL
  }),
  updateUserSchools: (lang: TLang, user: IUser) => ({
    type: actionTypes.UPDATE_USER_SCHOOLS,
    payload: { lang, user }
  }),
  setActiveSchool: (lang: TLang, user: IUser, activeSchool: ISchool): TActionType => ({
    type: actionTypes.UPDATE_ACTIVE_SCHOOL,
    payload: { lang, user, activeSchool }
  }),
  setActiveSeason: (activeSeason: ISeason): TActionType => ({
    type: actionTypes.USER_SET_ACTIVE_SEASON,
    payload: { activeSeason }
  }),
  updateActiveStudent: (activeStudent: IStudent): TActionType => ({
    type: actionTypes.USER_UPDATE_ACTIVE_STUDENT,
    payload: { activeStudent }
  }),
  updateActiveMenu: (activeMenu: IMenu): TActionType => ({
    type: actionTypes.SET_ACTIVE_MENU,
    payload: { activeMenu }
  }),
  updateUserMenus: (lang: TLang, user: IUser, activeSchool: ISchool): TActionType => ({
    type: actionTypes.UPDATE_USER_MENUS,
    payload: { lang, user, activeSchool }
  }),
  setPhase: (phase: string, error: string): TActionType => ({
    type: actionTypes.SET_PHASE,
    payload: { phase, error }
  })
};

export { saga, getUserSchools };
