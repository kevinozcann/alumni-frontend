import produce from 'immer';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { IPost } from 'pages/posts/data/post-types';
import { IAction } from 'store/store';
import { IPostsStore, IPostsStoreState, postActionTypes, TPostsStoreActions } from './types';

const initialState: IPostsStore = {
  owned: null,
  all: null,
  add: null,
  edit: null,
  nextToken: null,
  phase: null,
  error: null
};

export const postsOwnedSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'owned']),
  (posts: IPost[]) => posts
);

export const postsAddSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'add']),
  (post: IPost) => post
);

export const postsPhaseSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'posts', whitelist: ['owned', 'all', 'add', 'edit', 'phase'] },
  (state: IPostsStore = initialState, action: IAction<TPostsStoreActions>): IPostsStore => {
    switch (action.type) {
      case postActionTypes.STORE.UPDATE_POSTS: {
        const { posts, nextToken } = action.payload;
        return { ...state, owned: posts, nextToken };
      }
      case postActionTypes.STORE.UPDATE_POST: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.owned.findIndex((d) => d.id === post.id);
          if (index > -1) {
            draftState.owned[index] = post;
          } else {
            draftState.owned.unshift(post);
          }
        });
      }
      case postActionTypes.STORE.DELETE_POST: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.owned.findIndex((d) => d.id === post.id);
          if (index !== -1) {
            draftState.owned.splice(index, 1);
          }
        });
      }
      case postActionTypes.STORE.UPDATE_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);
