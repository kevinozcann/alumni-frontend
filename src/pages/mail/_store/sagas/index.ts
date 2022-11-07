import { takeLatest, throttle } from 'redux-saga/effects';

import { actionTypes } from 'pages/mail/_store/actionTypes';

import { sendEMails } from './sendEMails';
import { pullEMails } from './pullEMails';
import { updateDraftEmail } from './updateDraftEmail';
import { updateEmail } from './updateEmail';

export function* sagas() {
  yield takeLatest(actionTypes.PULL_MAILS_FROM_SERVER, pullEMails);

  yield takeLatest(actionTypes.SEND_MAIL, sendEMails);

  yield throttle(2000, actionTypes.UPDATE_DRAFT_THROTTLE, updateDraftEmail);

  yield takeLatest(actionTypes.UPDATE_MAIL_IN_SERVER, updateEmail);
}
