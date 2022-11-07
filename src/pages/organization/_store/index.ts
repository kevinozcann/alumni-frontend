import * as school from './school';

export const organizationSagas = [school.saga()];

export const organizationReducer = school.reducer;
