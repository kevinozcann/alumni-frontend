import * as posts from './posts';

export const postsSagas = [posts.saga()];
export const postsReducer = posts.reducer;
