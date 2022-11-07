import { reducers } from './reducers';
import { sagas } from './sagas';
import { mailActions } from './mailActions';
import { actionTypes } from './actionTypes';
import { phases } from './phases';

const mailReducer = reducers;
const mailSagas = [sagas()];

export { mailReducer, mailSagas, mailActions, actionTypes, phases };
