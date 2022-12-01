import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';
import produce from 'immer';
import { API, graphqlOperation } from 'aws-amplify';

import { COMMENTS_API_URL, FEEDS_API_URL, LIKES_API_URL } from 'store/ApiUrls';
import { IFeed } from 'pages/feeds/feed-types';
import { IAction } from 'store/store';
import { IUser } from 'pages/account/account-types';
import { TLang, TActionType } from 'utils/shared-types';
import { listPosts } from 'graphql/queries';
import { createPost } from 'graphql/mutations';

export interface IExtendedFeed extends IFeed {
  commentId?: number;
  comment?: string;
  feedId?: number;
}
interface IFeedsState {
  owned: IFeed[];
  all: IFeed[];
  add: IFeed;
  edit: IFeed;
  nextToken: string;
  phase: string;
  error?: string;
}
interface IParentFeedsState {
  feeds: IFeedsState;
}
type TActionAllState = IFeedsState & {
  actionType?: TActionType;
  feed?: Partial<IExtendedFeed>;
  feeds?: IFeed[];
  feedType?: string;
  id?: number;
  lang?: TLang;
  page?: number;
  user?: IUser;
};

export const feedActionTypes = {
  FEEDS_PULL: 'FEEDS_PULL',
  FEEDS_UPDATE: 'FEEDS_UPDATE',
  FEEDS_SAVE: 'FEEDS_SAVE',
  FEED_PULL: 'FEED_PULL',
  FEED_SAVE: 'FEED_SAVE',
  FEED_UPDATE: 'FEED_UPDATE',
  FEED_REMOVE: 'FEED_REMOVE',
  ADD_FEED_UPDATE: 'ADD_FEED_UPDATE',
  FEEDS_PHASE: 'FEEDS_PHASE'
};

const initialState: IFeedsState = {
  owned: null,
  all: null,
  add: null,
  edit: null,
  nextToken: null,
  phase: null,
  error: null
};

export const feedsOwnedSelector = createSelector(
  (state: IParentFeedsState) => objectPath.get(state, ['feeds', 'owned']),
  (feeds: IFeed[]) => feeds
);

export const feedsAddSelector = createSelector(
  (state: IParentFeedsState) => objectPath.get(state, ['feeds', 'add']),
  (feed: IFeed) => feed
);

