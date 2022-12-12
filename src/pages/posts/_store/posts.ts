import { API, Auth } from 'aws-amplify';
import produce from 'immer';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { createPost } from 'graphql/mutations';
import { listPosts } from 'graphql/queries';
import { IUser } from 'pages/account/account-types';
import { IPost } from 'pages/posts/post-types';
import { IAction } from 'store/store';
import { TActionType, TLang } from 'utils/shared-types';

export interface IExtendedPost extends IPost {
  commentId?: number;
  comment?: string;
  feedId?: number;
}
interface IPostsState {
  owned: IPost[];
  all: IPost[];
  add: IPost;
  edit: IPost;
  nextToken: string;
  phase: string;
  error?: string;
}
interface IParentPostsState {
  posts: IPostsState;
}
type TActionAllState = IPostsState & {
  actionType?: TActionType;
  post?: Partial<IExtendedPost>;
  posts?: IPost[];
  feedType?: string;
  id?: number;
  lang?: TLang;
  page?: number;
  user?: IUser;
};

export const feedActionTypes = {
  POSTS_PULL: 'posts/PULL_POSTS',
  POSTS_UPDATE: 'posts/UPDATE_POSTS',
  POSTS_SAVE: 'posts/SAVE_POSTS',
  POST_PULL: 'posts/PULL_POST',
  POST_SAVE: 'posts/SAVE_POST',
  POST_UPDATE: 'posts/UPDATE_POST',
  POST_REMOVE: 'posts/REMOVE_POST',
  ADD_POST_UPDATE: 'posts/ADD_UPDATE_POST',
  POSTS_PHASE: 'posts/PHASE'
};

const initialState: IPostsState = {
  owned: null,
  all: null,
  add: null,
  edit: null,
  nextToken: null,
  phase: null,
  error: null
};

export const postsOwnedSelector = createSelector(
  (state: IParentPostsState) => objectPath.get(state, ['posts', 'owned']),
  (posts: IPost[]) => posts
);

export const postsAddSelector = createSelector(
  (state: IParentPostsState) => objectPath.get(state, ['posts', 'add']),
  (post: IPost) => post
);

export const postsPhaseSelector = createSelector(
  (state: IParentPostsState) => objectPath.get(state, ['posts', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'posts', whitelist: ['owned', 'all', 'add', 'edit', 'phase'] },
  (state: IPostsState = initialState, action: IAction<TActionAllState>): IPostsState => {
    switch (action.type) {
      case feedActionTypes.POSTS_UPDATE: {
        const { posts, nextToken } = action.payload;
        return { ...state, owned: posts, nextToken };
      }
      case feedActionTypes.POST_UPDATE: {
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
      case feedActionTypes.POST_REMOVE: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.owned.findIndex((d) => d.id === post.id);
          if (index !== -1) {
            draftState.owned.splice(index, 1);
          }
        });
      }
      case feedActionTypes.ADD_POST_UPDATE: {
        const { post } = action.payload;
        return produce(state, (draftState) => {
          draftState.add = post;
        });
      }
      case feedActionTypes.POSTS_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const postActions = {
  pullPosts: (user: IUser, page: number): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.POSTS_PULL,
    payload: { user, page }
  }),
  pullPost: (id: number): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.POST_PULL,
    payload: { id }
  }),
  // updatePosts: (posts: IPost[]) => ({
  //   type: feedActionTypes.POSTS_UPDATE,
  //   payload: { posts }
  // }),
  savePosts: (
    lang: TLang,
    user: IUser,
    feedType: string,
    posts: IPost[]
  ): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.POSTS_SAVE,
    payload: { lang, user, feedType, posts }
  }),
  savePost: (
    user: IUser,
    post: Partial<IExtendedPost>,
    actionType: TActionType
  ): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.POST_SAVE,
    payload: { user, post, actionType }
  }),
  // updatePost: (post: Partial<IExtendedPost>): IAction<Partial<TActionAllState>> => ({
  //   type: feedActionTypes.POST_UPDATE,
  //   payload: { post }
  // }),
  removePost: (post: IPost): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.POST_REMOVE,
    payload: { post }
  }),
  updateAddPost: (post: IPost): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.ADD_POST_UPDATE,
    payload: { post }
  }),
  setPhase: (phase: string, error?: string): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.POSTS_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(
    feedActionTypes.POSTS_PULL,
    function* postsPull({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(postActions.setPhase('loading'));

      const { user, page } = payload;

      try {
        const { data } = yield API.graphql({
          query: listPosts,
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        });

        if (data) {
          const posts = data.listPosts.items;
          const nextToken = data.listPosts.nextToken;

          console.log(posts);
          yield put({
            type: feedActionTypes.POSTS_UPDATE,
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
    feedActionTypes.POST_PULL,
    function* postsPull({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(postActions.setPhase('updating'));

      // const { id } = payload;
      // const { status, data } = yield axios.get(`${POSTS_API_URL}/${id}.jsonld`);

      // if (status !== 200) {
      //   yield put(postActions.setPhase('error'));
      //   return;
      // }

      // // yield put(postActions.updatePost(data));
      // yield put(postActions.setPhase('success'));
    }
  );

  yield takeLatest(
    feedActionTypes.POST_SAVE,
    function* feedSave({ payload }: IAction<Partial<TActionAllState>>) {
      const { user, post, actionType } = payload;

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
              type: feedActionTypes.POST_UPDATE,
              payload: { post: data.createPost }
            });
            yield put(postActions.setPhase('success'));
          } else {
            yield put(postActions.setPhase('error', 'Error occurred!'));
          }
        } catch (error) {
          yield put(postActions.setPhase('error', error));
        }

        // const { status, data } = yield axios.post(`${POSTS_API_URL}`, {
        //   commentsOn: post.commentsOn,
        //   content: post.content,
        //   coverPicture: post.coverPicture,
        //   feedType: post.feedType,
        //   files: post.files,
        //   poster: user['@id'],
        //   related: post.related,
        //   shortText: post.shortText,
        //   tags: post.tags,
        //   title: post.title,
        //   url: post.url
        // });
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
      } else if (actionType === 'add-comment') {
        // yield put(postActions.setPhase('updating'));
        // // post is coming as { feedId: post.id, comment: value }
        // const { status } = yield axios.post(`${COMMENTS_API_URL}`, {
        //   createdBy: user['@id'],
        //   post: `/api/posts/${post.feedId}`,
        //   comment: post.comment
        // });
        // if (status !== 201) {
        //   yield put(postActions.setPhase('error'));
        //   return;
        // }
        // yield put(postActions.pullPost(post.feedId));
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
}
