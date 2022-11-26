import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import objectPath from 'object-path';
import axios from 'axios';

import { SCHOOLS_API_URL } from 'store/ApiUrls';
import { IAction } from 'store/store';
import { userActions } from 'store/user';
import { TLang } from 'utils/shared-types';
import { IFilter } from 'components/filter/Filter';
import { IUser } from 'pages/account/account-types';

import { ISchool } from '../organization-types';
import { TSchoolFormValues } from '../add/AddSchool';

interface ISchoolState {
  school?: ISchool;
  filters?: IFilter[];
  phase?: string;
}
interface IOrganizationState {
  organization: ISchoolState;
}
type IActionSchoolState = ISchoolState & {
  user?: IUser;
  lang?: TLang;
  schoolId?: number;
  activeSchoolId?: number;
  schoolInfo?: Partial<ISchool>;
  values?: TSchoolFormValues;
};

export const schoolActionTypes = {
  SCHOOL_PULL: 'school/SCHOOL_PULL',
  SCHOOL_SET: 'school/SCHOOL_SET',
  SCHOOL_ADD: 'school/SCHOOL_ADD',
  SCHOOL_UPDATE: 'school/SCHOOL_UPDATE',
  SCHOOL_DELETE: 'school/SCHOOL_DELETE',
  SCHOOL_RESET: 'school/SCHOOL_RESET',
  SCHOOL_PHASE: 'school/SCHOOL_PHASE',
  SCHOOL_FILTERS: 'school/SCHOOL_FILTERS',
  SCHOOL_UPDATE_SIDEBAR: 'SCHOOL_UPDATE_SIDEBAR'
};

const initialState: ISchoolState = {
  school: null,
  filters: [],
  phase: null
};