export const feedsPhaseSelector = createSelector(
  (state: IParentFeedsState) => objectPath.get(state, ['feeds', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'feeds', whitelist: ['owned', 'all', 'add', 'edit', 'phase'] },
  (state: IFeedsState = initialState, action: IAction<TActionAllState>): IFeedsState => {
    switch (action.type) {
      case feedActionTypes.FEEDS_UPDATE: {
        const { feeds, nextToken } = action.payload;
        return { ...state, owned: feeds, nextToken };
      }
      case feedActionTypes.FEED_UPDATE: {
        const { feed } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.owned.findIndex((d) => d.id === feed.id);
          if (index > -1) {
            draftState.owned[index] = feed;
          } else {
            draftState.owned.unshift(feed);
          }
        });
      }
      case feedActionTypes.FEED_REMOVE: {
        const { feed } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.owned.findIndex((d) => d.id === feed.id);
          if (index !== -1) {
            draftState.owned.splice(index, 1);
          }
        });
      }
      case feedActionTypes.ADD_FEED_UPDATE: {
        const { feed } = action.payload;
        return produce(state, (draftState) => {
          draftState.add = feed;
        });
      }
      case feedActionTypes.FEEDS_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const feedActions = {
  pullFeeds: (user: IUser, page: number): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.FEEDS_PULL,
    payload: { user, page }
  }),
  pullFeed: (id: number): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.FEED_PULL,
    payload: { id }
  }),
  // updateFeeds: (feeds: IFeed[]) => ({
  //   type: feedActionTypes.FEEDS_UPDATE,
  //   payload: { feeds }
  // }),
  saveFeeds: (
    lang: TLang,
    user: IUser,
    feedType: string,
    feeds: IFeed[]
  ): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.FEEDS_SAVE,
    payload: { lang, user, feedType, feeds }
  }),
  saveFeed: (
    user: IUser,
    feed: Partial<IExtendedFeed>,
    actionType: TActionType
  ): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.FEED_SAVE,
    payload: { user, feed, actionType }
  }),
  // updateFeed: (feed: Partial<IExtendedFeed>): IAction<Partial<TActionAllState>> => ({
  //   type: feedActionTypes.FEED_UPDATE,
  //   payload: { feed }
  // }),
  removeFeed: (feed: IFeed): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.FEED_REMOVE,
    payload: { feed }
  }),
  updateAddFeed: (feed: IFeed): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.ADD_FEED_UPDATE,
    payload: { feed }
  }),
  setPhase: (phase: string, error?: string): IAction<Partial<TActionAllState>> => ({
    type: feedActionTypes.FEEDS_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(
    feedActionTypes.FEEDS_PULL,
    function* feedsPullSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(feedActions.setPhase('loading'));

      const { user, page } = payload;

      try {
        const { data } = yield API.graphql({ query: listPosts });

        if (data) {
          const posts = data.listPosts.items;
          const nextToken = data.listPosts.nextToken;

          console.log(posts);
          yield put({
            type: feedActionTypes.FEEDS_UPDATE,
            payload: { feeds: posts, nextToken }
          });
          yield put(feedActions.setPhase('success'));
        } else {
          yield put(feedActions.setPhase('error', 'Error occurred!'));
        }
      } catch (error) {
        yield put(feedActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    feedActionTypes.FEED_PULL,
    function* feedsPullSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(feedActions.setPhase('updating'));

      const { id } = payload;
      const { status, data } = yield axios.get(`${FEEDS_API_URL}/${id}.jsonld`);

      if (status !== 200) {
        yield put(feedActions.setPhase('error'));
        return;
      }

      // yield put(feedActions.updateFeed(data));
      yield put(feedActions.setPhase('success'));
    }
  );

  yield takeLatest(
    feedActionTypes.FEED_SAVE,
    function* feedSaveSaga({ payload }: IAction<Partial<TActionAllState>>) {
      const { user, feed, actionType } = payload;

      console.log('feed', feed);

      if (actionType === 'add') {
        yield put(feedActions.setPhase('adding'));

        try {
          const { data } = yield API.graphql({
            query: createPost,
            variables: { input: { title: feed.title } }
          });

          if (data) {
            yield put({
              type: feedActionTypes.FEED_UPDATE,
              payload: { feed: data.createPost }
            });
            yield put(feedActions.setPhase('success'));
          } else {
            yield put(feedActions.setPhase('error', 'Error occurred!'));
          }
        } catch (error) {
          yield put(feedActions.setPhase('error', error));
        }

        // const { status, data } = yield axios.post(`${FEEDS_API_URL}`, {
        //   commentsOn: feed.commentsOn,
        //   content: feed.content,
        //   coverPicture: feed.coverPicture,
        //   feedType: feed.feedType,
        //   files: feed.files,
        //   poster: user['@id'],
        //   related: feed.related,
        //   shortText: feed.shortText,
        //   tags: feed.tags,
        //   title: feed.title,
        //   url: feed.url
        // });
      } else if (actionType === 'delete') {
        yield put(feedActions.setPhase('deleting'));

        const { status } = yield axios.delete(`${FEEDS_API_URL}/${feed.id}`);

        if (status !== 204) {
          yield put(feedActions.setPhase('error'));
          return;
        }

        yield put(feedActions.removeFeed(feed));
      } else if (actionType === 'like') {
        yield put(feedActions.setPhase('updating'));

        const { status } = yield axios.post(`${LIKES_API_URL}`, {
          createdBy: user['@id'],
          feed: `/api/feeds/${feed.id}`
        });

        if (status !== 201) {
          yield put(feedActions.setPhase('error'));
          return;
        }
      } else if (actionType === 'unlike') {
        const { likes } = feed;
        const mine = likes.filter((like) => like.createdBy.isMe);

        if (mine.length > 0) {
          const { status } = yield axios.delete(`${LIKES_API_URL}/${mine[0].id}`);

          if (status !== 204) {
            yield put(feedActions.setPhase('error'));
            return;
          }
        }
      } else if (actionType === 'add-comment') {
        yield put(feedActions.setPhase('updating'));

        // feed is coming as { feedId: feed.id, comment: value }
        const { status } = yield axios.post(`${COMMENTS_API_URL}`, {
          createdBy: user['@id'],
          feed: `/api/feeds/${feed.feedId}`,
          comment: feed.comment
        });

        if (status !== 201) {
          yield put(feedActions.setPhase('error'));
          return;
        }

        yield put(feedActions.pullFeed(feed.feedId));
      } else if (actionType === 'update-comment') {
        yield put(feedActions.setPhase('updating'));

        // feed has comment data here
        const { status } = yield axios.patch(`${COMMENTS_API_URL}/${feed.commentId}`, {
          comment: feed.comment
        });

        if (status !== 200) {
          yield put(feedActions.setPhase('error'));
          return;
        }
      } else if (actionType === 'delete-comment') {
        yield put(feedActions.setPhase('deleting'));

        // feed has comment data here
        const { status } = yield axios.delete(`${COMMENTS_API_URL}/${feed.commentId}`);

        if (status !== 204) {
          yield put(feedActions.setPhase('error'));
          return;
        }

        yield put(feedActions.pullFeed(feed.feedId));
      }

      yield put(feedActions.setPhase('success'));
    }
  );
}
