import { put } from 'redux-saga/effects';

import { userActions } from '../../actions';
import { TUserActionType, userActionTypes } from '../../types';

export function* setActiveSeason({ payload }: TUserActionType) {
  yield put(userActions.setPhase('active-season-updating', null));

  const { activeSeason } = payload;
  yield put({
    type: userActionTypes.USER_UPDATE_ACTIVE_SEASON,
    payload: { activeSeason }
  });
}
