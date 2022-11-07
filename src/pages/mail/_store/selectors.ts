import { createSelector } from 'reselect';
import objectPath from 'object-path';

import { IMail, IMailLabel, IUserMail } from 'pages/mail/mail-types';

import { IParentMailsState } from './types';

export const mailsSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'mails']),
  (mails: IUserMail[]) => mails
);
export const notificationsSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'mails']),
  (mails: IUserMail[]) =>
    mails?.filter(
      (mail) =>
        !mail.isRead && !mail.isTrashed && !mail.isDraft && (mail.isTo || mail.isCc || mail.isBcc)
    ) || []
);
export const draftSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'draft']),
  (draft: IMail) => draft
);
export const labelsSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'labels']),
  (labels: IMailLabel[]) => labels
);
export const composeSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'isCompose']),
  (isCompose: boolean) => isCompose
);
export const sidebarSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'isSidebarOpen']),
  (isSidebarOpen: boolean) => isSidebarOpen
);
export const mailsPhaseSelector = createSelector(
  (state: IParentMailsState) => objectPath.get(state, ['mails', 'phase']),
  (phase: string) => phase
);
