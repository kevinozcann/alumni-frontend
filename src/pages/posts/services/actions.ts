import { IUser } from 'pages/auth/data/account-types';
import { IPost, IPostComment } from 'pages/posts/data/post-types';
import { TActionType } from 'utils/shared-types';

import { postActionTypes, TPostActionType } from './types';

export const postActions = {
  addPost: (user: IUser, post: Partial<IPost>): TPostActionType => ({
    type: postActionTypes.SAGA.ADD_POST,
    payload: { user, post }
  }),
  addComment: (user: IUser, post: IPost, comment: IPostComment): TPostActionType => ({
    type: postActionTypes.SAGA.ADD_COMMENT,
    payload: { user, post, comment }
  }),
  deletePost: (post: IPost): TPostActionType => ({
    type: postActionTypes.SAGA.DELETE_POST,
    payload: { post }
  }),
  getPosts: (user: IUser, page: number): TPostActionType => ({
    type: postActionTypes.SAGA.GET_POSTS,
    payload: { user, page }
  }),
  setPhase: (phase: string, error?: string): TPostActionType => ({
    type: postActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  }),
  updatePost: (post: IPost): TPostActionType => ({
    type: postActionTypes.SAGA.DELETE_POST,
    payload: { post }
  }),
  upsertDraft: (post: Partial<IPost>): TPostActionType => ({
    type: postActionTypes.SAGA.UPSERT_DRAFT,
    payload: { post }
  })
};
