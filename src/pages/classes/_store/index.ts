import { combineReducers } from 'redux';
import {
  saga as classsesSagas,
  reducer as classsesReducer
} from 'pages/classes/classes/_store/classes';
import {
  saga as onlineClassesSagas,
  reducer as onlineClassesReducer
} from 'pages/classes/online/_store/onlineClasses';
import {
  saga as classTypesSagas,
  reducer as classTypesReducer
} from 'pages/classes/types/_store/classTypes';

export const classesSagas = [classsesSagas(), onlineClassesSagas(), classTypesSagas()];
export const classesReducer = combineReducers({
  classes: classsesReducer,
  online: onlineClassesReducer,
  types: classTypesReducer
});
