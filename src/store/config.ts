import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { createSelector } from 'reselect';
import { IGradeLevel } from '../pages/config/grade-levels/grade-types';
import { all, call, put, fork, takeLatest } from '@redux-saga/core/effects';
import produce from 'immer';
import axios from 'axios';

import { TLang } from 'utils/shared-types';
import { getSchoolChildrenIds } from 'utils/getSchoolChildren';
import {
  IGradingTerm,
  ISchool,
  ISeason,
  TConfiguration
} from 'pages/organization/organization-types';
import { ISeasonTable } from 'pages/organization/edit/CopySeasonData';
import { IUser } from 'pages/account/account-types';

import { IAction, TPhase } from './store';
import {
  CONFIGURATIONS_API_URL,
  CONFIGURATION_URL,
  GRADE_LEVEL_API_URL,
  GRADING_TERMS_API_URL,
  SEASONS_API_URL,
  SEASONS_URL,
  updateApiUrl
} from './ApiUrls';
import { getUserSchools } from './user';

//@TODO we shouldn't maintain seasons reducer. Instead, we should use activeSchool.seasons
interface IConfigState {
  currency: string;
  gradeLevels: IGradeLevel[];
  seasons: ISeason[];
  system: string[];
  phase: TPhase;
}
interface IParentCongifState {
  config: IConfigState;
}
type TActionAllState = IConfigState & {
  lang?: TLang;
  user?: IUser;
  id?: number;
  active?: boolean;
  gradeLevel?: IGradeLevel;
  gradeLevelInfo?: Partial<IGradeLevel>;
  season?: ISeason;
  activeSchool?: ISchool;
  seasonInfo?: Partial<ISeason>;
  applyChildren?: boolean;
  gradingTermInfo?: Partial<IGradingTerm>;
  configInfo?: TConfiguration;
  sourceDb?: string;
  destinationDb?: string;
  dataTables?: ISeasonTable[];
};
type TActionType = IAction<Partial<TActionAllState>>;

export const actionTypes = {
  PULL_SYSTEM_CONFIGURATION: 'config/PULL_SYSTEM_CONFIGURATION',
  SET_SYSTEM_CONFIGURATION: 'config/SET_SYSTEM_CONFIGURATION',
  UPDATE_SYSTEM_CONFIG: 'config/UPDATE_SYSTEM_CONFIG',
  SET_SYSTEM_CONFIG: 'config/SET_SYSTEM_CONFIG',
  CONFIG_SET_CURRENCY: 'config/SET_CURRENCY',
  PULL_GRADE_LEVELS: 'config/PULL_GRADE_LEVELS',
  SET_GRADE_LEVELS: 'config/SET_GRADE_LEVELS',
  ADD_GRADE_LEVEL: 'config/ADD_GRADE_LEVEL',
  UPDATE_GRADE_LEVEL: 'config/UPDATE_GRADE_LEVEL',
  SET_GRADE_LEVEL: 'config/SET_GRADE_LEVEL',
  DELETE_GRADE_LEVEL: 'config/DELETE_GRADE_LEVEL',
  REMOVE_GRADE_LEVEL: 'config/REMOVE_GRADE_LEVEL',
  PULL_DATABASES: 'config/PULL_DATABASES',
  SET_DATABASES: 'config/SET_DATABASES',
  ADD_DATABASE: 'config/ADD_DATABASE',
  ADD_SEASON: 'config/ADD_SEASON',
  UPDATE_SEASON: 'config/UPDATE_SEASON',
  DELETE_SEASON: 'config/DELETE_SEASON',
  SET_DEFAULT_SEASON: 'config/SET_DEFAULT_SEASON',
  SET_SEASON: 'config/SET_SEASON',
  COPY_SEASON_DATA: 'config/COPY_SEASON_DATA',
  ADD_GRADING_TERM: 'config/ADD_GRADING_TERM',
  UPDATE_GRADING_TERM: 'config/UPDATE_GRADING_TERM',
  DELETE_GRADING_TERM: 'config/DELETE_GRADING_TERM',
  SET_PHASE: 'config/SET_PHASE'
};

export const initialState = {
  currency: 'TRY',
  gradeLevels: [],
  seasons: [],
  system: [],
  phase: null
};

