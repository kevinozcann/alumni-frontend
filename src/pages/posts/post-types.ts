import { IUser, IUserAttributes } from 'pages/account/account-types';
import { IFile } from 'utils/shared-types';

export interface IPostComment {
  id?: number;
  comment?: string;
  owner?: IUser;
  createdAt?: Date;
}
export interface IFeedLike {
  id?: number;
  createdAt?: Date;
  createdBy?: IUser;
}
export interface IPost {
  id?: number;
  feedType?: 'Post' | string;
  title?: string;
  shortText?: string;
  content?: string;
  url?: string;
  files?: IFile[];
  likes?: IFeedLike[];
  coverPicture?: string;
  comments?: IPostComment[];
  commentsOn?: boolean;
  related?: string[];
  tags?: string[];
  user?: IUserAttributes;
  createdAt?: Date;
}
