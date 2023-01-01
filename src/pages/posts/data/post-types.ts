import { IUser } from 'pages/profile/data/user-types';
import { IFile } from 'utils/shared-types';

export interface IPost {
  id?: string;
  type?: 'Post';
  content?: string;
  url?: string;
  files?: IFile[];
  likes?: IPostLike[];
  coverPicture?: string;
  comments?: IPostComment;
  commentsOn?: boolean;
  related?: string[];
  tags?: string[];
  userID?: string;
  user?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
}
export interface IPostComment {
  items?: IComment[];
  nextToken?: string;
}
export interface IComment {
  id?: number;
  content: string;
  user?: IUser;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface IPostLike {
  id?: number;
  createdAt?: Date;
  createdBy?: IUser;
}