export const configCurrencySelector = createSelector(
  (state: IParentCongifState) => objectPath.get(state, ['config', 'currency']),
  (currency: string) => currency
);
export const systemConfigSelector = createSelector(
  (state: IParentCongifState) => objectPath.get(state, ['config', 'system']),
  (system: Record<string, string>) => system
);
export const gradeLevelsSelector = createSelector(
  (state: IParentCongifState) => objectPath.get(state, ['config', 'gradeLevels']),
  (gradeLevels: IGradeLevel[]) => gradeLevels
);
export const seasonsSelector = createSelector(
  (state: IParentCongifState) => objectPath.get(state, ['config', 'seasons']),
  (seasons: ISeason[]) => seasons
);
export const configPhaseSelector = createSelector(
  (state: IParentCongifState) => objectPath.get(state, ['config', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'config' },
  (state: IConfigState = initialState, action: TActionType): IConfigState => {
    switch (action.type) {
      case actionTypes.SET_SYSTEM_CONFIGURATION: {
        const { system } = action.payload;
        return { ...state, system };
      }
      case actionTypes.CONFIG_SET_CURRENCY: {
        const { currency } = action.payload;
        return { ...state, currency };
      }
      case actionTypes.SET_GRADE_LEVELS: {
        const { gradeLevels } = action.payload;
        return { ...state, gradeLevels };
      }
      case actionTypes.SET_GRADE_LEVEL: {
        const { gradeLevel } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.gradeLevels.findIndex((d) => d.id === gradeLevel.id);
          if (index > -1) {
            draftState.gradeLevels[index] = gradeLevel;
          } else {
            draftState.gradeLevels.unshift(gradeLevel);
          }
        });
      }
      case actionTypes.REMOVE_GRADE_LEVEL: {
        const { id } = action.payload;
        const gradeLevels = { ...state }.gradeLevels.filter((d) => d.id !== id);
        return { ...state, gradeLevels };
      }
      case actionTypes.SET_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const configActions = {
  pullConfiguration: (): TActionType => ({
    type: actionTypes.PULL_SYSTEM_CONFIGURATION
  }),
  updateConfig: (configInfo: TConfiguration, id?: number): TActionType => ({
    type: actionTypes.UPDATE_SYSTEM_CONFIG,
    payload: { configInfo, id }
  }),
  pullGradeLevels: (active: boolean): TActionType => ({
    type: actionTypes.PULL_GRADE_LEVELS,
    payload: { active }
  }),
  setGradeLevels: (gradeLevels: IGradeLevel[]): TActionType => ({
    type: actionTypes.SET_GRADE_LEVELS,
    payload: { gradeLevels }
  }),
  addGradeLevel: (gradeLevelInfo: Partial<IGradeLevel>): TActionType => ({
    type: actionTypes.ADD_GRADE_LEVEL,
    payload: { gradeLevelInfo }
  }),
  updateGradeLevel: (gradeLevelInfo: Partial<IGradeLevel>): TActionType => ({
    type: actionTypes.UPDATE_GRADE_LEVEL,
    payload: { gradeLevelInfo }
  }),
  deleteGradeLevel: (id: number): TActionType => ({
    type: actionTypes.DELETE_GRADE_LEVEL,
    payload: { id }
  }),
  removeGradeLevel: (id: number): TActionType => ({
    type: actionTypes.REMOVE_GRADE_LEVEL,
    payload: { id }
  }),
  addSeason: (
    lang: TLang,
    user: IUser,
    seasonInfo: Partial<ISeason>,
    applyChildren: boolean,
    activeSchool: ISchool
  ): TActionType => ({
    type: actionTypes.ADD_SEASON,
    payload: { lang, user, seasonInfo, applyChildren, activeSchool }
  }),
  updateSeason: (lang: TLang, user: IUser, seasonInfo: Partial<ISeason>): TActionType => ({
    type: actionTypes.UPDATE_SEASON,
    payload: { lang, user, seasonInfo }
  }),
  deleteSeason: (lang: TLang, user: IUser, id: number): TActionType => ({
    type: actionTypes.DELETE_SEASON,
    payload: { lang, user, id }
  }),
  setDefaultSeason: (lang: TLang, user: IUser, seasons: ISeason[]): TActionType => ({
    type: actionTypes.SET_DEFAULT_SEASON,
    payload: { lang, user, seasons }
  }),
  copySeasonData: (
    lang: TLang,
    sourceDb: string,
    destinationDb: string,
    dataTables: ISeasonTable[]
  ): TActionType => ({
    type: actionTypes.COPY_SEASON_DATA,
    payload: { lang, sourceDb, destinationDb, dataTables }
  }),
  addGradingTerm: (
    lang: TLang,
    user: IUser,
    gradingTermInfo: Partial<IGradingTerm>
  ): TActionType => ({
    type: actionTypes.ADD_GRADING_TERM,
    payload: { lang, user, gradingTermInfo }
  }),
  updateGradingTerm: (
    lang: TLang,
    user: IUser,
    gradingTermInfo: Partial<IGradingTerm>
  ): TActionType => ({
    type: actionTypes.UPDATE_GRADING_TERM,
    payload: { lang, user, gradingTermInfo }
  }),
  deleteGradingTerm: (lang: TLang, user: IUser, id: number): TActionType => ({
    type: actionTypes.DELETE_GRADING_TERM,
    payload: { lang, user, id }
  }),
  setPhase: (phase: TPhase): TActionType => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

// Add season
function* postSeason(season: Partial<ISeason>) {
  yield axios.post(`${SEASONS_API_URL}`, season);
}

// Update season
function* patchSeason(season: Partial<ISeason>) {
  yield axios.patch(`${SEASONS_API_URL}/${season.id}`, season);
}

export function* saga() {
  // Pull system configuration
  yield takeLatest(actionTypes.PULL_SYSTEM_CONFIGURATION, function* pullConfigurationSaga() {
    yield put(configActions.setPhase('loading'));

    // Pull the list of configurations
    const configUrl = updateApiUrl(CONFIGURATION_URL, { lang: 'en' });
    const response = yield axios.get(configUrl);

    if (response.status !== 200) {
      yield put(configActions.setPhase('error'));
      return;
    }

    // Update the store
    yield put({
      type: actionTypes.SET_SYSTEM_CONFIGURATION,
      payload: { system: response.data }
    });
    yield put(configActions.setPhase('success'));
  });

  // Update system configuration
  yield takeLatest(
    actionTypes.UPDATE_SYSTEM_CONFIG,
    function* setSystemConfigSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('updating'));

      // Update the configurations
      const { configInfo, id } = payload;
      if (id) {
        // If there is id then delete
        const response = yield axios.delete(`${CONFIGURATIONS_API_URL}/${id}`);
        if (response.status !== 204) {
          yield put(configActions.setPhase('error'));
          return;
        }
      } else if (configInfo.id) {
        // If configInfo does then update otherwise add
        const response = yield axios.patch(
          `${CONFIGURATIONS_API_URL}/${configInfo.id}`,
          configInfo
        );
        if (response.status !== 200) {
          yield put(configActions.setPhase('error'));
          return;
        }
      } else {
        const response = yield axios.post(CONFIGURATIONS_API_URL, configInfo);
        if (response.status !== 201) {
          yield put(configActions.setPhase('error'));
          return;
        }
      }

      // Update the store
      yield put(configActions.pullConfiguration());
    }
  );

  // Pull grade levels
  yield takeLatest(
    actionTypes.PULL_GRADE_LEVELS,
    function* pullGradeLevelsSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('loading'));

      const { active } = payload;
      const url = active
        ? `${GRADE_LEVEL_API_URL}.json?active=true&order%5BlevelOrder%5D=asc`
        : `${GRADE_LEVEL_API_URL}.json?order%5BlevelOrder%5D=asc`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put(configActions.setGradeLevels(response.data));
      yield put(configActions.setPhase('success'));
    }
  );

  // Update grade levels
  yield takeLatest(
    actionTypes.UPDATE_GRADE_LEVEL,
    function* updateGradeLevelSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('updating'));

      const { gradeLevelInfo } = payload;
      const response = yield axios.patch(
        `${GRADE_LEVEL_API_URL}/${gradeLevelInfo.id}`,
        gradeLevelInfo
      );

      if (response.status !== 200) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.SET_GRADE_LEVEL,
        payload: { gradeLevel: response.data }
      });
      yield put(configActions.setPhase('success'));
    }
  );

  // Add grade level
  yield takeLatest(
    actionTypes.ADD_GRADE_LEVEL,
    function* addGradeLevelSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('adding'));

      const { gradeLevelInfo } = payload;
      const response = yield axios.post(`${GRADE_LEVEL_API_URL}`, gradeLevelInfo);

      if (response.status !== 201) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put({
        type: actionTypes.SET_GRADE_LEVEL,
        payload: { gradeLevel: response.data }
      });
      yield put(configActions.setPhase('success'));
    }
  );

  // Delete grade level
  yield takeLatest(
    actionTypes.DELETE_GRADE_LEVEL,
    function* deleteGradeLevelSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${GRADE_LEVEL_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put(configActions.removeGradeLevel(id));
      yield put(configActions.setPhase('success'));
    }
  );

  // Add season
  yield takeLatest(actionTypes.ADD_SEASON, function* addSeasonSaga({ payload }: TActionType) {
    yield put(configActions.setPhase('adding'));

    const { lang, user, seasonInfo, applyChildren, activeSchool } = payload;
    const response = yield axios.post(`${SEASONS_API_URL}`, seasonInfo);

    if (response.status !== 201) {
      yield put(configActions.setPhase('error'));
      return;
    }

    // if apply all then call the api for children
    if (applyChildren) {
      const childrenIds = getSchoolChildrenIds(activeSchool);

      let season = null;
      for (let i = 0; i < childrenIds.length; i++) {
        const id = childrenIds[i];
        season = Object.assign({}, seasonInfo, { school: `/api/schools/${id}` });
        yield fork(postSeason, season);
      }
    }

    yield put(configActions.setPhase('success'));

    // Update user schools after success to get updated season
    yield call(getUserSchools, lang, user, false);
  });

  // Update season
  yield takeLatest(actionTypes.UPDATE_SEASON, function* updateSeasonSaga({ payload }: TActionType) {
    yield put(configActions.setPhase('updating'));

    const { lang, user, seasonInfo } = payload;
    const response = yield axios.patch(`${SEASONS_API_URL}/${seasonInfo.id}`, seasonInfo);

    if (response.status !== 200) {
      yield put(configActions.setPhase('error'));
      return;
    }

    yield put(configActions.setPhase('success'));

    // Update user schools after success to get updated season
    yield call(getUserSchools, lang, user, false);
  });

  // Delete season
  yield takeLatest(actionTypes.DELETE_SEASON, function* deleteSeasonSaga({ payload }: TActionType) {
    yield put(configActions.setPhase('deleting'));

    const { lang, user, id } = payload;
    const response = yield axios.delete(`${SEASONS_API_URL}/${id}`);

    if (response.status !== 204) {
      yield put(configActions.setPhase('error'));
      return;
    }

    yield put(configActions.setPhase('success'));

    // Update user schools after success to get updated season
    yield call(getUserSchools, lang, user, false);
  });

  // Set default season
  yield takeLatest(
    actionTypes.SET_DEFAULT_SEASON,
    function* setDefaultSeasonSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('updating'));

      const { lang, user, seasons } = payload;
      yield all(
        seasons.map((season) => call(patchSeason, { id: season.id, isDefault: season.isDefault }))
      );

      yield put(configActions.setPhase('success'));

      yield call(getUserSchools, lang, user, false);
    }
  );

  // Copy season data
  yield takeLatest(
    actionTypes.COPY_SEASON_DATA,
    function* copySeasonDataSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('updating'));

      const { lang, sourceDb, destinationDb, dataTables } = payload;
      const tables = dataTables.map((t) => t.name).join(',');

      const seasonsUrl = updateApiUrl(SEASONS_URL, { lang });
      const response = yield axios.post(seasonsUrl, { sourceDb, destinationDb, tables });

      if (response.status !== 200) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put(configActions.setPhase('success'));
    }
  );

  // Add grading term
  yield takeLatest(
    actionTypes.ADD_GRADING_TERM,
    function* addGradingTermSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('adding'));

      const { lang, user, gradingTermInfo } = payload;
      const response = yield axios.post(`${GRADING_TERMS_API_URL}`, gradingTermInfo);

      if (response.status !== 201) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put(configActions.setPhase('success'));

      yield call(getUserSchools, lang, user, false);
    }
  );

  // Update grading term
  yield takeLatest(
    actionTypes.UPDATE_GRADING_TERM,
    function* updateGradingTermSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('updating'));

      const { lang, user, gradingTermInfo } = payload;
      const response = yield axios.patch(
        `${GRADING_TERMS_API_URL}/${gradingTermInfo.id}`,
        gradingTermInfo
      );

      if (response.status !== 200) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put(configActions.setPhase('success'));

      yield call(getUserSchools, lang, user, false);
    }
  );

  // Delete grading term
  yield takeLatest(
    actionTypes.DELETE_GRADING_TERM,
    function* deleteGradingTermSaga({ payload }: TActionType) {
      yield put(configActions.setPhase('deleting'));

      const { lang, user, id } = payload;
      const response = yield axios.delete(`${GRADING_TERMS_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(configActions.setPhase('error'));
        return;
      }

      yield put(configActions.setPhase('success'));

      yield call(getUserSchools, lang, user, false);
    }
  );
}
