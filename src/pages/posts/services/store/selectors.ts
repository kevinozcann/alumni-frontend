import objectPath from 'object-path';
import { createSelector } from 'reselect';

import { IPost } from 'pages/posts/data/post-types';
import { IPostsStoreState } from '../types';

export const postsItemsSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'items']),
  (items: IPost[]) => items
);

export const postsDraftSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'draft']),
  (post: IPost) => post
);

export const postsPhaseSelector = createSelector(
  (state: IPostsStoreState) => objectPath.get(state, ['posts', 'phase']),
  (phase: string) => phase
);
