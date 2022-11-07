import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import produce from 'immer';
import { ISchool } from 'pages/organization/organization-types';
import { IAction } from 'store/store';
import { ACCOUNT_CODES_API_URL } from 'store/ApiUrls';

export type TPhase = null | 'loading' | 'adding' | 'updating' | 'deleting' | 'error' | 'success';

export interface IAccountCode {
  id: number;
  mainCode: string;
  subCode1: string;
  subCode2: string;
  accountName: string;
  explanation: string;
  isActive: string;
  accountType: string;
  accountCode: string;
  school: ISchool;
}

interface IAccountCodesState {
  accountCodes: IAccountCode[];
  phase: TPhase;
}

type TActionAllState = IAccountCodesState & {
  id: number;
  activeSchool: ISchool;
  accountCode: IAccountCode;
  accountCodeInfo: Partial<IAccountCode>;
};

export const actionTypes = {
  PULL_ACCOUNT_CODES: 'accountCodes/PULL_ACCOUNT_CODES',
  SET_ACCOUNT_CODES: 'accountCodes/SET_ACCOUNT_CODES',
  ADD_ACCOUNT_CODE: 'accountCodes/ADD_ACCOUNT_CODE',
  UPDATE_ACCOUNT_CODE: 'accountCodes/UPDATE_ACCOUNT_CODE',
  DELETE_ACCOUNT_CODE: 'accountCodes/DELETE_ACCOUNT_CODE',
  REMOVE_ACCOUNT_CODE: 'accountCodes/REMOVE_ACCOUNT_CODE',
  SET_ACCOUNT_CODE: 'accountCodes/SET_ACCOUNT_CODE',
  SET_PHASE: 'accountCodes/SET_PHASE'
};

export const initialState: IAccountCodesState = {
  accountCodes: [],
  phase: null
};

export const accountCodesSelector = createSelector(
  (state: IAccountCodesState) => objectPath.get(state, ['accountCodes', 'accountCodes']),
  (accountCodes: IAccountCode[]) => accountCodes
);
export const accountCodesPhaseSelector = createSelector(
  (state: IAccountCodesState) => objectPath.get(state, ['accountCodes', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'accountCodes' },
  (
    state: IAccountCodesState = initialState,
    action: IAction<TActionAllState>
  ): IAccountCodesState => {
    switch (action.type) {
      case actionTypes.SET_ACCOUNT_CODES: {
        const { accountCodes } = action.payload;
        return { ...state, accountCodes };
      }
      case actionTypes.SET_ACCOUNT_CODE: {
        const { accountCode } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.accountCodes.findIndex((d) => d.id === accountCode.id);
          if (index > -1) {
            draftState.accountCodes[index] = accountCode;
          } else {
            draftState.accountCodes.unshift(accountCode);
          }
        });
      }
      case actionTypes.REMOVE_ACCOUNT_CODE: {
        const { id } = action.payload;
        const accountCodes = { ...state }.accountCodes.filter((d) => d.id !== id);
        return { ...state, accountCodes };
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

export const accountCodesActions = {
  pullAccountCodes: (activeSchool: ISchool): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_ACCOUNT_CODES,
    payload: { activeSchool }
  }),
  setAccountCodes: (accountCodes: IAccountCode[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_ACCOUNT_CODES,
    payload: { accountCodes }
  }),
  addAccountCode: (accountCodeInfo: Partial<IAccountCode>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_ACCOUNT_CODE,
    payload: { accountCodeInfo }
  }),
  updateAccountCode: (
    accountCodeInfo: Partial<IAccountCode>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_ACCOUNT_CODE,
    payload: { accountCodeInfo }
  }),
  deleteAccountCode: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_ACCOUNT_CODE,
    payload: { id }
  }),
  removeAccountCode: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_ACCOUNT_CODE,
    payload: { id }
  }),
  setAccountCode: (accountCode: IAccountCode): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_ACCOUNT_CODE,
    payload: { accountCode }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_ACCOUNT_CODES,
    function* pullAccountCodesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(accountCodesActions.setPhase('loading'));

      const { activeSchool } = payload;
      const url = `${ACCOUNT_CODES_API_URL}.json?school=${activeSchool.id}&pagination=false`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(accountCodesActions.setPhase('error'));
        return;
      }

      yield put(accountCodesActions.setAccountCodes(response.data));
      yield put(accountCodesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.ADD_ACCOUNT_CODE,
    function* addAccountCodesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(accountCodesActions.setPhase('adding'));

      const { accountCodeInfo } = payload;
      const response = yield axios.post(`${ACCOUNT_CODES_API_URL}`, accountCodeInfo);

      if (response.status !== 200) {
        yield put(accountCodesActions.setPhase('error'));
        return;
      }

      yield put(accountCodesActions.setAccountCode(response.data));
      yield put(accountCodesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_ACCOUNT_CODE,
    function* updateAccountCodeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(accountCodesActions.setPhase('updating'));

      const { accountCodeInfo } = payload;
      const response = yield axios.patch(
        `${ACCOUNT_CODES_API_URL}/${accountCodeInfo.id}`,
        accountCodeInfo
      );

      if (response.status !== 200) {
        yield put(accountCodesActions.setPhase('error'));
        return;
      }

      yield put(accountCodesActions.setAccountCode(response.data));
      yield put(accountCodesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.DELETE_ACCOUNT_CODE,
    function* deleteAccountCodeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(accountCodesActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${ACCOUNT_CODES_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(accountCodesActions.setPhase('error'));
        return;
      }

      yield put(accountCodesActions.removeAccountCode(id));
      yield put(accountCodesActions.setPhase('success'));
    }
  );
}
