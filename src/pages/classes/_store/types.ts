import { IUser } from 'pages/account/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';

export interface IClass {
  id?: number;
  title: string;
  titleAlt?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  titleAddSubject?: boolean;
  subject?: number;
  teacher?: number;
  room?: number;
  hoursPerWeek?: number;
  credit?: number;
  percentage?: number;
  seat?: number;
  isElective?: boolean;
  assignmentMethod?: string;
  bookbuildingStartsAt?: Date;
  bookbuildingEndsAt?: Date;
  school: number;
  term: number;
  parent?: string;
  children?: IClass[];
}

export interface IOnlineClass {
  id?: number;
  title: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  duration: number;
  class?: number;
  teacher?: number;
  teacherPassword?: string;
  studentPassword?: string;
  addedBy: IUser;
  addedAt?: string;
  slug?: string;
  replayUrl?: string;
  schedule?: number;
  isActive: boolean;
  isPublished?: boolean;
  season?: string | ISeason;
  school?: string | ISchool;
}
