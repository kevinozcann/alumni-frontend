import * as feeds from './feeds';

export const feedsSagas = [feeds.saga()];
export const feedsReducer = feeds.reducer;
