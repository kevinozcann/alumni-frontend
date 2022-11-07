import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';

import { userActions } from 'store/user';
import { MENUS_API_URL, MENUS_LANG_API_URL, updateApiUrl } from 'store/ApiUrls';
import { IAction } from 'store/store';
import { TLang, TActionType } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';
import { ISchool } from 'pages/organization/organization-types';

import { IMenu, TMenuType } from '../menu-types';

export interface IMenuState {
  headquarters?: IMenu[];
  campus?: IMenu[];
  school?: IMenu[];
  teacher?: IMenu[];
  parent?: IMenu[];
  student?: IMenu[];
  phase?: string;
}
interface IParentMenuState {
  menus: IMenuState;
}
type TActionAllState = IMenuState & {
  actionType?: TActionType;
  lang?: TLang;
  menu?: IMenu;
  menuId?: number;
  menuInfo: Partial<IMenu>;
  menus?: IMenu[];
  menuType?: TMenuType;
  activeSchool?: ISchool;
  activeSchoolId?: number;
  schoolId?: number;
  user?: IUser;
  copyToIds: number[];
};

export const menuActionPhases = {
  MENUS_LOADING: 'menus-loading',
  MENUS_LOADING_ERROR: 'menus-loading-error',
  MENUS_LOADING_SUCCESSFUL: 'menus-loading-successful',
  MENU_COPYING: 'menu-coying',
  MENU_COPYING_ERROR: 'menu-coying-error',
  MENU_COPYING_SUCCESSFUL: 'menu-coying-successful',
  MENU_ADDING: 'menu-adding',
  MENU_ADDING_ERROR: 'menu-adding-error',
  MENU_UPDATING: 'menu-updating',
  MENU_UPDATING_ERROR: 'menu-updating-error',
  MENU_DELETING: 'menu-deleting',
  MENU_DELETING_ERROR: 'menu-deleting-error',
  MENU_ACTION_SUCCESSFUL: 'menu-action-successful',
  MENUS_SYNCING: 'menu-syncing',
  MENUS_SYNCING_ERROR: 'menu-syncing-error',
  MENUS_SYNCING_SUCCESSFUL: 'menu-syncing-successful'
};

export const menuActionTypes = {
  MENUS_COPY: 'menus/COPY_MENUS',
  MENUS_PULL: 'menus/PULL_MENUS',
  MENUS_SYNC: 'menus/SYNC_MENUS',
  MENUS_UPDATE: 'menus/UPDATE_MENUS',
  MENU_SAVE: 'menus/SAVE_MENU',
  MENUS_PHASE: 'menus/UPDATE_PHASE'
};

const initialState: IMenuState = {
  headquarters: null,
  campus: null,
  school: null,
  teacher: null,
  parent: null,
  student: null,
  phase: null
};

export const menusSelector = createSelector(
  (state: IParentMenuState) => objectPath.get(state, ['menus']),
  (menus: IMenuState) => menus
);

