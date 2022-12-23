import { IUser } from 'pages/auth/data/account-types';

export interface IMailLabel {
  id: string;
  type: string;
  name: string;
  unreadCount?: number;
  totalCount?: number;
}
export interface IMail {
  id?: number;
  subject: string;
  msgBody?: string;
  attachment?: string | string[];
  user?: Partial<IUser>; // for backward compatibiliy. we might remove later
  sender?: Partial<IUser>;
  to?: Partial<IUser>[];
  cc?: Partial<IUser>[];
  bcc?: Partial<IUser>[];
  sentAt?: Date;
  emailToUser?: Partial<IUser>;
}
export interface IUserMail {
  id?: number;
  email: Partial<IMail>;
  user?: Partial<IUser>;
  isSender?: boolean;
  isTo?: boolean;
  isCc?: boolean;
  isBcc?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  isTrashed?: boolean;
  isDraft?: boolean;
}
