import { IMenu } from 'data/menu';
import objectPath from 'object-path';
import storage from 'redux-persist/lib/storage';
import { IPersonal } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IStudent } from 'pages/students/_store/types';
import { persistReducer } from 'redux-persist';
import { createSelector } from 'reselect';
import { IUserStore, IUserStoreState, TUserActionType, userActionTypes } from './types';
import { getFlatSchools } from 'utils';

const initialAuthState: IUserStore = {
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
  (state: IUserStoreState) => objectPath.get(state, ['user', 'schools']),
  (schools: ISchool[]) => schools
);
export const userPersonalSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'personal']),
  (personal: IPersonal) => personal
);
export const userActiveSchoolSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'activeSchool']),
  (activeSchool: ISchool) => activeSchool
);
export const userActiveSeasonSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'activeSeason']),
  (activeSeason: ISeason) => activeSeason
);
export const userActiveStudentSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'activeStudent']),
  (activeStudent: IStudent) => activeStudent
);
export const userActiveMenuSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'activeMenu']),
  (activeMenu: IMenu) => activeMenu
);
export const userMenusSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'menus']),
  (menus: IMenu[]) => menus
);
export const userPhaseSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'phase']),
  (userPhase: string) => userPhase
);
export const userErrorSelector = createSelector(
  (state: IUserStoreState) => objectPath.get(state, ['user', 'error']),
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
  (state: IUserStore = initialAuthState, action: TUserActionType): IUserStore => {
    switch (action.type) {
      case userActionTypes.SET_USER_SCHOOLS: {
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
      case userActionTypes.SET_ACTIVE_SCHOOL: {
        const { activeSchool } = action.payload;
        return { ...state, activeSchool };
      }
      case userActionTypes.USER_UPDATE_ACTIVE_SEASON: {
        const { activeSeason } = action.payload;
        return { ...state, activeSeason, phase: null };
      }
      case userActionTypes.USER_UPDATE_ACTIVE_STUDENT: {
        const { activeStudent } = action.payload;
        return { ...state, activeStudent };
      }
      case userActionTypes.SET_ACTIVE_SEASON: {
        const { activeSeason } = action.payload;
        return { ...state, activeSeason };
      }
      case userActionTypes.SET_ACTIVE_MENU: {
        const { activeMenu } = action.payload;
        return { ...state, activeMenu };
      }
      case userActionTypes.SET_SCHOOL_MENUS: {
        const { menus } = action.payload;
        return { ...state, menus, activeMenu: null };
      }
      case userActionTypes.USER_PERSONAL_SAVED: {
        const { personal } = action.payload;
        return { ...state, personal };
      }
      case userActionTypes.SET_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);
