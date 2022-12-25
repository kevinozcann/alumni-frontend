import { TActionType } from 'utils/shared-types';
import { IAuthUser } from 'pages/auth/data/account-types';
import { IUserMail, IMail } from 'pages/mail/mail-types';

import { IAction } from 'store/store';

import { TActionAllState } from './types';
import { actionTypes } from './actionTypes';

export const mailActions = {
  pullMails: (user: IAuthUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_MAILS_FROM_SERVER,
    payload: { user }
  }),
  sendMail: (email: IMail, isReply: boolean): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SEND_MAIL,
    payload: { email, isReply }
  }),
  updateMail: (
    mailId: number,
    mailInfo: Partial<IUserMail>,
    actionType: TActionType
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_MAIL_IN_SERVER,
    payload: { mailId, mailInfo, actionType }
  }),
  updateDraft: (email: IMail): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_DRAFT_THROTTLE,
    payload: { email }
  }),
  updateCompose: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_COMPOSE
  }),
  updateSidebar: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_SIDEBAR
  }),
  setPhase: (phase: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_PHASE,
    payload: { phase }
  })
};
