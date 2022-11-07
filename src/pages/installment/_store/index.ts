import * as installments from './installment';

export const installmentsSagas = [installments.saga()];
export const installmentsReducer = installments.reducer;
