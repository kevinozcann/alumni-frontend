import { IUser, IUserAttributes } from 'pages/account/account-types';
import { IFile } from 'utils/shared-types';

export interface IPostComment {
  id?: number;
  content?: string;
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
  postType?: 'Post' | string;
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
