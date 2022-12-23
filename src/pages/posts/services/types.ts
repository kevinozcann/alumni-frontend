import { IUser } from 'pages/account/account-types';
import { IAction } from 'store/store';
import { TActionType, TLang } from 'utils/shared-types';

import { IPost, IPostComment } from '../data/post-types';

export const postActionTypes = {
  SAGA: {
    ADD_POST: 'posts/saga/ADD_POST',
    ADD_COMMENT: 'posts/saga/ADD_COMMENT',
    DELETE_POST: 'posts/saga/DELETE_POST',
    DELETE_COMMENT: 'posts/saga/DELETE_COMMENT',
    GET_POSTS: 'posts/saga/GET_POSTS',
    UPDATE_COMMENT: 'posts/saga/UPDATE_COMMENT',
    UPDATE_PHASE: 'posts/saga/UPDATE_PHASE',
    UPDATE_POST_IMAGES: 'posts/saga/UPDATE_POST_IMAGES',
    UPSERT_DRAFT: 'posts/saga/UPSERT_DRAFT'
  },
  STORE: {
    DELETE_POST: 'posts/store/DELETE_POST',
    UPDATE_PHASE: 'posts/store/UPDATE_PHASE',
    UPDATE_POST: 'posts/store/UPDATE_POST',
    UPDATE_POSTS: 'posts/store/UPDATE_POSTS',
    UPSERT_DRAFT: 'posts/store/UPSERT_DRAFT'
  }
};

export interface IPostsStoreState {
  posts: IPostsStore;
}
export interface IPostsStore {
  owned: IPost[];
  all: IPost[];
  add: IPost;
  edit: IPost;
  nextToken: string;
  phase: string;
  error?: string;
}
export type TPostsStoreActions = IPostsStore & {
  actionType?: TActionType;
  post?: Partial<IPost>;
  comment?: Partial<IPostComment>;
  posts?: IPost[];
  postType?: string;
  id?: number;
  lang?: TLang;
  page?: number;
  user?: IUser;
};

export type TPostActionType = IAction<Partial<TPostsStoreActions>>;
