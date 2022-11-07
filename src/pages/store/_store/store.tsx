import axios from 'axios';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { persistReducer } from 'redux-persist';
import { put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { STORE_CUSTOMER_TOKEN_URL, STORE_TOKEN_API_URL, updateApiUrl } from 'store/ApiUrls';
import { AppError, IAction } from 'store/store';
import { TLang } from 'utils/shared-types';
import { IPersonal, IUser } from 'pages/account/account-types';
import { IStudent } from 'pages/students/_store/types';

interface IStoreState {
  apiToken: string;
  storeUrl: string;
  customer: any;
  phase: string;
  error: AppError;
}
interface IStoreParent {
  store: IStoreState;
}
type IActionStoreState = {
  lang?: TLang;
  user?: IUser;
  activeStudent?: IStudent;
  personal?: IPersonal;
  schoolId?: number;
  customer?: any;
  storeUrl?: string;
  apiToken?: string;
};

export const storeActionTypes = {
  GET_TOKEN: 'store/GET_TOKEN',
  GET_CUSTOMER: 'store/GET_CUSTOMER',
  SAVE_CUSTOMER: 'store/SAVE_CUSTOMER',
  RESET_STORE: 'store/RESET_STORE',
  SAVE_TOKEN: 'store/SAVE_TOKEN',
  SAVE_PHASE: 'store/SAVE_PHASE'
};

const initialState: IStoreState = {
  apiToken: null,
  storeUrl: null,
  customer: null,
  phase: null,
  error: null
};

export const storeDataSelector = createSelector(
  (state: IStoreParent) => objectPath.get(state, ['store']),
  (store: IStoreState) => store
);
export const storeApiTokenSelector = createSelector(
  (state: IStoreParent) => objectPath.get(state, ['store', 'apiToken']),
  (apiToken: string) => apiToken
);
export const storeUrlSelector = createSelector(
  (state: IStoreParent) => objectPath.get(state, ['store', 'storeUrl']),
  (storeUrl: string) => storeUrl
);
export const storeCustomerSelector = createSelector(
  (state: IStoreParent) => objectPath.get(state, ['store', 'customer']),
  (customer: string) => customer
);
export const storePhaseSelector = createSelector(
  (state: IStoreParent) => objectPath.get(state, ['store', 'phase']),
  (phase: string) => phase
);
export const storeErrorSelector = createSelector(
  (state: IStoreParent) => objectPath.get(state, ['store', 'error']),
  (error: string) => error
);

export const reducer = persistReducer(
  {
    storage,
    key: 'store',
    whitelist: ['apiToken', 'storeUrl', 'customer', 'phase', 'error']
  },
  (state: IStoreState = initialState, action: IAction<IStoreState>): IStoreState => {
    switch (action.type) {
      case storeActionTypes.SAVE_TOKEN: {
        const { apiToken, storeUrl } = action.payload;
        return { ...state, apiToken, storeUrl };
      }
      case storeActionTypes.SAVE_CUSTOMER: {
        const { customer } = action.payload;
        return { ...state, customer };
      }
      case storeActionTypes.RESET_STORE: {
        return { ...state, storeUrl: null, apiToken: null, customer: null, phase: null };
      }
      case storeActionTypes.SAVE_PHASE: {
        const { phase, error } = action.payload;
        if (error) {
          return { ...state, apiToken: null, storeUrl: null, phase, error };
        } else {
          return { ...state, phase, error };
        }
      }
      default:
        return state;
    }
  }
);

export const storeActions = {
  getApiToken: (lang: TLang, schoolId: number) => ({
    type: storeActionTypes.GET_TOKEN,
    payload: { lang, schoolId }
  }),
  getCustomer: (
    lang: TLang,
    schoolId: number,
    user: IUser,
    activeStudent: IStudent,
    personal: IPersonal,
    storeUrl: string,
    apiToken: string
  ) => ({
    type: storeActionTypes.GET_CUSTOMER,
    payload: { lang, schoolId, user, activeStudent, personal, storeUrl, apiToken }
  }),
  resetStore: () => ({
    type: storeActionTypes.RESET_STORE
  }),
  setPhase: (phase: string, error?: AppError) => ({
    type: storeActionTypes.SAVE_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(
    storeActionTypes.GET_TOKEN,
    function* getApiTokenSaga({ payload }: IAction<Partial<IActionStoreState>>) {
      yield put(storeActions.setPhase('pulling'));

      const { lang, schoolId } = payload;
      const storeTokenUrl = updateApiUrl(STORE_TOKEN_API_URL, { lang, schoolId });
      const response = yield axios.get(storeTokenUrl);

      if (response.status !== 200) {
        yield put(storeActions.setPhase('error'));
        return;
      }

      const { data } = response;
      const { apiToken, storeUrl, error } = data;
      if (error) {
        yield put(storeActions.setPhase('error', error));
        return;
      }

      yield put({
        type: storeActionTypes.SAVE_TOKEN,
        payload: { apiToken, storeUrl }
      });
      yield put(storeActions.setPhase('success'));
    }
  );

  yield takeLatest(
    storeActionTypes.GET_CUSTOMER,
    function* getCustomerSaga({ payload }: IAction<Partial<IActionStoreState>>) {
      yield put(storeActions.setPhase('pulling'));

      const { lang, schoolId, user, activeStudent, personal, storeUrl, apiToken } = payload;

      const storeCustomerIdUrl = updateApiUrl(STORE_CUSTOMER_TOKEN_URL, { lang, schoolId });
      const response = yield axios.post(storeCustomerIdUrl, {
        storeUrl,
        apiToken,
        firstname: user.userType.id === 9 ? activeStudent.name : user.name,
        lastname: user.userType.id === 9 ? activeStudent.lastname : user.lastName,
        email: user.userType.id === 9 ? activeStudent.email : user.email,
        telephone: personal?.phone || '',
        address: personal?.homeAddress || '',
        altAddress: personal?.workAddress || ''
      });

      const { data } = response;
      if (response.status !== 200 || data.error) {
        yield put(storeActions.setPhase('error', data.error));
        return;
      }

      const { customer } = data;
      yield put({
        type: storeActionTypes.SAVE_CUSTOMER,
        payload: { customer }
      });
      yield put(storeActions.setPhase('success'));
    }
  );
}
