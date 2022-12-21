import { API, Auth } from 'aws-amplify';
import produce from 'immer';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { createPost, deletePost } from 'graphql/mutations';
import { postsByDate } from 'graphql/queries';
import { IUser } from 'pages/account/account-types';
import { IPost, IPostComment } from 'pages/posts/post-types';
import { IAction } from 'store/store';
import { TActionType, TLang } from 'utils/shared-types';

import { addComment } from './sagas/comment/addComment';

interface IPostsStoreState {
  posts: IPostsStore;
}
interface IPostsStore {
  owned: IPost[];
  all: IPost[];
  add: IPost;
  edit: IPost;
  nextToken: string;
  phase: string;
  error?: string;
}
type TPostsStoreActions = IPostsStore & {
  actionType?: TActionType;
  post?: Partial<IPost>;
  comment?: Partial<IPostComment>;
  posts?: IPost[];
  postType?: string;
  id?: number;
  lang?: TLang;
  page?: number;
  user?: IUser;
};

export type TPostActionType = IAction<Partial<TPostsStoreActions>>;

export const postActionTypes = {
  POSTS_PULL: 'posts/PULL_POSTS',
  POSTS_UPDATE: 'posts/UPDATE_POSTS',
  POSTS_SAVE: 'posts/SAVE_POSTS',
  POST_PULL: 'posts/PULL_POST',
  POST_SAVE: 'posts/SAVE_POST',
  POST_UPDATE: 'posts/UPDATE_POST',
  POST_REMOVE: 'posts/REMOVE_POST',
  STORE_POST_REMOVE: 'posts/STORE_POST_REMOVE',
  ADD_POST_UPDATE: 'posts/ADD_UPDATE_POST',
  COMMENT_ADD: 'posts/ADD_COMMENT',
  COMMENT_UPDATE: 'posts/UPDATE_COMMENT',
  COMMENT_DELETE: 'posts/DELETE_COMMENT',
  POSTS_PHASE: 'posts/PHASE'
};

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
      case postActionTypes.POSTS_UPDATE: {
        const { posts, nextToken } = action.payload;
        return { ...state, owned: posts, nextToken };
      }
      case postActionTypes.POST_UPDATE: {
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
      case postActionTypes.STORE_POST_REMOVE: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.owned.findIndex((d) => d.id === post.id);
          if (index !== -1) {
            draftState.owned.splice(index, 1);
          }
        });
      }
      case postActionTypes.ADD_POST_UPDATE: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          draftState.add = post;
        });
      }
      case postActionTypes.POSTS_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const postActions = {
  pullPosts: (user: IUser, page: number): TPostActionType => ({
    type: postActionTypes.POSTS_PULL,
    payload: { user, page }
  }),
  pullPost: (id: number): TPostActionType => ({
    type: postActionTypes.POST_PULL,
    payload: { id }
  }),
  // updatePosts: (posts: IPost[]) => ({
  //   type: postActionTypes.POSTS_UPDATE,
  //   payload: { posts }
  // }),
  savePosts: (lang: TLang, user: IUser, postType: string, posts: IPost[]): TPostActionType => ({
    type: postActionTypes.POSTS_SAVE,
    payload: { lang, user, postType, posts }
  }),
  savePost: (user: IUser, post: Partial<IPost>, actionType: TActionType): TPostActionType => ({
    type: postActionTypes.POST_SAVE,
    payload: { user, post, actionType }
  }),
  // updatePost: (post: Partial<IExtendedPost>): TPostActionType => ({
  //   type: postActionTypes.POST_UPDATE,
  //   payload: { post }
  // }),
  removePost: (post: IPost): TPostActionType => ({
    type: postActionTypes.POST_REMOVE,
    payload: { post }
  }),
  updateAddPost: (post: IPost): TPostActionType => ({
    type: postActionTypes.ADD_POST_UPDATE,
    payload: { post }
  }),
  addPostComment: (user: IUser, post: IPost, comment: IPostComment): TPostActionType => ({
    type: postActionTypes.COMMENT_ADD,
    payload: { user, post, comment }
  }),
  setPhase: (phase: string, error?: string): TPostActionType => ({
    type: postActionTypes.POSTS_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(
    postActionTypes.POSTS_PULL,
    function* postsPull({ payload }: IAction<Partial<TPostsStoreActions>>) {
      yield put(postActions.setPhase('loading'));

      const { user, page } = payload;

      try {
        const { data } = yield API.graphql({
          query: postsByDate,
          variables: { type: 'Post' },
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        });

        if (data) {
          const posts = data.postsByDate.items;
          const nextToken = data.postsByDate.nextToken;

          yield put({
            type: postActionTypes.POSTS_UPDATE,
            payload: { posts: posts, nextToken }
          });
          yield put(postActions.setPhase('success'));
        } else {
          yield put(postActions.setPhase('error', 'Error occurred!'));
        }
      } catch (error) {
        yield put(postActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    postActionTypes.POST_REMOVE,
    function* postRemove({ payload }: IAction<Partial<TPostsStoreActions>>) {
      yield put(postActions.setPhase('deleting'));

      const { post } = payload;

      try {
        const { data } = yield API.graphql({
          query: deletePost,
          variables: { input: { id: post.id } },
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        });

        if (data) {
          yield put({
            type: postActionTypes.STORE_POST_REMOVE,
            payload: { post: post }
          });
          yield put(postActions.setPhase('success'));
        } else {
          yield put(postActions.setPhase('error', 'Error occurred!'));
        }
      } catch (error) {
        yield put(postActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    postActionTypes.POST_SAVE,
    function* postSave({ payload }: IAction<Partial<TPostsStoreActions>>) {
      const { user, post, actionType } = payload;

      console.log('payload:', payload);

      if (actionType === 'add') {
        yield put(postActions.setPhase('adding'));

        const { username } = yield Auth.currentAuthenticatedUser();
        const date = new Date();

        try {
          const { data } = yield API.graphql({
            query: createPost,
            variables: {
              input: {
                type: 'Post',
                title: post.title,
                content: post.content,
                userPostsId: username,
                createdAt: date.toISOString()
              }
            },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
          });

          if (data) {
            yield put({
              type: postActionTypes.POST_UPDATE,
              payload: { post: data.createPost }
            });
            yield put(postActions.setPhase('success'));
          } else {
            yield put(postActions.setPhase('error', 'Error occurred!'));
          }
        } catch (error) {
          yield put(postActions.setPhase('error', error));
        }
      } else if (actionType === 'delete') {
        yield put(postActions.setPhase('deleting'));

        // const { status } = yield axios.delete(`${POSTS_API_URL}/${post.id}`);

        // if (status !== 204) {
        //   yield put(postActions.setPhase('error'));
        //   return;
        // }

        yield put(postActions.removePost(post));
      } else if (actionType === 'like') {
        yield put(postActions.setPhase('updating'));

        // const { status } = yield axios.post(`${LIKES_API_URL}`, {
        //   createdBy: user['@id'],
        //   post: `/api/posts/${post.id}`
        // });

        // if (status !== 201) {
        //   yield put(postActions.setPhase('error'));
        //   return;
        // }
      } else if (actionType === 'unlike') {
        // const { likes } = post;
        // const mine = likes.filter((like) => like.createdBy.isMe);
        // if (mine.length > 0) {
        //   const { status } = yield axios.delete(`${LIKES_API_URL}/${mine[0].id}`);
        //   if (status !== 204) {
        //     yield put(postActions.setPhase('error'));
        //     return;
        //   }
        // }
      } else if (actionType === 'update-comment') {
        // yield put(postActions.setPhase('updating'));
        // // post has comment data here
        // const { status } = yield axios.patch(`${COMMENTS_API_URL}/${post.commentId}`, {
        //   comment: post.comment
        // });
        // if (status !== 200) {
        //   yield put(postActions.setPhase('error'));
        //   return;
        // }
      } else if (actionType === 'delete-comment') {
        // yield put(postActions.setPhase('deleting'));
        // // post has comment data here
        // const { status } = yield axios.delete(`${COMMENTS_API_URL}/${post.commentId}`);
        // if (status !== 204) {
        //   yield put(postActions.setPhase('error'));
        //   return;
        // }
        // yield put(postActions.pullPost(post.feedId));
      }

      yield put(postActions.setPhase('success'));
    }
  );

  yield takeLatest(postActionTypes.COMMENT_ADD, addComment);
}
