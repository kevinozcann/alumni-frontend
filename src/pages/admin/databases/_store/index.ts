import * as database from './database';

export const databaseSagas = [database.saga()];
export const databaseReducer = database.reducer;
