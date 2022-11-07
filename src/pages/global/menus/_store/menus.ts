import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';

import { GLOBAL_MENUS_URL } from 'store/ApiUrls';
import { IAction } from 'store/store';
import { TLang, TActionType } from 'utils/shared-types';

import { IUser } from 'pages/account/account-types';
import { IMenu, TMenuType } from 'pages/admin/menus/menu-types';
import { ISchool } from 'pages/organization/organization-types';

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
  schoolId?: number;
  user?: IUser;
  copyToIds: number[];
  direction: 'up' | 'down';
};

export const menuActionPhases = {
  MENUS_LOADING: 'menus-loading',
  MENUS_LOADING_ERROR: 'menus-loading-error',
  MENUS_LOADING_SUCCESSFUL: 'menus-loading-successful',
  MENU_MOVING: 'menu-moving',
  MENU_MOVING_ERROR: 'menu-moving-error',
  MENU_MOVING_SUCCESSFUL: 'menu-moving-successful',
  MENU_ADDING: 'menu-adding',
  MENU_ADDING_ERROR: 'menu-adding-error',
  MENU_UPDATING: 'menu-updating',
  MENU_UPDATING_ERROR: 'menu-updating-error',
  MENU_DELETING: 'menu-deleting',
  MENU_DELETING_ERROR: 'menu-deleting-error',
  MENU_ACTION_SUCCESSFUL: 'menu-action-successful'
};

export const menuActionTypes = {
  MENUS_PULL: 'global/menus/PULL',
  MENUS_UPDATE: 'global/menus/UPDATE_MENUS',
  MENU_SAVE: 'global/menus/SAVE_MENU',
  MENU_MOVE: 'global/menus/MOVE_MENU',
  MENU_PHASE: 'global/menus/UPDATE_PHASE'
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
  (state: IParentMenuState) => objectPath.get(state, ['global', 'globalMenus']),
  (menus: IMenuState) => menus
);

export const menusPhaseSelector = createSelector(
  (state: IParentMenuState) => objectPath.get(state, ['global', 'globalMenus', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'globalMenus', whitelist: ['globalMenus', 'activeMenus', 'phase'] },
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
      case menuActionTypes.MENU_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const menuActions = {
  pullMenus: (menuType: TMenuType): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_PULL,
    payload: { menuType }
  }),
  updateMenus: (menus: IMenu[], menuType: TMenuType): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENUS_UPDATE,
    payload: { menus, menuType }
  }),
  saveMenu: (
    actionType: TActionType,
    menuId: number,
    menuType: TMenuType,
    menuInfo: Partial<IMenu> | null
  ): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENU_SAVE,
    payload: { actionType, menuId, menuType, menuInfo }
  }),
  moveMenu: (
    direction: 'up' | 'down',
    menu: IMenu,
    menus: IMenu[]
  ): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENU_MOVE,
    payload: { direction, menu, menus }
  }),
  setPhase: (phase: string): IAction<Partial<TActionAllState>> => ({
    type: menuActionTypes.MENU_PHASE,
    payload: { phase }
  })
};

function* menusPullSaga({ payload }: IAction<Partial<TActionAllState>>) {
  yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING));

  const { menuType } = payload;
  const response = yield axios.get(
    `${GLOBAL_MENUS_URL}.json?type=${menuType}&parent=0&order%5Bposition%5D=asc`
  );

  if (response.status !== 200) {
    yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING_ERROR));
    return;
  }

  yield put(menuActions.updateMenus(response.data, menuType));
  yield put(menuActions.setPhase(menuActionPhases.MENUS_LOADING_SUCCESSFUL));
}

function* updateMenu(menuId: number, menuInfo: Partial<IMenu>) {
  yield put(menuActions.setPhase(menuActionPhases.MENU_UPDATING));

  const response = yield axios.patch(`${GLOBAL_MENUS_URL}/${menuId}`, menuInfo);

  if (response.status !== 200) {
    return false;
  }

  return true;
}

function* menuSaveSaga({ payload }: IAction<Partial<TActionAllState>>) {
  const { actionType, menuId, menuType, menuInfo } = payload;
  if (actionType === 'new') {
    yield put(menuActions.setPhase(menuActionPhases.MENU_ADDING));
    const response = yield axios.post(`${GLOBAL_MENUS_URL}`, menuInfo);

    if (response.status !== 201) {
      yield put(menuActions.setPhase(menuActionPhases.MENU_ADDING_ERROR));
      return;
    }
  } else if (actionType === 'edit') {
    yield call(updateMenu, menuId, menuInfo);
  } else if (actionType === 'delete') {
    yield put(menuActions.setPhase(menuActionPhases.MENU_DELETING));
    const response = yield axios.delete(`${GLOBAL_MENUS_URL}/${menuId}`);

    if (response.status !== 204) {
      yield put(menuActions.setPhase(menuActionPhases.MENU_DELETING_ERROR));
      return;
    }
  }

  yield put(menuActions.pullMenus(menuType));
  yield put(menuActions.setPhase(menuActionPhases.MENU_ACTION_SUCCESSFUL));
}

function* menuMoveSaga({ payload }: IAction<Partial<TActionAllState>>) {
  yield put(menuActions.setPhase(menuActionPhases.MENU_MOVING));

  const { direction, menu, menus } = payload;

  const newPosition = direction === 'up' ? menu.position - 1 : menu.position + 1;
  const menuInNewPosition = menus.find((m) => m.position === newPosition);

  const updateMove = yield fork(updateMenu, menu.id, { position: newPosition });
  if (menuInNewPosition) {
    const updateMoveOpp = yield fork(updateMenu, menuInNewPosition?.id, {
      position: direction === 'up' ? newPosition + 1 : newPosition - 1
    });

    if (!updateMoveOpp) {
      yield put(menuActions.setPhase(menuActionPhases.MENU_UPDATING_ERROR));
      return;
    }
  }

  if (!updateMove) {
    yield put(menuActions.setPhase(menuActionPhases.MENU_UPDATING_ERROR));
    return;
  }

  yield delay(500);
  yield put(menuActions.pullMenus(menu.type));
  yield put(menuActions.setPhase(menuActionPhases.MENU_MOVING_SUCCESSFUL));
}

export function* saga() {
  yield takeLatest(menuActionTypes.MENUS_PULL, menusPullSaga);
  yield takeLatest(menuActionTypes.MENU_SAVE, menuSaveSaga);
  yield takeLatest(menuActionTypes.MENU_MOVE, menuMoveSaga);
}
