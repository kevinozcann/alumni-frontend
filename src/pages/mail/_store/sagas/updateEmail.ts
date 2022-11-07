import { put } from 'redux-saga/effects';
import axios from 'axios';

import { IAction } from 'store/store';
import { MAILS_API_URL } from 'store/ApiUrls';

import { phases } from '../phases';
import { TActionAllState } from '../types';
import { actionTypes } from '../actionTypes';
import { mailActions } from '../mailActions';

export function* updateEmail({ payload }: IAction<Partial<TActionAllState>>) {
  yield put(mailActions.setPhase(phases.MAIL_UPDATING));

  const { mailId, mailInfo, actionType } = payload;

  if (actionType === 'update') {
    const response = yield axios.patch(`${MAILS_API_URL}/${mailId}`, mailInfo);

    if (response.status !== 200) {
      yield put(mailActions.setPhase(phases.MAIL_UPDATING_ERROR));
      return;
    }

    yield put({ type: actionTypes.UPDATE_MAIL_IN_STORE, payload: { mail: response.data } });
  } else {
    // Pull email
    const response = yield axios.get(`${MAILS_API_URL}/${mailId}.jsonld`);

    if (response.status !== 200) {
      yield put(mailActions.setPhase(phases.MAIL_UPDATING_ERROR));
      return;
    }

    yield put({ type: actionTypes.UPDATE_MAIL_IN_STORE, payload: { mail: response.data } });
  }

  yield put(mailActions.setPhase(phases.MAIL_UPDATING_SUCCESSFUL));
}
