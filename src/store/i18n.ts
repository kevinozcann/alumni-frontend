import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import objectPath from 'object-path';
import { createSelector } from 'reselect';
import axios from 'axios';
import { GLOBAL_LOCALES_URL } from './ApiUrls';
import { ILanguage, TLang } from '../utils/shared-types';
import { IAction } from './store';

interface ILanguagesState {
  lang: TLang;
  languages: ILanguage[];
  error: string;
}
interface IParentLanguagesState {
  i18n: ILanguagesState;
}
type TActionAllState = ILanguagesState & {
  phase: string;
};

export const actionTypes = {
  I18N_SET_LANGUAGE: 'i18n/SET_LANGUAGE',
  I18N_PULL_LANGUAGES: 'i18n/PULL_LANGUAGES',
  I18N_SAVE_LANGUAGES: 'i18n/SAVE_LANGUAGES'
};

export const defaultLanguages: ILanguage[] = [
  {
    id: 1,
    title: 'Arabic',
    localTitle: 'العربية',
    shortCode: 'ar',
    longCode: 'ar-AE',
    icon: 'https://schst.in/arabic',
    svgIcon: 'saudi-arabia.svg'
  },
  {
    id: 2,
    title: 'English',
    localTitle: 'English',
    shortCode: 'en',
    longCode: 'en-US',
    icon: 'https://schst.in/english',
    svgIcon: 'united-states.svg'
  },
  {
    id: 3,
    title: 'German',
    localTitle: 'Deutsch',
    shortCode: 'de',
    longCode: 'de-DE',
    icon: 'https://schst.in/german',
    svgIcon: 'germany.svg'
  },
  {
    id: 4,
    title: 'Spanish',
    localTitle: 'español',
    shortCode: 'es',
    longCode: 'es-ES',
    icon: 'https://schst.in/spanish',
    svgIcon: 'spain.svg'
  },
  {
    id: 5,
    title: 'Turkish',
    localTitle: 'Türkçe',
    shortCode: 'tr',
    longCode: 'tr-TR',
    icon: 'https://schst.in/turkish',
    svgIcon: 'turkey.svg'
  }
];

const initialState: ILanguagesState = {
  lang: null,
  languages: defaultLanguages,
  error: null
};

export const i18nLangSelector = createSelector(
  (state: IParentLanguagesState) => objectPath.get(state, ['i18n', 'lang']),
  (lang: TLang) => lang
);

export const i18nLanguagesSelector = createSelector(
  (state: IParentLanguagesState) => objectPath.get(state, ['i18n', 'languages']),
  (i18nLanguages: ILanguage[]) => i18nLanguages
);

export const reducer = persistReducer(
  { storage, key: 'i18n', whitelist: ['i18n', 'lang', 'languages'] },
  (state: ILanguagesState = initialState, action: IAction<TActionAllState>): ILanguagesState => {
    switch (action.type) {
      case actionTypes.I18N_SET_LANGUAGE: {
        const { lang } = action.payload;
        return { ...state, lang };
      }
      case actionTypes.I18N_PULL_LANGUAGES: {
        return { ...state, error: null };
      }
      case actionTypes.I18N_SAVE_LANGUAGES: {
        const { languages } = action.payload;
        return { ...state, languages, error: null };
      }
      default:
        return state;
    }
  }
);

export const i18nActions = {
  setLanguage: (lang: TLang) => ({ type: actionTypes.I18N_SET_LANGUAGE, payload: { lang } }),
  pullLanguages: () => ({ type: actionTypes.I18N_PULL_LANGUAGES })
};

export function* saga() {
  yield takeLatest(actionTypes.I18N_PULL_LANGUAGES, function* pullLanguagesSaga() {
    // yield put(i18nActions.setLoginPhase('credentials-validating'));

    const response = yield axios.get(`${GLOBAL_LOCALES_URL}.json`);

    if (response.status !== 200) {
      // yield put(authActions.setLoginPhase('login-error', response.error));
      return;
    }

    const { data: languages } = response;

    yield put({
      type: actionTypes.I18N_SAVE_LANGUAGES,
      payload: { languages }
    });
  });
}
