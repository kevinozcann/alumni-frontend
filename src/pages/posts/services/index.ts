import { reducer } from './posts';
import { sagas } from './sagas';

export const postsSagas = [sagas()];
export const postsReducer = reducer;
