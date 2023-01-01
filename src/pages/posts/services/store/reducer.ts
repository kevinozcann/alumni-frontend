import produce from 'immer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { IAction } from 'store/store';
import { IPostsStore, postActionTypes, TPostsStoreActions } from '../types';

const initialState: IPostsStore = {
  posts: null,
  draft: null,
  nextToken: null,
  phase: null,
  error: null
};

export const reducer = persistReducer(
  { storage, key: 'posts', whitelist: ['posts', 'draft', 'phase'] },
  (state: IPostsStore = initialState, action: IAction<TPostsStoreActions>): IPostsStore => {
    switch (action.type) {
      // DELETE POST
      case postActionTypes.STORE.DELETE_POST: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.posts.findIndex((d) => d.id === post.id);
          if (index !== -1) {
            draftState.posts.splice(index, 1);
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
      // UPDATE POSTS
      case postActionTypes.STORE.UPDATE_POSTS: {
        const { posts, nextToken } = action.payload;
        return { ...state, posts: posts, nextToken };
      }
      // UPDATE POST
      case postActionTypes.STORE.UPDATE_POST: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.posts.findIndex((d) => d.id === post.id);
          if (index > -1) {
            draftState.posts[index] = post;
          } else {
            draftState.posts.unshift(post);
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
