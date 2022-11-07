import { combineReducers } from 'redux';

import * as menus from './menus/_store/menus';

export const globalSagas = [menus.saga()];

export const globalReducer = combineReducers({
  globalMenus: menus.reducer
});