export const schoolSelector = createSelector(
  (state: IOrganizationState) => objectPath.get(state, ['organization', 'school']),
  (school: ISchool) => school
);
export const schoolFiltersSelector = createSelector(
  (state: IOrganizationState) => objectPath.get(state, ['organization', 'filters']),
  (filters: IFilter[]) => filters
);
export const schoolPhaseSelector = createSelector(
  (state: IOrganizationState) => objectPath.get(state, ['organization', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  {
    storage,
    key: 'school'
  },
  (state: ISchoolState = initialState, action: IAction<ISchoolState>): ISchoolState => {
    switch (action.type) {
      case schoolActionTypes.SCHOOL_PULL: {
        return { ...state, phase: null };
      }
      case schoolActionTypes.SCHOOL_SET: {
        const { school } = action.payload;
        return { ...state, school };
      }
      case schoolActionTypes.SCHOOL_RESET: {
        return { ...state, school: null };
      }
      case schoolActionTypes.SCHOOL_FILTERS: {
        const { filters } = action.payload;
        return { ...state, filters };
      }
      case schoolActionTypes.SCHOOL_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const schoolActions = {
  pullSchoolInfo: (schoolId: number): IAction<{ schoolId: number }> => ({
    type: schoolActionTypes.SCHOOL_PULL,
    payload: { schoolId }
  }),
  addSchool: (
    user: IUser,
    lang: TLang,
    values: TSchoolFormValues
  ): IAction<IActionSchoolState> => ({
    type: schoolActionTypes.SCHOOL_ADD,
    payload: { user, lang, values }
  }),
  updateSchoolInfo: (school: ISchool): IAction<ISchoolState> => ({
    type: schoolActionTypes.SCHOOL_SET,
    payload: { school }
  }),
  saveSchoolInfo: (
    user: IUser,
    lang: TLang,
    schoolId: number,
    schoolInfo: Partial<ISchool>
  ): IAction<IActionSchoolState> => ({
    type: schoolActionTypes.SCHOOL_UPDATE,
    payload: { user, lang, schoolId, schoolInfo }
  }),
  deleteSchool: (
    user: IUser,
    lang: TLang,
    activeSchoolId: number,
    schoolId: number
  ): IAction<IActionSchoolState> => ({
    type: schoolActionTypes.SCHOOL_DELETE,
    payload: { lang, user, activeSchoolId, schoolId }
  }),
  setSchoolInfo: (school: ISchool): IAction<ISchoolState> => ({
    type: schoolActionTypes.SCHOOL_SET,
    payload: { school }
  }),
  setFilters: (filters: IFilter[]): IAction<ISchoolState> => ({
    type: schoolActionTypes.SCHOOL_FILTERS,
    payload: { filters }
  }),
  setPhase: (phase: string): IAction<ISchoolState> => ({
    type: schoolActionTypes.SCHOOL_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    schoolActionTypes.SCHOOL_PULL,
    function* schoolPullSaga({ payload }: IAction<{ schoolId: number }>) {
      yield put(schoolActions.setPhase('loading'));

      const { schoolId } = payload;
      const response = yield axios.get(`${SCHOOLS_API_URL}/${schoolId}`);

      if (response.status !== 200) {
        yield put(schoolActions.setPhase('error'));
        return;
      }

      yield put({
        type: schoolActionTypes.SCHOOL_SET,
        payload: { school: response.data }
      });
      yield put(schoolActions.setPhase('success'));
    }
  );

  yield takeLatest(
    schoolActionTypes.SCHOOL_ADD,
    function* schoolAddSaga({ payload }: IAction<IActionSchoolState>) {
      yield put(schoolActions.setPhase('school-adding'));

      // const { user, lang, schoolId, schoolInfo } = payload;
      const { user, lang, values } = payload;
      const schoolInfo: Partial<ISchool> = {
        title: values.title,
        menuTitle: values.title,
        founder: '',
        representative: '',
        countryCode: values.countryCode,
        principal: '',
        phone1: '',
        phone2: '',
        fax: '',
        email: values.email,
        address: '',
        zip: '',
        ibCode: '',
        ceebCode: '',
        picture: '',
        favicon: '',
        smallLogo: '',
        normalLogo: '',
        bigLogo: '',
        googleLink: '',
        googleMap: '',
        timezone: values.timezone,
        type: values.schoolType,
        parent: `/api/schools/${values.parentSchoolId}`,
        classLevels: values.grades?.join(','),
        // seasons: values.seasons?.map((s) => s['@id']),
        configuration: [
          {
            configKey: 'address',
            configValue: ''
          },
          {
            configKey: 'adminEmail',
            configValue: values.config?.adminEmail || ''
          },
          {
            configKey: 'checkServerName',
            configValue: values.config?.checkServerName || '0'
          },
          {
            configKey: 'cityId',
            configValue: ''
          },
          {
            configKey: 'countryId',
            configValue: values.countryCode
          },
          {
            configKey: 'email',
            configValue: values.email
          },
          {
            configKey: 'favicon',
            configValue: values.config?.favicon || ''
          },
          {
            configKey: 'fileServerUrl',
            configValue: values.config?.fileServerUrl || ''
          },
          {
            configKey: 'language',
            configValue: values.language || 'en'
          },
          {
            configKey: 'loginScreenBgColor',
            configValue: values.config?.loginScreenBgColor || 'bg-black'
          },
          {
            configKey: 'loginScreenBgImage',
            configValue: values.config?.loginScreenBgImage || ''
          },
          {
            configKey: 'logo',
            configValue: values.config?.logo || ''
          },
          {
            configKey: 'parentSelfRegistration',
            configValue: values.config?.parentSelfRegistration || '0'
          },
          {
            configKey: 'phone',
            configValue: values.config?.phone || ''
          },
          {
            configKey: 'realIpHeader',
            configValue: values.config?.realIpHeader || 'REMOTE_ADDR'
          },
          {
            configKey: 'saveUserLogs',
            configValue: values.config?.saveUserLogs || '0'
          },
          {
            configKey: 'showBgColorOnMobile',
            configValue: values.config?.showBgColorOnMobile || 'off'
          },
          {
            configKey: 'showBgColorSetting',
            configValue: values.config?.showBgColorSetting || '0'
          },
          {
            configKey: 'showBranches',
            configValue: values.config?.showBranches || '0'
          },
          {
            configKey: 'sitename',
            configValue: values.title
          },
          {
            configKey: 'slogan',
            configValue: values.config?.slogan || ''
          },
          {
            configKey: 'startDate',
            configValue: new Date().toJSON().slice(0, 10)
          },
          {
            configKey: 'stateId',
            configValue: ''
          },
          {
            configKey: 'studentSelfRegistration',
            configValue: values.config?.studentSelfRegistration || '0'
          },
          {
            configKey: 'supportEmail',
            configValue: 'support@smartclass.com.tr'
          },
          {
            configKey: 'timezone',
            configValue: values.timezone
          },
          {
            configKey: 'url',
            configValue: ''
          },
          {
            configKey: 'useAutomation',
            configValue: 'false'
          },
          {
            configKey: 'website',
            configValue: ''
          },
          {
            configKey: 'zipCode',
            configValue: ''
          },
          {
            configKey: 'institutionType',
            configValue: values.institutionType
          },
          {
            configKey: 'embed_form_url',
            configValue: values.config?.embed_form_url || ''
          }
        ]
      };
      const response = yield axios.post(`${SCHOOLS_API_URL}`, schoolInfo);

      if (response.status !== 201) {
        yield put(schoolActions.setPhase('school-adding-error'));
        return;
      }

      const { data } = response;
      const { id: newSchoolId } = data;

      // Update organization schools
      yield put(schoolActions.pullSchoolInfo(values.parentSchoolId));

      // Update user schools
      // @TODO check this if we can refactor
      yield put(userActions.updateUserSchools(lang, user));
      yield put(schoolActions.setPhase('school-adding-success'));
    }
  );

  yield takeLatest(
    schoolActionTypes.SCHOOL_UPDATE,
    function* schoolUpdateSaga({ payload }: IAction<IActionSchoolState>) {
      yield put(schoolActions.setPhase('school-updating'));

      // const { user, lang, schoolId, schoolInfo } = payload;
      const { schoolId, schoolInfo } = payload;
      const response = yield axios.patch(`${SCHOOLS_API_URL}/${schoolId}`, schoolInfo);
      if (response.status !== 200) {
        yield put(schoolActions.setPhase('school-updating-error'));
        return;
      }

      yield put(schoolActions.updateSchoolInfo(response.data));
      yield put(schoolActions.setPhase('school-updating-success'));

      // Get user related data such as schools, menus, etc
      // yield put(authActions.updateUserData(lang, user));
    }
  );

  yield takeLatest(
    schoolActionTypes.SCHOOL_DELETE,
    function* schoolDeleteSaga({ payload }: IAction<IActionSchoolState>) {
      yield put(schoolActions.setPhase('school-deleting'));

      const { lang, user, activeSchoolId, schoolId } = payload;
      const response = yield axios.delete(`${SCHOOLS_API_URL}/${schoolId}`);

      if (response.status !== 204) {
        yield put(schoolActions.setPhase('school-deleting-error'));
        return;
      }

      // Update organization schools
      yield put(schoolActions.pullSchoolInfo(activeSchoolId));

      // Update user schools
      yield put(userActions.updateUserSchools(lang, user));
      yield put(schoolActions.setPhase('school-deleting-success'));
    }
  );
}
