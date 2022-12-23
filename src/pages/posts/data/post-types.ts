import { IUser } from 'pages/auth/data/account-types';
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
  id?: string;
  type?: 'Post';
  content?: string;
  url?: string;
  files?: IFile[];
  likes?: IFeedLike[];
  coverPicture?: string;
  comments?: IPostComment[];
  commentsOn?: boolean;
  related?: string[];
  tags?: string[];
  userID?: string;
  user?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
}
