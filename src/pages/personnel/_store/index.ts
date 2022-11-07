import { combineReducers } from 'redux';
import { saga as personsSagas, reducer as personsReducer } from '../personnel/_store/personnel';

export const personnelSagas = [personsSagas()];
export const personnelReducer = combineReducers({
  personnel: personsReducer
});
