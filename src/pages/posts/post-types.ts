import { IUser } from '../account/account-types';
import { IFile } from '../../utils/shared-types';

export interface IPostComment {
  id?: number;
  comment?: string;
  createdAt?: Date;
  createdBy?: IUser;
}
export interface IFeedLike {
  id?: number;
  createdAt?: Date;
  createdBy?: IUser;
}
export interface IPost {
  comments?: IPostComment[];
  commentsOn?: boolean;
  content?: string;
  coverPicture?: string;
  feedType?: 'post' | string;
  files?: IFile[];
  id?: number;
  likes?: IFeedLike[];
  postedAt?: Date;
  poster?: IUser;
  related?: string[];
  shortText?: string;
  tags?: string[];
  title?: string;
  url?: string;
}
