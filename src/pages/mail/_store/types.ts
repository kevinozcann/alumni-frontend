import { TActionType, TLang } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';
import { IMail, IMailLabel, IUserMail } from 'pages/mail/mail-types';

import labels from './labels';

export interface IMailsState {
  mails: IUserMail[];
  draft: IMail;
  labels: IMailLabel[];
  isCompose?: boolean;
  isSidebarOpen?: boolean;
  phase?: string;
}

export interface IParentMailsState {
  mails: IMailsState;
}

export type TActionAllState = IMailsState & {
  user?: IUser;
  email?: IMail;
  mail?: IUserMail;
  lang?: TLang;
  mailType?: string;
  mailId?: number;
  mailInfo?: Partial<IUserMail>;
  actionType?: TActionType;
  isReply?: boolean;
};

export const initialState: IMailsState = {
  mails: null,
  draft: null,
  labels: labels,
  isCompose: false,
  isSidebarOpen: true,
  phase: null
};
