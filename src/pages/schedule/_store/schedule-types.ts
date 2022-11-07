import { IClassType } from 'pages/classes/types/_store/classTypes';
import { IClass } from 'pages/classes/_store/types';
import { ISchool } from 'pages/organization/organization-types';
import { IPerson } from 'pages/personnel/_store/types';

export interface ISchedule {
  id: number;
  week: number;
  batchCodes: string;
  classId: IClass;
  studentCodes: string;
  teacherId: IPerson;
  classBranchId: number;
  examId: number;
  examSessionId: number;
  examTitle: string;
  annualPlanId: number;
  curriculumId: number;
  enterDateTime: Date;
  exitDateTime: Date;
  scheduleDate: Date;
  enterTime: string;
  exitTime: string;
  hourId: number;
  classHourId: number;
  isDone: string;
  classTypeId: IClassType;
  classroomId: number;
  roomId: number;
  watchAreaId: number;
  ptmId: number;
  isDoneAttendance: string;
  notes: string;
  addedBy: string;
  addedAt: Date;
  isRecompense: string;
  recompenseId: number;
  school: ISchool;
}
