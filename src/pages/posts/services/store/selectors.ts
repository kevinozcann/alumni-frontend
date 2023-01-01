import objectPath from 'object-path';
import { createSelector } from 'reselect';

import { IPost } from 'pages/posts/data/post-types';
import { IPostsStoreState } from '../types';

export const postsPostsSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'posts']),
  (posts: IPost[]) => posts
);

export const postsDraftSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'draft']),
  (post: IPost) => post
);

export const postsPhaseSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'phase']),
  (phase: string) => phase
);