export const menusPhaseSelector = createSelector(
  (state: IParentMenuState) => objectPath.get(state, ['menus', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'menus', whitelist: ['menus', 'activeMenus', 'phase'] },
  (state: IMenuState = initialState, action: IAction<TActionAllState>): IMenuState => {
    switch (action.type) {
      case menuActionTypes.MENUS_UPDATE: {
        const { menus, menuType } = action.payload;
        switch (menuType) {
          case 'headquarters':
            return { ...state, headquarters: menus };
          case 'campus':
            return { ...state, campus: menus };
          case 'school':
            return { ...state, school: menus };
          case 'teacher':
            return { ...state, teacher: menus };
          case 'parent':
            return { ...state, parent: menus };
          case 'student':
            return { ...state, student: menus };
          default:
            return { ...state };
        }
      }
      case menuActionTypes.MENUS_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const menuActions = {
  pullMenus: (schoolId: number, menuType: TMenuType): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_PULL,
    payload: { schoolId, menuType }
  }),
  updateMenus: (menus: IMenu[], menuType: TMenuType): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_UPDATE,
    payload: { menus, menuType }
  }),
  syncMenus: (
    lang: TLang,
    activeSchoolId: number,
    menuType: TMenuType
  ): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_SYNC,
    payload: { lang, activeSchoolId, menuType }
  }),
  saveMenu: (
    lang: TLang,
    user: IUser,
    actionType: TActionType,
    menuId: number,
    menuType: TMenuType,
    menuInfo: Partial<IMenu> | null,
    activeSchool: ISchool
  ): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENU_SAVE,
    payload: { lang, user, actionType, menuId, menuType, menuInfo, activeSchool }
  }),
  copyMenu: (
    lang: TLang,
    actionType: TActionType,
    activeSchool: ISchool,
    menuType: TMenuType,
    copyToIds: number[]
  ): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_COPY,
    payload: { lang, actionType, activeSchool, menuType, copyToIds }
  }),
  setPhase: (phase: string): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    menuActionTypes.MENUS_PULL,
    function* menusPullSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING));

      const { schoolId, menuType } = payload;
      const response = yield axios.get(
        `${MENUS_API_URL}.json?school=${schoolId}&type=${menuType}&parent=0&order%5Bposition%5D=asc`
      );

      if (response.status !== 200) {
        yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING_ERROR));
        return;
      }

      yield put(menuActions.updateMenus(response.data, menuType));
      yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING_SUCCESSFUL));
    }
  );

  yield takeLatest(
    menuActionTypes.MENU_SAVE,
    function* menuSaveSaga({ payload }: IAction<Partial<TActionAllState>>) {
      const { lang, user, actionType, menuId, menuType, menuInfo, activeSchool } = payload;
      if (actionType === 'new') {
        yield put(menuActions.setPhase(menuActionPhases.MENU_ADDING));
        menuInfo['school'] = `/api/schools/${activeSchool.id}`;
        const response = yield axios.post(`${MENUS_API_URL}`, menuInfo);

        if (response.status !== 201) {
          yield put(menuActions.setPhase(menuActionPhases.MENU_ADDING_ERROR));
          return;
        }
      } else if (actionType === 'edit') {
        yield put(menuActions.setPhase(menuActionPhases.MENU_UPDATING));

        const response = yield axios.patch(`${MENUS_API_URL}/${menuId}`, menuInfo);

        if (response.status !== 200) {
          yield put(menuActions.setPhase(menuActionPhases.MENU_UPDATING_ERROR));
          return;
        }
      } else if (actionType === 'delete') {
        yield put(menuActions.setPhase(menuActionPhases.MENU_DELETING));
        const response = yield axios.delete(`${MENUS_API_URL}/${menuId}`);

        if (response.status !== 204) {
          yield put(menuActions.setPhase(menuActionPhases.MENU_DELETING_ERROR));
          return;
        }
      }

      yield put(menuActions.pullMenus(activeSchool.id, menuType));

      if (
        activeSchool.type === 'headquarters' ||
        activeSchool.type === 'campus' ||
        user.userZone === menuType
      ) {
        yield put(userActions.updateUserMenus(lang, user, activeSchool));
      }

      yield put(menuActions.setPhase(menuActionPhases.MENU_ACTION_SUCCESSFUL));
    }
  );

  yield takeLatest(
    menuActionTypes.MENUS_COPY,
    function* menuCopySaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(menuActions.setPhase(menuActionPhases.MENU_COPYING));

      const { lang, actionType, activeSchool, menuType, copyToIds } = payload;
      if (actionType === 'copy') {
        const menusApiUrl = updateApiUrl(MENUS_LANG_API_URL, { lang: lang });
        const response = yield axios.post(`${menusApiUrl}/${menuType}/copy_menus`, {
          schoolId: activeSchool.id,
          copyToIds: copyToIds
        });

        if (response.status !== 200) {
          yield put(menuActions.setPhase(menuActionPhases.MENU_COPYING_ERROR));
          return;
        }
      }

      yield put(menuActions.setPhase(menuActionPhases.MENU_COPYING_SUCCESSFUL));
    }
  );

  yield takeLatest(
    menuActionTypes.MENUS_SYNC,
    function* menuSyncSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(menuActions.setPhase(menuActionPhases.MENUS_SYNCING));

      const { lang, activeSchoolId, menuType } = payload;
      const menusApiUrl = updateApiUrl(MENUS_LANG_API_URL, { lang: lang });
      const response = yield axios.post(`${menusApiUrl}/${menuType}/sync_menus`, {
        schoolId: activeSchoolId
      });

      if (response.status !== 200) {
        yield put(menuActions.setPhase(menuActionPhases.MENUS_SYNCING_ERROR));
        return;
      }

      if (response?.data?.response === 'error') {
        yield put(menuActions.setPhase(menuActionPhases.MENUS_SYNCING_ERROR));
        return;
      }

      const syncedMenusResponse = yield axios.get(
        `${MENUS_API_URL}.json?school=${activeSchoolId}&type=${menuType}&parent=0&order%5Bposition%5D=asc`
      );

      if (syncedMenusResponse.status !== 200) {
        yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING_ERROR));
        return;
      }

      yield put(menuActions.updateMenus(syncedMenusResponse.data, menuType));
      yield put(menuActions.setPhase(menuActionPhases.MENUS_SYNCING_SUCCESSFUL));
    }
  );
}
