import axios from 'axios';
import { delay, put } from 'redux-saga/effects';

import { IAction } from 'store/store';
import { MAILS_API_URL } from 'store/ApiUrls';

import { phases } from '../phases';
import { TActionAllState } from '../types';
import { mailActions } from '../mailActions';
import { actionTypes } from '../actionTypes';

export function* pullEMails({ payload }: IAction<Partial<TActionAllState>>) {
  let factor = 1;

  while (true) {
    yield put(mailActions.setPhase(phases.MAILS_PULLING));

    const { user } = payload;
    const response = yield axios.get(
      `${MAILS_API_URL}.json?user=${user.id}&order%5Bemail.sentAt%5D=desc&pagination=false`
    );

    console.log(response);

    if (response.status !== 200) {
      yield put(mailActions.setPhase(phases.MAILS_PULLING_ERROR));
    } else {
      yield put({
        type: actionTypes.UPDATE_MAILS_IN_STORE,
        payload: { mails: response.data }
      });
      yield put(mailActions.setPhase(phases.MAILS_PULLING_SUCCESSFUL));
    }

    // Add a delay here so we can continuously pull emails behind the scene
    // use an increasing delay so that if the user is not active keep updating infrequently
    yield delay(factor * 30 * 1000);

    // Reset the factor after every 100 increment
    factor = factor > 100 ? 1 : factor + 1;
  }
}
