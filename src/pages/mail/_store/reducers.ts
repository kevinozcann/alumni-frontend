import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import produce from 'immer';

import { IAction } from 'store/store';

import { IMailsState, initialState, TActionAllState } from './types';
import { actionTypes } from './actionTypes';

export const reducers = persistReducer(
  {
    storage,
    key: 'mails',
    whitelist: ['mails', 'draft', 'labels', 'isCompose', 'isSidebarOpen', 'phase']
  },
  (state: IMailsState = initialState, action: IAction<TActionAllState>): IMailsState => {
    switch (action.type) {
      case actionTypes.UPDATE_MAILS_IN_STORE: {
        const { mails } = action.payload;
        return { ...state, mails };
      }
      case actionTypes.UPDATE_MAIL_IN_STORE: {
        const { mail } = action.payload;
        const next = produce(state, (draftState) => {
          const index = draftState.mails.findIndex((m) => m.id === mail.id);
          if (index !== -1) {
            draftState.mails[index] = mail;
          }
        });
        return next;
      }
      case actionTypes.UPDATE_DRAFT_IN_STORE: {
        const { email } = action.payload;
        return produce(state, (draft) => {
          draft.draft = email;
        });
      }
      case actionTypes.DELETE_DRAFT_IN_STORE: {
        return produce(state, (draft) => {
          draft.draft = null;
        });
      }
      case actionTypes.UPDATE_COMPOSE: {
        return produce(state, (draft: IMailsState) => {
          draft.isCompose = !draft.isCompose;
        });
      }
      case actionTypes.UPDATE_SIDEBAR: {
        return produce(state, (draft: IMailsState) => {
          draft.isSidebarOpen = !draft.isSidebarOpen;
        });
      }
      case actionTypes.UPDATE_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);
