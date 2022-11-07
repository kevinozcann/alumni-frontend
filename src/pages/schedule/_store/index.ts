import * as schedules from './schedule';

export const schedulesSagas = [schedules.saga()];
export const schedulesReducer = schedules.reducer;
