import { IAuthUser } from 'pages/auth/data/account-types';
import { IPost, IComment } from 'pages/posts/data/post-types';
import { IUser } from 'pages/profile/data/user-types';
import { TPhase } from 'store/store';

import { postActionTypes, TPostActionType } from './types';

export const postActions = {
  addPost: (user: IUser, post: Partial<IPost>): TPostActionType => ({
    type: postActionTypes.SAGA.ADD_POST,
    payload: { user, post }
  }),
  addComment: (user: IUser, post: IPost, comment: IComment): TPostActionType => ({
    type: postActionTypes.SAGA.ADD_COMMENT,
    payload: { user, post, comment }
  }),
  deletePost: (post: IPost): TPostActionType => ({
    type: postActionTypes.SAGA.DELETE_POST,
    payload: { post }
  }),
  deleteComment: (post: IPost, comment: IComment): TPostActionType => ({
    type: postActionTypes.SAGA.DELETE_COMMENT,
    payload: { post, comment }
  }),
  getPosts: (user: IAuthUser, page: number): TPostActionType => ({
    type: postActionTypes.SAGA.GET_POSTS,
    payload: { user, page }
  }),
  setPhase: (phase: TPhase, error?: string): TPostActionType => ({
    type: postActionTypes.SAGA.UPDATE_PHASE,
    payload: { phase, error }
  }),
  updatePost: (post: IPost): TPostActionType => ({
    type: postActionTypes.SAGA.UPDATE_POST,
    payload: { post }
  }),
  updateComment: (post: IPost, comment: IComment): TPostActionType => ({
    type: postActionTypes.SAGA.UPDATE_COMMENT,
    payload: { post, comment }
  }),
  upsertDraft: (post: Partial<IPost>): TPostActionType => ({
    type: postActionTypes.SAGA.UPSERT_DRAFT,
    payload: { post }
  })
};
