import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import produce from 'immer';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IAction } from 'store/store';
import { INCOME_EXPENSE_API_URL } from 'store/ApiUrls';

export type TPhase = null | 'loading' | 'adding' | 'updating' | 'deleting' | 'error' | 'success';

export interface IAccountCode {
  id: number;
  mainCode: string;
  subCode1: string;
  subCode2: string;
  accountName: string;
  explanation: string;
  isActive: string;
  accountCode: string;
  school: ISchool;
}

export interface IincomeExpense {
  id: number;
  accountCodeInfo: IAccountCode;
  accountCodeId: number;
  accountCodeNumber: string;
  accountCodeName: string;
  accountCodeType: string;
  institutionTitle: string;
  addedAt: Date;
  amount: number;
  explanation: string;
  school: ISchool;
  season: ISeason;
}

interface IincomeExpenseState {
  incomeExpenses: IincomeExpense[];
  phase: TPhase;
}

type TActionAllState = IincomeExpenseState & {
  id: number;
  activeSchool: ISchool;
  activeSeason: ISeason;
  incomeExpense: IincomeExpense;
  incomeExpenseInfo: Partial<IincomeExpense>;
};

export const actionTypes = {
  PULL_INCOME_EXPENSES: 'incomeExpenses/PULL_INCOME_EXPENSES',
  SET_INCOME_EXPENSES: 'incomeExpenses/SET_INCOME_EXPENSES',
  ADD_INCOME_EXPENSE: 'incomeExpenses/ADD_INCOME_EXPENSE',
  UPDATE_INCOME_EXPENSE: 'incomeExpenses/UPDATE_INCOME_EXPENSE',
  DELETE_INCOME_EXPENSE: 'incomeExpenses/DELETE_INCOME_EXPENSE',
  REMOVE_INCOME_EXPENSE: 'incomeExpenses/REMOVE_INCOME_EXPENSE',
  SET_INCOME_EXPENSE: 'incomeExpenses/SET_INCOME_EXPENSE',
  SET_PHASE: 'incomeExpenses/SET_PHASE'
};

export const initialState: IincomeExpenseState = {
  incomeExpenses: [],
  phase: null
};

export const incomeExpensesSelector = createSelector(
  (state: IincomeExpenseState) => objectPath.get(state, ['incomeExpenses', 'incomeExpenses']),
  (incomeExpenses: IincomeExpense[]) => incomeExpenses
);

export const incomeExpensesPhaseSelector = createSelector(
  (state: IincomeExpenseState) => objectPath.get(state, ['incomeExpenses', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'accountCodes' },
  (
    state: IincomeExpenseState = initialState,
    action: IAction<TActionAllState>
  ): IincomeExpenseState => {
    switch (action.type) {
      case actionTypes.SET_INCOME_EXPENSES: {
        const { incomeExpenses } = action.payload;
        return { ...state, incomeExpenses };
      }
      case actionTypes.SET_INCOME_EXPENSE: {
        const { incomeExpense } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.incomeExpenses.findIndex((d) => d.id === incomeExpense.id);
          if (index > -1) {
            draftState.incomeExpenses[index] = incomeExpense;
          } else {
            draftState.incomeExpenses.unshift(incomeExpense);
          }
        });
      }
      case actionTypes.REMOVE_INCOME_EXPENSE: {
        const { id } = action.payload;
        const incomeExpenses = { ...state }.incomeExpenses.filter((d) => d.id !== id);
        return { ...state, incomeExpenses };
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

export const incomeExpensesActions = {
  pullIncomeExpenses: (
    activeSchool: ISchool,
    activeSeason: ISeason
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_INCOME_EXPENSES,
    payload: { activeSchool, activeSeason }
  }),
  setIncomeExpenses: (incomeExpenses: IincomeExpense[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_INCOME_EXPENSES,
    payload: { incomeExpenses }
  }),
  addIncomeExpense: (
    incomeExpenseInfo: Partial<IincomeExpense>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_INCOME_EXPENSE,
    payload: { incomeExpenseInfo }
  }),
  updateIncomeExpense: (
    incomeExpenseInfo: Partial<IincomeExpense>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_INCOME_EXPENSE,
    payload: { incomeExpenseInfo }
  }),
  deleteIncomeExpense: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_INCOME_EXPENSE,
    payload: { id }
  }),
  removeIncomeExpense: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_INCOME_EXPENSE,
    payload: { id }
  }),
  setIncomeExpense: (incomeExpense: IincomeExpense): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_INCOME_EXPENSE,
    payload: { incomeExpense }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_INCOME_EXPENSES,
    function* pullIncomeExpensesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('loading'));

      const { activeSchool, activeSeason } = payload;
      const url = `${INCOME_EXPENSE_API_URL}.json?school=${activeSchool.id}&season=${activeSeason.id}&pagination=false`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }

      yield put(incomeExpensesActions.setIncomeExpenses(response.data));
      yield put(incomeExpensesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.ADD_INCOME_EXPENSE,
    function* addIncomeExpensesSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('adding'));

      const { incomeExpenseInfo } = payload;
      const response = yield axios.post(`${INCOME_EXPENSE_API_URL}`, {
        id: incomeExpenseInfo.id,
        accountCode: `/api/account_codes/${incomeExpenseInfo.accountCodeId}`,
        institutionTitle: incomeExpenseInfo.institutionTitle,
        addedAt: incomeExpenseInfo.addedAt,
        amount: incomeExpenseInfo.amount,
        explanation: incomeExpenseInfo.explanation,
        school: incomeExpenseInfo.school,
        season: incomeExpenseInfo.season
      });

      if (response.status !== 200) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }

      yield put(incomeExpensesActions.setIncomeExpense(response.data));
      yield put(incomeExpensesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_INCOME_EXPENSE,
    function* updateAccountCodeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('updating'));

      const { incomeExpenseInfo } = payload;
      const response = yield axios.patch(`${INCOME_EXPENSE_API_URL}/${incomeExpenseInfo.id}`, {
        accountCode: `/api/account_codes/${incomeExpenseInfo.accountCodeId}`,
        institutionTitle: incomeExpenseInfo.institutionTitle,
        addedAt: incomeExpenseInfo.addedAt,
        amount: incomeExpenseInfo.amount,
        explanation: incomeExpenseInfo.explanation
      });

      if (response.status !== 200) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }

      yield put(incomeExpensesActions.setIncomeExpense(response.data));
      yield put(incomeExpensesActions.setPhase('success'));
    }
  );

  yield takeLatest(
    actionTypes.DELETE_INCOME_EXPENSE,
    function* deleteAccountCodeSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('deleting'));

      const { id } = payload;
      const response = yield axios.delete(`${INCOME_EXPENSE_API_URL}/${id}`);

      if (response.status !== 204) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }
      yield put(incomeExpensesActions.removeIncomeExpense(id));
      yield put(incomeExpensesActions.setPhase('success'));
    }
  );
}
