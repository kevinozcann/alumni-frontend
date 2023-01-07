import produce from 'immer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { IAction } from 'store/store';
import { IPostsStore, postActionTypes, TPostsStoreActions } from '../types';

const initialState: IPostsStore = {
  items: null,
  draft: null,
  nextToken: null,
  phase: null,
  error: null
};

export const reducer = persistReducer(
  { storage, key: 'posts', whitelist: ['items', 'draft', 'phase'] },
  (state: IPostsStore = initialState, action: IAction<TPostsStoreActions>): IPostsStore => {
    switch (action.type) {
      // DELETE POST
      case postActionTypes.STORE.DELETE_POST: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const postIndex = draftState.items.findIndex((d) => d.id === post.id);
          if (postIndex > -1) {
            draftState.items.splice(postIndex, 1);
          }
        });
      }
      // DELETE COMMENT
      case postActionTypes.STORE.DELETE_COMMENT: {
        const { post, comment } = action.payload;
        return produce(state, (draftState) => {
          const postIndex = draftState.items.findIndex((p) => p.id === post.id);
          if (postIndex > -1) {
            const commentIndex = draftState.items[postIndex].comments.items.findIndex(
              (c) => c.id === comment.id
            );
            if (commentIndex > -1) {
              draftState.items[postIndex].comments.items.splice(commentIndex, 1);
            }
          }
        });
      }
      // UPSERT DRAFT
      case postActionTypes.STORE.UPSERT_DRAFT: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          draftState.draft = post;
        });
      }
      // UPDATE COMMENT
      case postActionTypes.STORE.UPDATE_COMMENT: {
        const { post, comment } = action.payload;
        return produce(state, (draftState) => {
          const postIndex = draftState.items.findIndex((p) => p.id === post.id);
          if (postIndex > -1) {
            const commentIndex = draftState.items[postIndex].comments.items.findIndex(
              (c) => c.id === comment.id
            );
            if (commentIndex > -1) {
              draftState.items[postIndex].comments.items[commentIndex].content = comment.content;
            }
          }
        });
      }
      // UPDATE POSTS
      case postActionTypes.STORE.UPDATE_POSTS: {
        const { posts, nextToken } = action.payload;
        return { ...state, items: posts, nextToken };
      }
      // UPDATE POST
      case postActionTypes.STORE.UPDATE_POST: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const postIndex = draftState.items.findIndex((p) => p.id === post.id);
          if (postIndex > -1) {
            draftState.items[postIndex] = post;
          } else {
            draftState.items.unshift(post);
          }
        });
      }
      // UPDATE PHASE
      case postActionTypes.STORE.UPDATE_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);
