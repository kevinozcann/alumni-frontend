import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getFlatSchools } from 'utils';
import { IUserStore, TUserActionType, userActionTypes } from '../types';

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
