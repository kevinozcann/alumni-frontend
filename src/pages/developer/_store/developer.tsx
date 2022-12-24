import axios from 'axios';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { IUser } from 'pages/auth/data/account-types';
import { USER_GENERATE_API_KEY_URL, updateApiUrl } from 'store/ApiUrls';
import { AppError, IAction } from 'store/store';
import { JWT_EXPIRES_IN, JWT_SECRET, sign } from 'utils/jwt';
import { TLang } from 'utils/shared-types';
import { authActionTypes } from 'pages/auth/services/types';

interface IDeveloperState {
  phase: string;
  error: AppError;
}
interface IDeveloperParent {
  developer: IDeveloperState;
}

type TActionDeveloperState = IDeveloperState & {
  lang?: TLang;
  user?: IUser;
};

export const developerActionTypes = {
  GENERATE_API_KEY: 'developer/GENERATE_API_KEY',
  SAVE_PHASE: 'developer/SAVE_PHASE'
};
const initialState: IDeveloperState = {
  phase: null,
  error: null
};

export const developerDataSelector = createSelector(
  (state: IDeveloperParent) => objectPath.get(state, ['developer']),
  (developer: IDeveloperState) => developer
);

export const reducer = persistReducer(
  {
    storage,
    key: 'developer',
    whitelist: ['phase', 'error']
  },
  (state: IDeveloperState = initialState, action: IAction<IDeveloperState>): IDeveloperState => {
    switch (action.type) {
      case developerActionTypes.SAVE_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const developerActions = {
  generateApiKey: (lang: TLang, user: IUser) => ({
    type: developerActionTypes.GENERATE_API_KEY,
    payload: { lang, user }
  }),
  setPhase: (phase: string, error: AppError): IAction<IDeveloperState> => ({
    type: developerActionTypes.SAVE_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(
    developerActionTypes.GENERATE_API_KEY,
    function* generateApiKeySaga({ payload }: IAction<TActionDeveloperState>) {
      const { lang, user } = payload;
      yield put(developerActions.setPhase('generating', null));

      const generateApiKeyUrl = updateApiUrl(USER_GENERATE_API_KEY_URL, {
        lang,
        userId: user.id
      });
      const response = yield axios.get(generateApiKeyUrl);

      if (response.status !== 200) {
        yield put(
          developerActions.setPhase('error', {
            key: 'no_response',
            title: 'Response did not return 200'
          })
        );
        return;
      }

      const { data } = response;
      if (!data.apiKey) {
        yield put(
          developerActions.setPhase('error', {
            key: 'no_key',
            title: 'developer.generate.nokey'
          })
        );
        return;
      }

      const newApiKey = data.apiKey;
      const jwtAccessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      // Update tokens in the store
      yield put({
        type: authActionTypes.SAGA.AUTH_TOKEN_SAVE_WITH_USER,
        payload: { authToken: newApiKey, accessToken: jwtAccessToken }
      });

      // Update user token in the store
      const updatedUser = Object.assign({}, user, { accessToken: newApiKey });
      yield put({
        type: authActionTypes.SAGA.AUTH_UPDATE_USER,
        payload: { user: updatedUser }
      });

      yield put(developerActions.setPhase('generation_successful', null));
    }
  );
}
