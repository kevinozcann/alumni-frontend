import { fork, put } from 'redux-saga/effects';
import axios from 'axios';

import { IAction } from 'store/store';
import { MAILS_API_URL } from 'store/ApiUrls';

import { phases } from '../phases';
import { TActionAllState } from '../types';
import { mailActions } from '../mailActions';
import { actionTypes } from '../actionTypes';
import { sendEmail } from './sendEmail';

export function* sendEMails({ payload }: IAction<Partial<TActionAllState>>) {
  yield put(mailActions.setPhase(phases.MAIL_SENDING));

  const { email, isReply } = payload;
  const { to, cc, bcc } = email;

  // Add to the users account first so we can get the email created
  const postBody = {
    email: {
      attachment: email.attachment,
      subject: email.subject,
      msgBody: email.msgBody,
      sender: `/api/users/${email.sender.uuid}`
    },
    user: `/api/users/${email.sender.uuid}`,
    isSender: true,
    isTo: false,
    isCc: false,
    isBcc: false,
    isRead: true
  };
  const { status, data } = yield axios.post(`${MAILS_API_URL}`, postBody);

  if (status !== 201) {
    yield put(mailActions.setPhase(phases.MAIL_SENDING_ERROR));
    return;
  }
  // Send the email for others
  const {
    email: { id }
  } = data;
  const emailId = `/api/emails/${id}`;

  // Send email to to list
  for (let i = 0; i < to.length; i++) {
    const toId = `/api/users/${to[i]['uuid']}`;
    yield fork(sendEmail, emailId, toId, true, false, false);
  }

  // Send email to cc list
  for (let i = 0; i < cc.length; i++) {
    const ccId = `/api/users/${cc[i]['uuid']}`;
    yield fork(sendEmail, emailId, ccId, false, true, false);
  }

  // Send email to bcc list
  for (let i = 0; i < bcc.length; i++) {
    const bccId = `/api/users/${bcc[i]['uuid']}`;
    yield fork(sendEmail, emailId, bccId, false, false, true);
  }

  // Delete draft from the store
  if (!isReply) {
    yield put({ type: actionTypes.DELETE_DRAFT_IN_STORE });
    yield put({ type: actionTypes.UPDATE_COMPOSE });
  }

  yield put(mailActions.setPhase(phases.MAIL_SENDING_SUCCESSFUL));
}
