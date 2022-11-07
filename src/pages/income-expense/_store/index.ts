import * as incomeExpenses from './income-expense';

export const incomeExpensesSagas = [incomeExpenses.saga()];
export const incomeExpensesReducer = incomeExpenses.reducer;
