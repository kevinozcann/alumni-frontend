import * as accountCodes from './account-codes';

export const accountCodesSagas = [accountCodes.saga()];
export const accountCodesReducer = accountCodes.reducer;
