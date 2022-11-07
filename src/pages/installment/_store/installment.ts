import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import axios from 'axios';
import { ISchool } from 'pages/organization/organization-types';
import { IAction } from 'store/store';
import { INSTALLMENTS_API_URL } from 'store/ApiUrls';
import { IStudent } from 'pages/students/_store/types';

export type TPhase = null | 'loading' | 'adding' | 'updating' | 'deleting' | 'error' | 'success';

export interface Iinstallment {
  id: number;
  school: ISchool;
  studentId: string;
  amount: number;
  installmentDate: Date;
  paymentType: number;
  bankCode: number;
  explanation: string;
  isDownPayment: string;
  promissoryNo: number;
  isDonePayment: number;
  updateDate: Date;
  updaterBy: string;
  addedAt: Date;
  addedBy: string;
  courseId: number;
}

interface IinstallmentState {
  installments: Iinstallment[];
  phase: TPhase;
}

type TActionAllState = IinstallmentState & {
  id: number;
  school: ISchool;
  student: IStudent;
  installment: Iinstallment;
  installmentInfo: Partial<Iinstallment>;
};

export const actionTypes = {
  PULL_INSTALLMENTS: 'installments/PULL_INSTALLMENTS',
  SET_INSTALLMENTS: 'installments/SET_INSTALLMENTS',
  SET_PHASE: 'installments/SET_PHASE'
};

export const initialState: IinstallmentState = {
  installments: [],
  phase: null
};

export const installmentsSelector = createSelector(
  (state: IinstallmentState) => objectPath.get(state, ['installments', 'installments']),
  (installments: Iinstallment[]) => installments
);

export const installmentsPhaseSelector = createSelector(
  (state: IinstallmentState) => objectPath.get(state, ['installments', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'installments' },
  (
    state: IinstallmentState = initialState,
    action: IAction<TActionAllState>
  ): IinstallmentState => {
    switch (action.type) {
      case actionTypes.SET_INSTALLMENTS: {
        const { installments } = action.payload;
        return { ...state, installments };
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

export const installmentsActions = {
  pullStudentInstallments: (student: IStudent): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_INSTALLMENTS,
    payload: { student }
  }),
  setInstallments: (installments: Iinstallment[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_INSTALLMENTS,
    payload: { installments }
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase }
  })
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_INSTALLMENTS,
    function* pullInstallmentsSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(installmentsActions.setPhase('loading'));

      const { student } = payload;
      const url = `${INSTALLMENTS_API_URL}.json?studentId=${student.id}&pagination=false`;
      const response = yield axios.get(url);

      if (response.status !== 200) {
        yield put(installmentsActions.setPhase('error'));
        return;
      }

      yield put(installmentsActions.setInstallments(response.data));
      yield put(installmentsActions.setPhase('success'));
    }
  );
}
