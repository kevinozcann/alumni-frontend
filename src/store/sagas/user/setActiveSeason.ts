import { put } from 'redux-saga/effects';

import { actionTypes, TActionType, userActions } from 'store/user';

export function* setActiveSeason({ payload }: TActionType) {
  yield put(userActions.setPhase('active-season-updating', null));

  const { activeSeason } = payload;
  yield put({
    type: actionTypes.USER_UPDATE_ACTIVE_SEASON,
    payload: { activeSeason }
  });
}
